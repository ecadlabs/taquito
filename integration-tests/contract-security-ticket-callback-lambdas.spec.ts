import { CONFIGS } from './config';

// Naively* trying to create an own ticket from scratch.
// We assume that the ticket is just a (pair address cty nat) and can "easily" be created using a lambda.
// * Naively - meaning: We just try it without thinking whether this test makes sense with regard to the underlying architecture. 
// We think of the underlying architecture (type system, stack separation, etc.) as a black box.

// TC-T-012: lambda case 1 - address
// TC-T-013: lambda case 2 - address and option
// TC-T-014: lambda case 3 - string and option
// TC-T-015: lambda case 4 - string
// TC-T-016: rogue case 1 -  fails with no mutez
// TC-T-017: rogue case 2 -  fails with no ticket string

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it("Verify contract for ticket is not created with a lambda - address", async (done) => {
      try {
        const opGetter = await Tezos.contract.originate({
          code: ` { parameter unit;
          storage unit;
          code
            {
              # Trying to use a lambda in order to create a "ticket"
              LAMBDA
                unit
                (ticket string)
                {
                  DROP;
                  PUSH nat 1;
                  PUSH string "test";
                  SELF_ADDRESS;
                  PAIR 3;
                } ;
              DROP; # DROP storage and input
              DROP; # DROP lambda
              UNIT;
              NIL operation;
              PAIR;
            };}`,
          init: 'Unit'
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.inconsistent_types');
      }
      done();
    });

    it("Verify contract for ticket is not created with a lambda - address and option", async (done) => {
      try {
        const opGetter = await Tezos.contract.originate({
          code: ` { parameter unit;
            storage unit;
            code
              {
                # Trying to use a lambda in order to create a "ticket"
                LAMBDA
                  unit
                  (option (ticket string))
                  {
                    DROP;
                    PUSH nat 1;
                    PUSH string "test";
                    SELF_ADDRESS;
                    PAIR 3;
                    SOME;
                  } ;
                DROP; # DROP storage and input
                DROP; # DROP lambda
                UNIT;
                NIL operation;
                PAIR;
              };}`,
          init: 'Unit'
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.inconsistent_type_sizes');
      }
      done();
    });

    it("Verify contract for ticket is not created with a lambda - string and option", async (done) => {
      try {
        const opGetter = await Tezos.contract.originate({
          code: ` { parameter string;
            storage unit;
            code
              {
                # Trying to use a lambda in order to create a "ticket"
                LAMBDA
                  string
                  (ticket string)
                  {
                    PUSH nat 1;
                    PUSH string "test";
                    DIG 2;
                    PAIR 3;
                  } ;
                DROP; # DROP storage and input
                DROP; # DROP lambda
                UNIT;
                NIL operation;
                PAIR;
              };}`,
          init: 'Unit'
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.inconsistent_types');
      }
      done();
    });

    it("Verify contract for ticket is not created with a lambda - string", async (done) => {
      try {
        const opGetter = await Tezos.contract.originate({
          code: ` { parameter string;
            storage unit;
            code
              {
                # Trying to use a lambda in order to create a "ticket"
                LAMBDA
                  string
                  (option (ticket string))
                  {
                    PUSH nat 1;
                    PUSH string "test";
                    DIG 2;
                    PAIR 3;
                    SOME;
                  } ;
                DROP; # DROP storage and input
                DROP; # DROP lambda
                UNIT;
                NIL operation;
                PAIR;
              };}`,
          init: 'Unit'
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.inconsistent_type_sizes');
      }
      done();
    });

    it("Verify contract for ticket is not created - fail with no mutez", async (done) => {
      try {
        const opRogue = await Tezos.contract.originate({
          code: ` { parameter address;
            storage (option (ticket string));
            code
              {
                UNPAIR; 
                CONTRACT (ticket string);
                IF_NONE
                  {
                     PUSH string "error 1";
                     FAILWITH;
                  }
                  {};
                PUSH mutez 0;
                DIG 2;
                IF_NONE
                  {
                     PUSH string "error 2";
                     FAILWITH;
                  }
                  {};
                TRANSFER_TOKENS; 
                NIL operation;
                SWAP;
                CONS;
                PUSH nat 1;
                PUSH string "test";
                TICKET; 
                SOME;
                SWAP;
                PAIR;
              };}`,
          init: '"Some (Pair \"KT1Pmz71yHTCmDHiJ9quFpb9cKANeeb2evV2\" \"test\" 2)"'
        });

        await opRogue.confirmation();
        expect(opRogue.hash).toBeDefined();
        expect(opRogue.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.invalid_expression_kind');
      }
      done();
    });

    it("Verify contract for ticket is not created - fail with no ticket string", async (done) => {
      try {
        const opRogue = await Tezos.contract.originate({
          code: ` { parameter address;
            storage (ticket string);
            code
              {
                UNPAIR; 
                CONTRACT (ticket string);
                IF_NONE
                  {
                     PUSH string "error 1";
                     FAILWITH;
                  }
                  {};
                PUSH mutez 0;
                DIG 2;
                TRANSFER_TOKENS; 
                NIL operation;
                SWAP;
                CONS;
                PUSH nat 1;
                PUSH string "test";
                TICKET;
                SWAP;
                PAIR;
              };
            }`,
          init: '"Some (Pair \"KT1Pmz71yHTCmDHiJ9quFpb9cKANeeb2evV2\" \"test\" 2)"'
        });

        await opRogue.confirmation();
        expect(opRogue.hash).toBeDefined();
        expect(opRogue.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.unexpected_forged_value');
      }
      done();
    });
    

  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking

