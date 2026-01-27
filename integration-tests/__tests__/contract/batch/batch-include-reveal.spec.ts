import { OpKind } from '@taquito/taquito';
import { CONFIGS, SignerType } from '../../../config';

CONFIGS().forEach(({ lib, rpc, setup, signerConfig }) => {
  const Tezos = lib;
  describe(`Test estimate.batch includes an estimation for a reveal operation when needed using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup(true);
    });

    it('Verify that an estimate for a reveal operation is included in the response when using estimate.batch with an unrevealed signer', async () => {
      try {
        const batchOpEstimate = await Tezos.estimate
          .batch([
            { kind: OpKind.ORIGINATION, code: 'parameter unit; storage unit; code {CDR; NIL operation; PAIR}', storage: null },
            { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
          ])

        expect(batchOpEstimate.length).toEqual(3);
      } catch (ex: any) {
        // When running tests more than one time with the same key, the account is already delegated to the given delegate
        if (signerConfig.type === SignerType.SECRET_KEY) {
          expect(ex.message).toMatch('delegate.no_deletion');
        } else {
          throw ex
        }
      }

    });

    it('Verify the estimate.batch does not include an estimation of a reveal operation when the signer is already revealed.', async () => {
      const pkh = await Tezos.signer.publicKeyHash()

      try {
        // do a reveal operation first
        const revealOp = await Tezos.contract.reveal({});
        await revealOp.confirmation();

        const batchOpEstimate = await Tezos.estimate
          .batch([
            { kind: OpKind.ORIGINATION, code: 'parameter unit; storage unit; code {CDR; NIL operation; PAIR}', storage: null },
            { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
          ])

        expect(batchOpEstimate.length).toEqual(2);

      } catch (ex: any) {
        if (signerConfig.type === SignerType.SECRET_KEY) {
          // When running the test multiple times with the same key, can not reveal an already revealed contract.
          expect(ex.message).toMatch(`The publicKeyHash '${pkh}' has already been revealed.`)
        } else {
          throw ex
        }
      }
    });
  });
});
