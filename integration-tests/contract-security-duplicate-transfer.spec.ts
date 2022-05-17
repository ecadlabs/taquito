import { CONFIGS } from './config';

// TC-006: Type "operation" is not duplicable and error will arise "internal_operation_replay"

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contracts using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
      done();
    });

    it('Verify Type "operation" is not duplicable with error internal_operation_replay.', async (done) => {
      try {
        const publicKeyHash = await Tezos.signer.publicKeyHash();
        const op = await Tezos.contract.originate({
          balance: '8',
          code: `{ 
            parameter unit;
            storage unit;
            code
              {
                DROP ; # drop storage and input
                PUSH address "${publicKeyHash}";
                CONTRACT unit;
                IF_NONE { FAIL } {};
                PUSH mutez 1;
                UNIT;
                TRANSFER_TOKENS;
                DUP;
                NIL operation;
                SWAP;
                CONS;
                SWAP;
                CONS;
                UNIT;
                SWAP;
                PAIR;
              }; }`,
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
        expect(error.message).toContain('internal_operation_replay');
      }
      done();
    });
  });
});
// This test was transcribed to Taquito from bash scripts at https://github.com/InferenceAG/TezosSecurityBaselineChecking
