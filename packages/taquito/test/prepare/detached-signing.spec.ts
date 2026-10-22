import { TezosToolkit } from '../../src/taquito';
import vectors from './detached-signing-vectors.json';
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
    expect((await workflow.prepare.transaction(params)).opOb.contents).toEqual(
      vector.operation.contents
    );
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
});
