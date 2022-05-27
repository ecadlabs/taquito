import { CONFIGS } from './config';

/**   
 * This "naive*" testcase assumes that the on-chain view stack is not correctly separated from the caller's stack. 
 * Thus, this testcase assumes that there is only one stack, whereas the elements of the on-chain stack are on top. 
 * Naive - meaning: WE just try it without thinking whether this test makes sense in regards with the used underlying architecture. 
 * We think of the underlying architecture (type system, stack separation, etc.) as a black box.
 * 
 * TC-V-012: On-chain view - add instruction
 * TC-V-013: On-chain view - dig instruction
 * TC-V-014: On-chain view - dup instruction
**/

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it("Verify we can access the stack of the caller by using the instruction add.", async (done) => {
      try {
        const opGetter = await Tezos.contract.originate({
          code: ` { parameter address;
            storage nat;
            code
              {
                UNPAIR;
                UNIT;
                VIEW "rogue" nat;
                IF_NONE { FAIL } {};
                ADD;
                NIL operation;
                PAIR;
              };}`,
          init: `0`
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();

      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.invalid_expression_kind');
      }
      done();
    });

    it("Verify we can access the stack of the caller by using the instruction dig n", async (done) => {
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

      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.bad_stack');
      }
      done();
    });

    it("Verify we can access the stack of the caller by using the instruction dup.", async (done) => {
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

      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.bad_stack');
      }
      done();
    }); 
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking

