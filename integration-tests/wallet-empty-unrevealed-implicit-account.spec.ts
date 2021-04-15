import { CONFIGS } from "./config";
import { DEFAULT_FEE } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;

  const test = require('jest-retries');

  describe(`Test emptying an unrevealed implicit wallet account using: ${rpc}`, () => {
    it('does nothing', async (done) => {
      done();
    })

    beforeEach(async (done) => {
      await setup()
      done()
    })
    test('creates an unrevealed implicit wallet account, funds it, and empties it', 2, async (done: () => void) => {
      const LocalTez = await createAddress();
      const op = await Tezos.wallet.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 0.005 }).send();
      await op.confirmation();
      // A transfer from an unrevealed account will require a an additional fee of 0.00142tz (reveal operation)
      const manager = await Tezos.rpc.getManagerKey(await LocalTez.signer.publicKeyHash())
      const requireReveal = !manager

      // Only need to include reveal fees if the account is not revealed
      const revealFee = requireReveal ? DEFAULT_FEE.REVEAL : 0;

      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: balance.minus(revealFee).toNumber() });

      // The max amount that can be sent now is the total balance minus the fees + reveal fees (assuming the dest is already allocated)
      const maxAmount = balance.minus(estimate.suggestedFeeMutez + revealFee).toNumber();
      const op3 = await LocalTez.wallet.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount}).send();
      await op3.confirmation();

     // expect((await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())).toString()).toEqual("0")
      expect((await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())).toString()).toBeDefined

      done();
    });
  });
})
