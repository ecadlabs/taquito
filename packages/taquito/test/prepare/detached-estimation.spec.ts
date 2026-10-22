import { TezosToolkit, OpKind } from '../../src/taquito';
import { fixtureServer } from './detached-test-server';
import vectors from './detached-operation-vectors';
import { b58DecodeAndCheckPrefix, PrefixV2 } from '@taquito/utils';

describe('detached estimation', () => {
  let server: Awaited<ReturnType<typeof fixtureServer>>;
  beforeEach(async () => {
    server = await fixtureServer();
  });
  afterEach(async () => {
    await server.close();
  });
  const params = {
    to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
    amount: 1,
    mutez: true,
    fee: 1000,
    gasLimit: 1040,
    storageLimit: 0,
  };
  for (const vector of vectors.vectors.filter((item) => item.operationKind === 'transaction')) {
    it(`accounts for the independent ${vector.scheme} signed envelope`, async () => {
      const tezos = new TezosToolkit(server.url);
      const result = await tezos.prepareFor(vector).estimate.transfer(params);
      expect(Number(result.opSize)).toBe(vector.signedBytes.length / 2);
      expect(result.storageLimit).toBe(0);
      expect(result.suggestedFeeMutez).toBeGreaterThan(0);
    });
  }
  it.each([true, false])(
    'preserves legacy BLS estimates while pricing scoped envelope, revealed=%s',
    async (revealed) => {
      const bls = vectors.vectors.find((item) => item.scheme === 'bls');
      if (!bls || typeof bls.proof !== 'string') throw new Error('Missing BLS proof');
      const proof = bls.proof;
      server.setRevealed(revealed);
      const tezos = new TezosToolkit(server.url);
      tezos.setSignerProvider({
        publicKeyHash: async () => bls.pkh,
        publicKey: async () => bls.publicKey,
        secretKey: async () => {
          throw new Error('No private key required');
        },
        sign: async () => {
          throw new Error('Estimation must not sign');
        },
        provePossession: async () => ({
          prefixSig: proof,
          sig: proof,
          rawSignature: b58DecodeAndCheckPrefix(proof, [PrefixV2.BLS12_381Signature])[0],
        }),
      });
      const legacy = await tezos.estimate.transfer(params);
      const detached = await tezos.prepareFor(bls).estimate.transfer(params);
      expect(Number(detached.opSize) - Number(legacy.opSize)).toBe(2);
      const batch = [
        { ...params, kind: OpKind.TRANSACTION } satisfies {
          kind: OpKind.TRANSACTION;
        } & typeof params,
      ];
      const legacyBatch = await tezos.estimate.batch(batch);
      const detachedBatch = await tezos.prepareFor(bls).estimate.batch(batch);
      expect(
        detachedBatch.reduce((sum, estimate) => sum + Number(estimate.opSize), 0) -
          legacyBatch.reduce((sum, estimate) => sum + Number(estimate.opSize), 0)
      ).toBe(2);
    }
  );
});
