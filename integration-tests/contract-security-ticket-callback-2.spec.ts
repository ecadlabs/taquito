import { CONFIGS } from './config';

// TC-T-009: assume that the ticket is just a (pair address cty nat) and can "easily" be created via a callback.
// The case reaches a FAILWITH 

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it("Verify ticket is not easily created by a callback", async (done) => {
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

        await Tezos.contract
          .at(opCallerContract.address)
          .then((contract) => {
            return contract.methods.init(opGetterContract.address).send();
          })
          .then((op) => {
            return op.confirmation().then(() => op.hash);
          }) 
      } catch (error: any) {
        expect(error.message).toContain('{\"prim\":\"Unit\"}');
        console.log(error.message)
      }
      done();
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/Inference/TezosSecurityBaselineCheckingFramework
