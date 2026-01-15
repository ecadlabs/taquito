import { Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../config';

/**
 *  TC-010: Batch operation failing: a sequence of add and sub calls are made and we verify the contract finds the FAILWITH when the subs exceed the adds
*/

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const weeklynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    weeklynet('Verify failed batch', async () => {
      const op = await Tezos.contract.originate({
        code: `        { parameter (or (nat %add) (nat %sub)) ;
              storage nat ;
              code { UNPAIR ;
                     IF_LEFT
                       { ADD ; NIL operation ; PAIR }
                       { SWAP ;
                         SUB ;
                         ISNAT ;
                         IF_NONE { PUSH string "substraction_below_zero" ; FAILWITH } {} ;
                         NIL operation ;
                         PAIR } } }`,
        init: `0`,
      });

      const contract = await op.contract();
      expect(op.status).toEqual('applied');

      try {
        const batch = Tezos.contract.batch()
          .withContractCall(contract.methodsObject.add(2))
          .withContractCall(contract.methodsObject.sub(4))
          .withContractCall(contract.methodsObject.add(3));

        const batchOp = await batch.send();
        await batchOp.confirmation();
      } catch (error: any) {
        expect(error.message).toContain('substraction_below_zero');
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking
