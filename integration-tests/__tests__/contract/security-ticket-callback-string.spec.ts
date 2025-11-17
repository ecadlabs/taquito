import { Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../config';

// TC-T-009 - Create Ticket - callback case 2 - address and option
// TC-T-010 - Create ticket - callback case 3 - string and option
// TC-T-011 - Create ticket - callback case 4 - string

// Naively* trying to create an own ticket from scratch.
// We assume that the ticket is just a (pair string cty nat) and can "easily" be created via a callback.
// *Naively - meaning: WE just try it without thinking whether this test makes sense in regards with the used underlying architecture.
// We think of the underlying architecture (type system, stack separation, etc.) as a black box.

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const weeklynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    weeklynet("Verify ticket is not easily created by a callback - address and option", async () => {
      try {
        const opCaller = await Tezos.contract.originate({
          code: ` { parameter (or (address %init) (option %setToken (ticket string))) ;
                    storage (option (ticket string)) ;
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
                            { SWAP ; DROP ; NIL operation ; PAIR } } }`,
          init: 'None'
        });

        await opCaller.confirmation();
        expect(opCaller.hash).toBeDefined();
        expect(opCaller.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opCallerContract = await opCaller.contract();

        const opGetter = await Tezos.contract.originate({
          code: `        {  parameter unit;
                            storage unit;
                            code
                              {
                                DROP;
                                PUSH nat 1;
                                PUSH string "test";
                                SENDER;
                                PAIR 3;
                                SOME;
                                SENDER;
                                CONTRACT %setToken (option(pair address string nat));
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
          init: 'Unit'
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opGetterContract = await opGetter.contract();
        expect(await opGetterContract.storage()).toBeTruthy();

        const opSend = await opCallerContract.methodsObject.init(`${opGetterContract.address}`).send();
        await opSend.confirmation()
      } catch (error: any) {
        expect(error.message).toContain('{\"prim\":\"Unit\"}');
      }
    });

    weeklynet("Verify ticket is not easily created by a callback - string and option ", async () => {
      try {
        const opCaller = await Tezos.contract.originate({
          code: ` { parameter
                      (or (pair %init (address %adrAdr) (string %strAdr)) (option %setToken (ticket string))) ;
                    storage unit ;
                    code { UNPAIR ;
                          IF_LEFT
                            { DUP ;
                              DUG 2 ;
                              CAR ;
                              CONTRACT string ;
                              IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                              PUSH mutez 0 ;
                              DIG 3 ;
                              CDR ;
                              TRANSFER_TOKENS ;
                              SWAP ;
                              NIL operation ;
                              DIG 2 ;
                              CONS ;
                              PAIR }
                            { DROP ; NIL operation ; PAIR } } }`,
          init: 'Unit'
        });

        await opCaller.confirmation();
        expect(opCaller.hash).toBeDefined();
        expect(opCaller.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opCallerContract = await opCaller.contract();

        const opGetter = await Tezos.contract.originate({
          code: `     { parameter string;
                        storage unit;
                        code
                          {
                            CAR; # parameter
                            PUSH nat 1;
                            PUSH string "test";
                            DIG 2;
                            PAIR 3;
                            SOME;
                            SENDER;
                            CONTRACT %setToken (option(pair string string nat));
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
          init: 'Unit'
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opGetterContract = await opGetter.contract();
        expect(await opGetterContract.storage()).toBeTruthy();
        const opSend = await opCallerContract.methodsObject.init(`${opGetterContract.address}`, `${opGetterContract.address}`).send();
        await opSend.confirmation()
      } catch (error: any) {
        expect(error.message).toContain('{\"prim\":\"Unit\"}');
      }
    });

    weeklynet("Verify ticket is not easily created by a callback - string", async () => {
      try {
        const opCaller = await Tezos.contract.originate({
          code: ` { parameter
                    (or (pair %init (address %adrAdr) (string %strAdr)) (ticket %setToken string)) ;
                    storage unit ;
                    code { UNPAIR ;
                          IF_LEFT
                            { DUP ;
                              DUG 2 ;
                              CAR ;
                              CONTRACT string ;
                              IF_NONE { PUSH string "none" ; FAILWITH } {} ;
                              PUSH mutez 0 ;
                              DIG 3 ;
                              CDR ;
                              TRANSFER_TOKENS ;
                              SWAP ;
                              NIL operation ;
                              DIG 2 ;
                              CONS ;
                              PAIR }
                            { DROP ; NIL operation ; PAIR } } }`,
          init: 'Unit'
        });

        await opCaller.confirmation();
        expect(opCaller.hash).toBeDefined();
        expect(opCaller.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opCallerContract = await opCaller.contract();

        const opGetter = await Tezos.contract.originate({
          code: `     { parameter string;
                        storage unit;
                        code
                          {
                            CAR; # parameter
                            PUSH nat 1;
                            PUSH string "test";
                            DIG 2;
                            PAIR 3;
                            SENDER;
                            CONTRACT %setToken (pair string string nat);
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
                          }}`,
          init: 'Unit'
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opGetterContract = await opGetter.contract();
        expect(await opGetterContract.storage()).toBeTruthy();

        const opSend = await opCallerContract.methodsObject.init(`${opGetterContract.address}`, `${opCallerContract.address}`).send();
        await opSend.confirmation()
      } catch (error: any) {
        expect(error.message).toContain('{\"prim\":\"Unit\"}');
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking
