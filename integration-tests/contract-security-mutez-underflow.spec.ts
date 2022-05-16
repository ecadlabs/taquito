import { CONFIGS } from './config';

// TC-004: Example of mutez underflow - showing that SUB_MUTEZ;ASSERT_SOME prevents underflow

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it('Verify mutez underflow example', async (done) => {
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
               init:    { int: '0' },
        });

        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const contract = await op.contract();
        expect(await contract.storage()).toBeTruthy();

        console.log("contractAddress= "+contract.address)

        try{
         await Tezos.contract
          .at(contract.address)
          .then((contract) => {
            return contract.methods.default(0).send()
          })
          .then((op) => {
            return op.confirmation().then(() => op.hash);
          })
        } catch (error: any) {
          console.log(error.message)
          //expect(error.message).toContain('michelson_v1.runtime_error');
          expect(error.message).toContain('{\"prim\":\"Unit\"}');
        }
      done();
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/Inference/TezosSecurityBaselineCheckingFramework
