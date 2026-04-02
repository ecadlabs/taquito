import { OpKind } from '@taquito/taquito';
import { CONFIGS, SignerType } from '../../../config';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, signerConfig }) => {
  const Tezos = lib;
  describe(`Test estimate.batch includes an estimation for a reveal operation when needed using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup({
        preferFreshKey: true,
        maxAttempts: 8,
        minBalanceMutez: 2_000_000,
      });
    });

    it('Verify that an estimate for a reveal operation is included in the response when using estimate.batch with an unrevealed signer', async () => {
      const pkh = await Tezos.signer.publicKeyHash();
      const managerKey = await Tezos.rpc.getManagerKey(pkh);
      const currentDelegate = await Tezos.rpc.getDelegate(pkh);
      try {
        const batchOpEstimate = await Tezos.estimate.batch([
          { kind: OpKind.DELEGATION, source: pkh, delegate: knownBaker },
          { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
        ]);

        expect(batchOpEstimate.length).toEqual(managerKey ? 2 : 3);
      } catch (ex: any) {
        if (currentDelegate === pkh) {
          // Registered delegates cannot be delegated away from self on live networks.
          expect(ex.message).toMatch('delegate.no_deletion');
        } else if (signerConfig.type === SignerType.SECRET_KEY) {
          // Secret-key testnets can also reuse accounts that were already left in a bad state.
          expect(ex.message).toMatch('delegate.no_deletion');
        } else {
          throw ex;
        }
      }
    });

    it('Verify the estimate.batch does not include an estimation of a reveal operation when the signer is already revealed.', async () => {
      const pkh = await Tezos.signer.publicKeyHash();
      const managerKey = await Tezos.rpc.getManagerKey(pkh);
      const currentDelegate = await Tezos.rpc.getDelegate(pkh);

      try {
        if (!managerKey) {
          const revealOp = await Tezos.contract.reveal({});
          await revealOp.confirmation();
        }

        const batchOpEstimate = await Tezos.estimate.batch([
          { kind: OpKind.DELEGATION, source: pkh, delegate: knownBaker },
          { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
        ]);

        expect(batchOpEstimate.length).toEqual(2);
      } catch (ex: any) {
        if (currentDelegate === pkh) {
          expect(ex.message).toMatch('delegate.no_deletion');
        } else if (signerConfig.type === SignerType.SECRET_KEY) {
          // When running the test multiple times with the same key, can not reveal an already revealed contract.
          expect(ex.message).toMatch(`The publicKeyHash '${pkh}' has already been revealed.`);
        } else {
          throw ex;
        }
      }
    });
  });
});
