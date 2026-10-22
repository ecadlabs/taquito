import { TezosToolkit } from '../../src/taquito';
import { fixtureServer } from './detached-test-server';
import vectors from './detached-operation-vectors';

describe('legacy estimator preservation', () => {
  let server: Awaited<ReturnType<typeof fixtureServer>>;
  beforeEach(async () => {
    server = await fixtureServer();
  });
  afterEach(async () => {
    await server.close();
  });
  for (const vector of vectors.vectors.filter((item) => item.operationKind === 'transaction')) {
    it(`retains existing ${vector.scheme} size accounting`, async () => {
      const tezos = new TezosToolkit(server.url);
      tezos.setSignerProvider({
        publicKeyHash: async () => vector.pkh,
        publicKey: async () => vector.publicKey,
        secretKey: async () => {
          throw new Error('No private key needed');
        },
        sign: async () => {
          throw new Error('Estimation must not sign');
        },
      });
      const estimate = await tezos.estimate.transfer({
        to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        amount: 1,
        mutez: true,
        fee: 1000,
        gasLimit: 1040,
        storageLimit: 0,
      });
      // Preserve the historical BLS omission separately from the new workflow's correction.
      expect(Number(estimate.opSize)).toBe(
        vector.signedBytes.length / 2 - (vector.scheme === 'bls' ? 2 : 0)
      );
      expect(estimate.storageLimit).toBe(0);
    });
  }
});
