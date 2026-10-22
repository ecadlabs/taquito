import { TezosToolkit, OpKind } from '../../src/taquito';
import vectors from './detached-signing-vectors';
import { fixtureServer } from './detached-test-server';

describe('existing preparation compatibility', () => {
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
  function toolkit() {
    const tezos = new TezosToolkit(server.url);
    tezos.setSignerProvider({
      publicKeyHash: async () => vector.pkh,
      publicKey: async () => vector.publicKey,
      secretKey: async () => {
        throw new Error('No private key required');
      },
      sign: async (bytes) => ({
        bytes: String(bytes),
        sig: vector.signature,
        prefixSig: vector.signature,
        sbytes: vector.signedBytes,
      }),
    });
    return tezos;
  }
  it('retains explicit transaction contents and zero storage', async () => {
    expect((await toolkit().prepare.transaction(params)).opOb.contents).toEqual(
      vector.operation.contents
    );
  });
  it('retains the single-operation batch representation', async () => {
    expect(
      (await toolkit().prepare.batch([{ ...params, kind: OpKind.TRANSACTION }])).opOb.contents
    ).toEqual(vector.operation.contents);
  });
  it('retains explicit legacy source overrides', async () => {
    const prepared = await toolkit().prepare.transaction({ ...params, source: params.to });
    expect(prepared.opOb.contents[0]).toMatchObject({ source: params.to });
  });
  it('retains automatic reveal and consecutive counters', async () => {
    server.setRevealed(false);
    const prepared = await toolkit().prepare.transaction(params);
    expect(prepared.opOb.contents).toMatchObject([
      { kind: 'reveal', source: vector.pkh, public_key: vector.publicKey, counter: '1' },
      { kind: 'transaction', source: vector.pkh, counter: '2' },
    ]);
  });
  it('retains signer-based toPreapply', async () => {
    const tezos = toolkit();
    const prepared = await tezos.prepare.transaction(params);
    expect(await tezos.prepare.toPreapply(prepared)).toEqual([
      { ...vector.operation, protocol: vector.protocol, signature: vector.signature },
    ]);
  });
});
