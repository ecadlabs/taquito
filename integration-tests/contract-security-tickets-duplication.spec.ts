import { CONFIGS } from './config';

// TC-T-022: Duplicate ticket - duplicate transaction operation
// TC-T-023: Duplicate ticket - Duplicate ticket - duplicate map containing tickets
// TC-T-024: Duplicate ticket - duplicate big_map containing tickets

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it('Verify creating ticket is not possible with duplicate transaction operation', async (done) => {
      try {
        const opJoin = await Tezos.contract.originate({
          code: `   {  parameter (ticket string);
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
        };      
      }`,
          init: 'None',
        });

        await opJoin.confirmation();
        expect(opJoin.hash).toBeDefined();
        expect(opJoin.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opJoinContract = await opJoin.contract();
        //expect(await opJoinContract.storage()).toBeTruthy();

        const opDupOp = await Tezos.contract.originate({
          code: `   {  parameter (ticket string);
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
        };      
      }`,
          init: 'Unit',
        });

        await opDupOp.confirmation();
        expect(opDupOp.hash).toBeDefined();
        expect(opDupOp.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const opDupOpContract = await opDupOp.contract();
        expect(await opDupOpContract.storage()).toBeTruthy();

        await Tezos.contract
          .at(opDupOpContract.address)
          .then((contract) => {
            return contract.methods.default(`${opJoinContract.address}`).send();
          })
          .then((op) => {
            return op.confirmation().then(() => op.hash);
          });
      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.invalid_primitive');
      }
      done();
    });

    it('Verify contract for ticket is not created with duplicate map containing tickets', async (done) => {
      try {
        const opGetter = await Tezos.contract.originate({
          code: ` { parameter unit;
            storage unit;
            code
              {
                DROP ; # drop storage and input
                EMPTY_MAP nat (ticket string); 
                PUSH nat 1;
                PUSH string "test";
                TICKET;
                SOME;
                PUSH nat 0;
                UPDATE;
                DUP;
                DROP;
                DROP;
                UNIT;
                NIL operation;
                PAIR;
              };}`,
          init: 'Unit',
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.unexpected_ticket');
      }
      done();
    });

    it('Verify contract for ticket is not created with a duplicate big_map containing tickets', async (done) => {
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
                SOME;
                PUSH nat 0;
                UPDATE;
                DUP;
                DROP;
                DROP;
                UNIT;
                NIL operation;
                PAIR;
              };}`,
          init: 'Unit',
        });

        await opGetter.confirmation();
        expect(opGetter.hash).toBeDefined();
        expect(opGetter.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      } catch (error: any) {
        expect(error.message).toContain('michelson_v1.unexpected_ticket');
      }
      done();
    });   
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking
