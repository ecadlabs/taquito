import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, createAddress, knownBaker }) => {
  const Tezos = lib;
  describe(`Test emptying a delegated implicit account using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('create a new account, delegate it, attempt to empty it despite delegation expect to fail', async (done) => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 });
      await op.confirmation();

      // Delegating from the account we want to empty
      // This will do the reveal operation automatically
      const op2 = await LocalTez.contract.setDelegate({ delegate: knownBaker, source: await LocalTez.signer.publicKeyHash() });
      await op2.confirmation();

      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.5 });

      // Emptying the account
      // The max amount that can be sent now is the total balance minus the fees (no need for reveal fees)
      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const maxAmount = balance.minus(estimate.suggestedFeeMutez).toNumber();
      expect.assertions(1)
      try {
        await LocalTez.contract.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount, fee: estimate.suggestedFeeMutez, gasLimit: estimate.gasLimit, storageLimit: 0 })
      } catch (ex) {
          expect(ex.message).toMatch('empty_implicit_delegated_contract')
      }
      done();
    });
  });
})
