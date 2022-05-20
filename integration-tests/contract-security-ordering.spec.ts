import { CONFIGS } from './config';

// TC-011: Testcase checks whether the Tezos operation ordering is still the same.

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it('Verify whether the Tezos operation ordering is still the same', async (done) => {
      const publicKeyHash = await Tezos.signer.publicKeyHash();

      const opOrderingBasic = await Tezos.contract.originate({
        balance: '6',
        code: `{parameter unit;
            storage unit;
            code {
                   DROP;
                   UNIT;
                   PUSH address "${publicKeyHash}";
                   CONTRACT unit;
                   IF_NONE
                     { FAIL;}
                     {};
                   PUSH mutez 3000000;
                   UNIT;
                   TRANSFER_TOKENS;
                   NIL operation;
                   SWAP;
                   CONS;
                   PUSH address "${publicKeyHash}";
                   CONTRACT unit;
                   IF_NONE
                     { FAIL;}
                     {};
                   PUSH mutez 2000000;
                   UNIT;
                   TRANSFER_TOKENS;
                   CONS;
                   PUSH address "${publicKeyHash}";
                   CONTRACT unit;
                   IF_NONE
                     { FAIL;}
                     {};
                   PUSH mutez 1000000;
                   UNIT;
                   TRANSFER_TOKENS;
                   CONS; 
                   PAIR; }}`,
        storage: 0,
      });

      await opOrderingBasic.confirmation();
      expect(opOrderingBasic.hash).toBeDefined();
      expect(opOrderingBasic.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      const contract = await opOrderingBasic.contract();
      expect(await contract.storage()).toBeTruthy();

      const opSend = await Tezos.wallet
        .transfer({ to: contract.address, amount: 0 })
        .send()
        .then((op) => {
          return op.confirmation().then(() => op.opHash);
        })
      // need at this point a way to grab the contents of the operation to check if the transaction order is preserved.
      // the idea is that tranaction order should be preserved so as to avoid an attack that tries to exploit out-of-order transactions
      done();
    });
  });
});
// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking