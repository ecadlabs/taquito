import { Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../config';

/**
 *  TC-004: Example of mutez underflow - showing that SUB_MUTEZ; ASSERT_SOME prevents underflow by catching and going to FAILWITH
 *  To see why the test fails with error message {\"prim\":\"Unit\"}, look at the Micheline form of the contract.
 *  If underflows are not prevented the contract is unusable. Any tokens locked in the contract will be irretrievable, etc.
 */

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const weeklynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    weeklynet('Verify mutez underflow example', async () => {
      try {
        const op = await Tezos.contract.originate({
          code: `        { parameter unit ;
            storage mutez ;
            code { DROP ;
                   PUSH mutez 2 ;
                   PUSH mutez 1 ;
                   SUB_MUTEZ ;
                   ASSERT_SOME ;
                   NIL operation ;
                   PAIR } }`,
          init: { int: '0' },
        });

        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const contract = await op.contract();
        expect(await contract.storage()).toBeTruthy();

        const opSend = await contract.methodsObject.default(0).send();
        await opSend.confirmation();

      } catch (error: any) {
        expect(error.message).toContain('{"prim":"Unit"}');
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking
