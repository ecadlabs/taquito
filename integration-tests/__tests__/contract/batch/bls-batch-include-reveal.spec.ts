import { OpKind, Protocols } from '@taquito/taquito';
import { CONFIGS, SignerType } from '../../../config';
import { TezosToolkit } from '@taquito/taquito';
import { PrefixV2 } from '@taquito/utils';
import { ProtoGreaterOrEqual } from "@taquito/michel-codec";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, signerConfig, protocol, createAddress }) => {
  const seoulnetAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtSeouLou) ? test : test.skip;
  const Tezos = lib;
  let Bls: TezosToolkit

  describe(`Test estimate.batch includes an estimation for a tz4 reveal operation when needed using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
      try {
        Bls = await createAddress(PrefixV2.BLS12_381SecretKey)
        let transferOp = await Tezos.contract.transfer({ to: await Bls.signer.publicKeyHash(), amount: 2 })
        await transferOp.confirmation()
      } catch (e) {
        console.log('beforeAll transferOp error', e)
      }
    });

    seoulnetAndAlpha('Verify that an estimate for a tz4 reveal operation is included in the response when using estimate.batch with an unrevealed signer', async () => {
      try {
        const batchOpEstimate = await Bls.estimate
          .batch([
            { kind: OpKind.DELEGATION, source: await Bls.signer.publicKeyHash(), delegate: knownBaker },
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

    seoulnetAndAlpha('Verify the estimate.batch does not include an estimation of a tz4 reveal operation when the signer is already revealed.', async () => {

      try {
        // do a reveal operation first
        const revealOp = await Bls.contract.reveal({});
        await revealOp.confirmation();
        const batchOpEstimate = await Bls.estimate
          .batch([
            { kind: OpKind.DELEGATION, source: await Bls.signer.publicKeyHash(), delegate: knownBaker },
            { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
          ])

        expect(batchOpEstimate.length).toEqual(2);

      } catch (ex: any) {

        throw ex

      }
    });
  });
});
