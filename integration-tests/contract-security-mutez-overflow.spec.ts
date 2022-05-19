import { doesNotMatch } from 'assert';
import { CONFIGS } from './config';

/** 
 * TC-005: Example of mutez overflow. If overflows are not prevented the contract is unusable. 
 * Any tokens locked in the contract will be irretrievable, etc.
*/

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it('Verify mutez overflow example', async (done) => {
      try {
        const op = await Tezos.contract.originate({
          code: `        { parameter unit ;
            storage mutez ;
            code {
                   DROP;
                   PUSH @mutez mutez 1000000000;
                   PUSH nat 10000000000;
                   MUL;
                   NIL operation ;
                   PAIR
                 } }`,
          storage: 0,
        });

        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        const contract = await op.contract();
        expect(await contract.storage()).toBeTruthy();

        await Tezos.wallet
          .transfer({ to: contract.address, amount: 0 })
          .send()
          .then((op) => {
            return op.confirmation().then(() => op.opHash);
          });
      } catch (error: any) {
        expect(error.message).toContain('tez.multiplication_overflow');
      }
      done();
    });
  });
});
// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking
