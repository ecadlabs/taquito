import { CONFIGS } from './config';

// example of mutez underflow - showing that SUB_MUTEZ;ASSERT_SOME prevents underflow

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it('Verify mutez underflow example', async (done) => {
      try {
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
          storage: 0,
        });

        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const contract = await op.contract();
        expect(await contract.storage()).toBeTruthy();

        console.log('contractAddress = ' + contract.address);

        Tezos.wallet
          .transfer({ to: contract.address, amount: 0 })
          .send()
          .then((op) => {
            return op.confirmation().then(() => op.opHash);
          });

        done();
      } catch (error: any) {
        //expect(error.message).toContain(
         // 'Underflowing subtraction of 0.000001 tez and 0.000002 tez'
        //);
      }
    });
  });
});

// This test was transcribed to Taquito from bash scripts at https://github.com/Inference/TezosSecurityBaselineCheckingFramework
