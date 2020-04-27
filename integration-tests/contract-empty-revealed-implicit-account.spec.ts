import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  describe(`Test emptying a revealed implicit account using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('creates a revealed implicit account, funds it, empties it', async (done) => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 });
      await op.confirmation();

      // Sending token from the account we want to empty
      // This will do the reveal operation automatically
      const op2 = await LocalTez.contract.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1 });
      await op2.confirmation();

      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.5 });

      // Emptying the account
      // The max amount that can be sent now is the total balance minus the fees (no need for reveal fees)
      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const maxAmount = balance.minus(estimate.suggestedFeeMutez).toNumber();
      const op3 = await LocalTez.contract.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount, fee: estimate.suggestedFeeMutez, gasLimit: estimate.gasLimit, storageLimit: 0 })
      await op3.confirmation();

      expect((await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())).toString()).toEqual("0")

      done();
    });
  });
})
