import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';

// Naively* trying to create an own ticket from scratch.
// We assume that the ticket is just a (pair address cty nat) and can "easily" be created using a lambda.
// * Naively - meaning: We just try it without thinking whether this test makes sense with regard to the underlying architecture.
// We think of the underlying architecture (type system, stack separation, etc.) as a black box.

// TC-T-018: Create ticket - call input string/address
// TC-T-019: Create ticket -  string/address
// TC-T-020: Join ticket - two different ticketers
// TC-T-021: Join ticket - two different, but similar cty

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const mondaynet = protocol === Protocols.ProtoALpha ? test: test.skip;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    mondaynet('Verify creating ticket is not possible with call input string/address - parameter passed is invalid for type ticket string', async (done) => {
      try {
        const op = await Tezos.contract.originate({
          code: `   {   parameter (ticket string);
                        storage (option (ticket string));
                        code
                          {
                            CAR; # drop storage, but leave input on stack
                            PUSH nat 4;
                            PUSH string "test";
                            TICKET;
                            PAIR;
                            JOIN_TICKETS;
                            NIL operation;
                            PAIR;
                          }
                    }`,
          init: 'None',
        });

        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opContract = await op.contract();
        const opSend = await opContract.methods.default(`(Pair ${opContract.address} \"test\" 1)`).send();
        await opSend.confirmation()
      } catch (error: any) {
        expect(error.message).toContain('Unable to encode parameter');
      }
      done();
    });

    mondaynet('Verify creating ticket is not possible with string/address', async (done) => {
      try {
        const op = await Tezos.contract.originate({
          code: `   {   parameter (option (ticket string));
                        storage (option (ticket string));
                        code
                          {
                            CAR; # drop storage, but leave input on stack
                            IF_NONE { FAIL} {};
                            PUSH nat 4;
                            PUSH string "test";
                            TICKET;
                            PAIR;
                            JOIN_TICKETS;
                            NIL operation;
                            PAIR;
                          };
                        }`,
          init: 'None',
        });

        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opContract = await op.contract();
        const opSend = await opContract.methods.default(`(Pair ${opContract.address} \"test\" 1)`).send();
        await opSend.confirmation()
      } catch (error: any) {
        expect(error.message).toContain('Unable to encode parameter');
      }
      done();
    });

    mondaynet('Verify creating ticket is not possible Join ticket - two different ticketers', async (done) => {
      try {
        const opJoin = await Tezos.contract.originate({
          code: `   {   parameter (option (ticket string));
                        storage unit;
                        code
                          {
                            CAR; # drop storage, but leave input on stack
                            IF_NONE { FAIL} {};
                            PUSH nat 4;
                            PUSH string "test";
                            TICKET;
                            PAIR;
                            JOIN_TICKETS;
                            IF_NONE { FAIL } {};
                            DROP;
                            UNIT;
                            NIL operation;
                            PAIR;
                          };
                        }`,
          init: 'None',
        });

        await opJoin.confirmation();
        expect(opJoin.hash).toBeDefined();
        expect(opJoin.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opJoinContract = await opJoin.contract();
        expect(await opJoinContract.storage()).toBeTruthy();

        const opCaller = await Tezos.contract.originate({
          code: `   {   parameter address;
                        storage unit;
                        code
                          {
                            CAR; # drop storage, but leave input on stack
                            CONTRACT (option (ticket string));
                            IF_NONE { FAIL } {};
                            PUSH mutez 0;
                            PUSH nat 1;
                            PUSH string "test";
                            TICKET;
                            SOME;
                            TRANSFER_TOKENS;
                            NIL operation;
                            SWAP;
                            CONS;
                            UNIT;
                            SWAP;
                            PAIR;
                          };
                        }`,
          init: 'Unit',
        });

        await opCaller.confirmation();
        expect(opCaller.hash).toBeDefined();
        expect(opCaller.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opCallerContract = await opCaller.contract();
        expect(await opCallerContract.storage()).toBeTruthy();
        const opSend = await opCallerContract.methods.default(`(Pair ${opCallerContract.address} \"test\" 1)`).send();
        await opSend.confirmation()
      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.invalid_primitive');
      }
      done();
    });

    mondaynet('Verify creating ticket is not possible with two different, but similar cty', async (done) => {
      try {
        const op = await Tezos.contract.originate({
          code: `   { parameter unit;
                      storage unit;
                      code
                        {
                          DROP; # drop input and storage
                          PUSH nat 4;
                          PUSH string "test";
                          TICKET;
                          PUSH nat 1;
                          PUSH string "tes";
                          TICKET;
                          PAIR;
                          JOIN_TICKETS;
                          IF_NONE { FAIL } {};
                          DROP;
                          UNIT;
                          NIL operation;
                          PAIR;
                        };
                      }`,
          init: 'Unit',
        });

        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opContract = await op.contract();
        expect(await opContract.storage()).toBeTruthy();
        const opSend = await opContract.methods.default(`(Pair ${opContract.address} \"test\" 1)`).send();
        await opSend.confirmation()
      } catch (error: any) {
        expect(error.message).toContain('{"prim":"Unit"}');
      }
      done();
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking
