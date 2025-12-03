import { Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../config';

// TC-T-008: assume that the ticket is just a (pair address cty nat) and can "easily" be created via a callback.
// To see why the test fails with error message {\"prim\":\"Unit\"}, look at the Micheline form of the contract.

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const weeklynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    weeklynet('Verify ticket is not easily created by a callback', async () => {
      try {
        const opCaller = await Tezos.contract.originate({
          code: ` { parameter (or (address %init) (ticket %setToken string)) ;
            storage unit ;
            code { UNPAIR ;
                   IF_LEFT
                     { CONTRACT unit ;
                       IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                       PUSH mutez 0 ;
                       UNIT ;
                       TRANSFER_TOKENS ;
                       SWAP ;
                       NIL operation ;
                       DIG 2 ;
                       CONS ;
                       PAIR }
                     { DROP ; NIL operation ; PAIR } } }}`,
          init: 'Unit',
        });

        await opCaller.confirmation();
        expect(opCaller.hash).toBeDefined();
        expect(opCaller.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opCallerContract = await opCaller.contract();
        expect(await opCallerContract.storage()).toBeTruthy();

        const opGetter = await Tezos.contract.originate({
          code: `        { parameter unit;
            storage unit;
            code
              {
                DROP;
                PUSH nat 1;
                PUSH string "test";
                SENDER;
                PAIR 3;
                SENDER;
                CONTRACT %setToken (pair address string nat);
                IF_NONE { FAIL } {};
                SWAP;
                PUSH mutez 0;
                DUG 1;
                TRANSFER_TOKENS;
                NIL operation;
                SWAP;
                CONS;
                UNIT;
                SWAP;
                PAIR;
              };}`,
          init: 'Unit',
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opGetterContract = await opGetter.contract();
        expect(await opGetterContract.storage()).toBeTruthy();

        const opSend = await opCallerContract.methodsObject.init(opGetterContract.address).send();
        await opSend.confirmation();

      } catch (error: any) {
        expect(error.message).toContain('{"prim":"Unit"}');
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/Inference/TezosSecurityBaselineCheckingFramework
