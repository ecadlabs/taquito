import operationVectors from './detached-operation-vectors';
import { ContractMethodObject } from '../../src/contract/contract-methods/contract-method-object-param';
import { ParameterSchema } from '@taquito/michelson-encoder';
import { TezosToolkit, OpKind } from '../../src/taquito';
import vectors from './detached-signing-vectors';
import { fixtureServer } from './detached-test-server';

describe('detached signing', () => {
  let server: Awaited<ReturnType<typeof fixtureServer>>;
  beforeEach(async () => {
    server = await fixtureServer();
  });
  afterEach(async () => {
    await server.close();
  });
  const vector = vectors.vectors[0];
  const params = {
    to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
    amount: 1,
    mutez: true,
    fee: 1000,
    gasLimit: 1040,
    storageLimit: 0,
  };
  it('prepares a transfer using only public identity', async () => {
    const workflow = new TezosToolkit(server.url).prepareFor({ pkh: vector.pkh });
    const prepared = await workflow.prepare.transaction(params);
    expect(prepared.opOb.contents).toEqual(vector.operation.contents);
    expect(prepared.opOb.branch).toBe(vector.operation.branch);
    expect('toPreapply' in workflow.prepare).toBe(false);
  });

  it('does not call a configured signer when preparing a reveal', async () => {
    const tezos = new TezosToolkit(server.url);
    const forbidden = async (): Promise<never> => {
      throw new Error('Signer accessed');
    };
    tezos.setSignerProvider({
      publicKeyHash: forbidden,
      publicKey: forbidden,
      secretKey: forbidden,
      sign: forbidden,
      provePossession: forbidden,
    });
    server.setRevealed(false);
    const prepared = await tezos.prepareFor(vector).prepare.transaction(params);
    expect(prepared.opOb.contents).toMatchObject([
      { kind: 'reveal', public_key: vector.publicKey },
      { kind: 'transaction', source: vector.pkh },
    ]);
  });
  it('requires a public key only when reveal is needed', async () => {
    const workflow = new TezosToolkit(server.url).prepareFor({ pkh: vector.pkh });
    server.setRevealed(false);
    await expect(workflow.prepare.transaction(params)).rejects.toThrow();
  });
  it('rejects mismatched keys and non-BLS proofs at creation', () => {
    const tezos = new TezosToolkit(server.url);
    expect(() => tezos.prepareFor({ ...vector, publicKey: vectors.vectors[1].publicKey })).toThrow(
      'match'
    );
    expect(() => tezos.prepareFor({ ...vector, proof: vector.signature })).toThrow('BLS');
  });
  it('rejects different sources before RPC access', () => {
    const workflow = new TezosToolkit(server.url).prepareFor(vector);
    expect(() => workflow.prepare.transaction({ ...params, source: params.to })).toThrow('source');
    expect(server.requests).toHaveLength(0);
  });
  it('keeps separate identities independent', async () => {
    const tezos = new TezosToolkit(server.url);
    const [first, second] = await Promise.all([
      tezos.prepareFor(vector).prepare.transaction(params),
      tezos.prepareFor(vectors.vectors[1]).prepare.transaction(params),
    ]);
    expect(first.opOb.contents[0]).toMatchObject({ source: vector.pkh });
    expect(second.opOb.contents[0]).toMatchObject({ source: vectors.vectors[1].pkh });
  });
  it('rejects empty and explicit reveal batches', () => {
    const workflow = new TezosToolkit(server.url).prepareFor(vector);
    expect(() => workflow.prepare.batch([])).toThrow('empty');
    // Plain JavaScript can supply unsupported kinds.
    expect(() => workflow.prepare.batch(JSON.parse('[{"kind":"reveal"}]'))).toThrow('Unsupported');
  });
  it('captures the default reader when toolkit RPC changes', async () => {
    const other = await fixtureServer();
    try {
      const tezos = new TezosToolkit(server.url);
      const workflow = tezos.prepareFor(vector);
      tezos.setRpcProvider(other.url);
      await workflow.prepare.transaction(params);
      expect(server.requests.length).toBeGreaterThan(0);
      expect(other.requests).toHaveLength(0);
    } finally {
      await other.close();
    }
  });

  it('prepares and estimates a public contract method', async () => {
    const tezos = new TezosToolkit(server.url);
    const workflow = tezos.prepareFor(vector);
    const method = new ContractMethodObject(
      tezos.contract,
      'KT1AiWmfuCGSttuMBKbDUqZG6SzKQNrySFei',
      new ParameterSchema({ prim: 'nat' }),
      'default',
      7,
      false
    );
    const prepared = await workflow.prepare.contractCall(method);
    expect(prepared.opOb.contents[0]).toMatchObject({
      kind: 'transaction',
      source: vector.pkh,
      amount: '0',
      parameters: { entrypoint: 'default', value: { int: '7' } },
    });
    expect((await workflow.estimate.contractCall(method)).suggestedFeeMutez).toBeGreaterThan(0);
  });
  it('uses the validated BLS proof for automatic reveal and rejects missing proof', async () => {
    const bls = operationVectors.vectors.find((item) => item.scheme === 'bls');
    if (!bls || !('proof' in bls)) throw new Error('Missing BLS fixture');
    server.setRevealed(false);
    const tezos = new TezosToolkit(server.url);
    const withoutProof = tezos.prepareFor({ pkh: bls.pkh, publicKey: bls.publicKey });
    await expect(withoutProof.prepare.transaction(params)).rejects.toThrow('proof');
    const workflow = tezos.prepareFor(bls);
    expect((await workflow.prepare.transaction(params)).opOb.contents[0]).toMatchObject({
      kind: 'reveal',
      proof: bls.proof,
      public_key: bls.publicKey,
    });
    expect((await workflow.prepare.reveal()).opOb.contents[0]).toMatchObject({ proof: bls.proof });
    expect(await workflow.estimate.reveal()).toBeDefined();
  });
  it('prepares and estimates a delegation with the scoped source', async () => {
    const workflow = new TezosToolkit(server.url).prepareFor(vector);
    const delegation = { delegate: params.to, fee: 1000, gasLimit: 1040, storageLimit: 0 };
    const prepared = await workflow.prepare.delegation(delegation);
    expect(prepared.opOb.contents).toEqual([
      {
        kind: 'delegation',
        source: vector.pkh,
        fee: '1000',
        counter: '1',
        gas_limit: '1040',
        storage_limit: '0',
        delegate: params.to,
      },
    ]);
    expect((await workflow.estimate.setDelegate(delegation)).suggestedFeeMutez).toBeGreaterThan(0);
    expect(
      server.requests.filter((request) => request.path.endsWith('/simulate_operation'))
    ).toEqual([
      expect.objectContaining({
        body: expect.objectContaining({
          operation: expect.objectContaining({
            contents: [
              expect.objectContaining({
                kind: 'delegation',
                source: vector.pkh,
                delegate: params.to,
              }),
            ],
          }),
        }),
      }),
    ]);
  });
  it('prepares and estimates originations alone and in a batch', async () => {
    const workflow = new TezosToolkit(server.url).prepareFor(vector);
    const origination = {
      code: [
        { prim: 'parameter', args: [{ prim: 'unit' }] },
        { prim: 'storage', args: [{ prim: 'unit' }] },
        {
          prim: 'code',
          args: [
            [{ prim: 'CDR' }, { prim: 'NIL', args: [{ prim: 'operation' }] }, { prim: 'PAIR' }],
          ],
        },
      ],
      init: { prim: 'Unit' },
      balance: 0,
      fee: 1000,
      gasLimit: 1040,
      storageLimit: 0,
    };
    const expected = {
      kind: 'origination',
      source: vector.pkh,
      fee: '1000',
      counter: '1',
      gas_limit: '1040',
      storage_limit: '0',
      balance: '0',
      script: { code: origination.code, storage: { prim: 'Unit' } },
    };
    expect((await workflow.prepare.originate(origination)).opOb.contents).toEqual([expected]);
    expect(
      (await workflow.prepare.batch([{ ...origination, kind: OpKind.ORIGINATION }])).opOb.contents
    ).toEqual([expected]);
    expect((await workflow.estimate.originate(origination)).suggestedFeeMutez).toBeGreaterThan(0);
    expect(
      await workflow.estimate.batch([{ ...origination, kind: OpKind.ORIGINATION }])
    ).toHaveLength(1);

    const simulations = server.requests.filter((request) =>
      request.path.endsWith('/simulate_operation')
    );
    expect(simulations).toHaveLength(2);
    for (const request of simulations)
      expect(request.body).toMatchObject({
        operation: {
          contents: [
            {
              kind: 'origination',
              source: vector.pkh,
              balance: '0',
              script: { code: origination.code, storage: { prim: 'Unit' } },
            },
          ],
        },
      });
  });
  it('requires the BLS identity proof for explicit reveal estimation', async () => {
    const bls = operationVectors.vectors.find((item) => item.scheme === 'bls');
    if (!bls) throw new Error('Missing BLS fixture');
    server.setRevealed(false);
    const workflow = new TezosToolkit(server.url).prepareFor({
      pkh: bls.pkh,
      publicKey: bls.publicKey,
    });
    await expect(workflow.estimate.reveal()).rejects.toThrow('proof');
    await expect(workflow.prepare.reveal()).rejects.toThrow('proof');
    expect(server.requests.some((request) => request.path.includes('simulate_operation'))).toBe(
      false
    );
  });
});
