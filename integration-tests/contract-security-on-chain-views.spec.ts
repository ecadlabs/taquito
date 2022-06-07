import { Protocols } from '@taquito/taquito';
import { CONFIGS } from './config';

/**
 * This "naive*" testcase assumes that the on-chain view stack is not correctly separated from the caller's stack.
 * Thus, this testcase assumes that there is only one stack, whereas the elements of the on-chain stack are on top.
 * Naive - meaning: WE just try it without thinking whether this test makes sense in regards with the used underlying architecture.
 * We think of the underlying architecture (type system, stack separation, etc.) as a black box.
 *
 * TC-V-002: On-chain view - add instruction
 * TC-V-003: On-chain view - dig instruction
 * TC-V-004: On-chain view - dup instruction
**/

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const mondaynet = protocol === Protocols.ProtoALpha ? test: test.skip;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    mondaynet("Verify we can access the stack of the caller by using the instruction add.", async (done) => {
      try {
        const opGetter = await Tezos.contract.originate({
          code: ` { parameter unit;
                    storage unit;
                    code
                      {
                        DROP;
                        UNIT;
                        NIL operation;
                        PAIR;
                      };
                    view
                      "rogue" unit nat
                      {
                        # We assume that the on-chain view stack is just on top of the caller stack.

                        # DROP view input
                        DROP;

                        # On the caller stack the top value is a "nat". So, we try to access this by using instruction "add".
                        PUSH nat 3;
                        ADD;
                        # we leave this addition result on stack.

                        # Since, add consumes two stack elements, we have to push another nat (the result of the view) to stack in order
                        # to restore a correct stack.
                        PUSH nat 1;
                      };
                  }`,
                  init: 'Unit'
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();

      } catch (e: unknown) {
        const error = e as Record<string, unknown>
        expect(error.message).toContain('michelson_v1.bad_stack');
      }
      done();
    });

    mondaynet("Verify we can access the stack of the caller by using the instruction dig n", async (done) => {
      try {
        const opGetter = await Tezos.contract.originate({
          code: ` { parameter unit;
                    storage unit;
                    code
                      {
                        DROP;
                        UNIT;
                        NIL operation;
                        PAIR;
                      };
                    view
                      "rogue" unit nat
                      {
                        # We assume that the on-chain view stack is just on top of the caller stack.
                        # Try to access 2nd element of caller stack.
                        DIG 2;
                        # SWAP to restore correct stack order.
                        SWAP;
                        # DROP view input
                        DROP;
                        # Return nat value
                        PUSH nat 1;
                      }
                    }`,
          init: 'Unit'
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();

      } catch (e: unknown) {
        const error = e as Record<string, unknown>
        expect(error.message).toContain('michelson_v1.bad_stack');
      }
      done();
    });

    mondaynet("Verify we can access the stack of the caller by using the instruction dup.", async (done) => {
      try {
        const opGetter = await Tezos.contract.originate({
          code: ` { parameter unit;
                    storage unit;
                    code
                      {
                        DROP;
                        UNIT;
                        NIL operation;
                        PAIR;
                      };
                    view
                      "rogue" unit nat              {
                        # We assume that the on-chain view stack is just on top of the caller stack.
                        # We try to access and duplicate 2nd element of caller stack:
                        DUP 2;
                        # DROP it
                        DROP;
                        # DROP view input
                        DROP;
                        # Return nat value
                        PUSH nat 1;
                      }
                  }`,
          init: 'Unit'
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();

      } catch (e: unknown) {
        const error = e as Record<string, unknown>
        expect(error.message).toContain('michelson_v1.bad_stack');
      }
      done();
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking

