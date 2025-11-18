import { Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../config';

// TC-T-022: Duplicate ticket - duplicate transaction operation
// TC-T-023: Duplicate ticket - Duplicate ticket - duplicate map containing tickets
// TC-T-024: Duplicate ticket - duplicate big_map containing tickets

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const weeklynet = protocol === Protocols.ProtoALpha ? test : test.skip;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup();
    });

    weeklynet('Verify creating ticket is not possible with duplicate transaction operation - fail with internal_operation_replay', async () => {
      try {
        const opJoin = await Tezos.contract.originate({
          code: `   {   parameter (ticket string);
                        storage (option (ticket string));
                        code
                          {
                            UNPAIR;
                            SWAP;
                            IF_NONE {
                                      SOME;
                                    }
                                    {
                                      PAIR;
                                      JOIN_TICKETS;
                                    };
                            NIL operation;
                            PAIR;
                          }
                    }`,
          init: 'None',
        });

        await opJoin.confirmation();
        expect(opJoin.hash).toBeDefined();
        expect(opJoin.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opJoinContract = await opJoin.contract();

        const opDupOp = await Tezos.contract.originate({
          code: `   { parameter address;
                      storage unit;
                      code
                        {
                          CAR ; # drop storage, but keep input
                          PUSH nat 1;
                          PUSH string "test";
                          TICKET;
                          ASSERT_SOME;
                          SWAP;
                          CONTRACT (ticket string);
                          IF_NONE { FAIL } {};
                          PUSH mutez 0;
                          DIG 2;
                          TRANSFER_TOKENS;
                          DUP;
                          NIL operation;
                          SWAP;
                          CONS;
                          SWAP;
                          CONS;
                          UNIT;
                          SWAP;
                          PAIR;
                        }
                    }`,
          init: 'Unit',
        });

        await opDupOp.confirmation();
        expect(opDupOp.hash).toBeDefined();
        expect(opDupOp.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opDupOpContract = await opDupOp.contract();
        expect(await opDupOpContract.storage()).toBeTruthy();
        const opSend = await opDupOpContract.methodsObject.default(`${opJoinContract.address}`).send();
        await opSend.confirmation();
      } catch (error: any) {
        expect(error.message).toContain('internal_operation_replay');
      }
    });

    weeklynet('Verify contract for ticket is not created with duplicate map containing tickets - fail with unexpected ticket', async () => {
      try {
        const opMapDup = await Tezos.contract.originate({
          code: ` { parameter unit;
                    storage unit;
                    code
                      {
                        DROP ; # drop storage and input
                        EMPTY_MAP nat (ticket string);
                        PUSH nat 1;
                        PUSH string "test";
                        TICKET;
                        ASSERT_SOME;
                        SOME;
                        PUSH nat 0;
                        UPDATE;
                        DUP;
                        DROP;
                        DROP;
                        UNIT;
                        NIL operation;
                        PAIR;
                      }
                  }`,
          init: 'Unit',
        });

        await opMapDup.confirmation();
        expect(opMapDup.hash).toBeDefined();
        expect(opMapDup.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.unexpected_ticket');
      }
    });

    weeklynet('Verify contract for ticket is not created with a duplicate big_map containing tickets - fail with unexpected_ticket', async () => {
      try {
        const opGetter = await Tezos.contract.originate({
          code: ` { parameter unit;
                    storage unit;
                    code
                      {
                        DROP ; # drop storage and input
                        EMPTY_BIG_MAP nat (ticket string);
                        PUSH nat 1;
                        PUSH string "test";
                        TICKET;
                        ASSERT_SOME;
                        SOME;
                        PUSH nat 0;
                        UPDATE;
                        DUP;
                        DROP;
                        DROP;
                        UNIT;
                        NIL operation;
                        PAIR;
                      }
                  }`,
          init: 'Unit',
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.unexpected_ticket');
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking
