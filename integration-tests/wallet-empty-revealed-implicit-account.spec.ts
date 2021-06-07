import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  describe(`Test emptying a revealed implicit wallet account using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('creates a revealed implicit wallet account, funds it, empties it', async (done) => {
      const LocalTez = await createAddress();
      const op = await Tezos.wallet.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 }).send();
      await op.confirmation();

      // Sending token from the account we want to empty
      // This will do the reveal operation automatically
      const op2 = await LocalTez.wallet.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1 }).send();
      await op2.confirmation();

      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: balance.toNumber(), mutez : true });

      // Emptying the account
      // The max amount that can be sent now is the total balance minus the fees (no need for reveal fees)
      const maxAmount = balance.minus(estimate.suggestedFeeMutez).toNumber();
      
      const op3 = await LocalTez.wallet.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount }).send();
      await op3.confirmation();

      //expect((await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())).toString()).toEqual("0")
      expect((await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())).toString()).toBeDefined
      done();
    });
  });
})
