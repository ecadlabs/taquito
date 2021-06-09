import { CONFIGS } from "./config";
import { DEFAULT_FEE } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  describe(`Test emptying an unrevealed implicit account using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('create an unrevealed implicit account, fund it, empty it', async (done) => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 0.005 });
      await op.confirmation();
      // A transfer from an unrevealed account will require a an additional fee (reveal operation)
      // Only need to include reveal fees if the account is not revealed
      const revealEstimate = await LocalTez.estimate.reveal();
      const revealFee = revealEstimate ? revealEstimate.suggestedFeeMutez : 0 // 374

      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: balance.minus(DEFAULT_FEE.REVEAL).toNumber() });

      // The max amount that can be sent now is the total balance minus the fees + reveal fees (assuming the dest is already allocated)
      const maxAmount = balance.minus(estimate.suggestedFeeMutez + revealFee).toNumber();
      const op3 = await LocalTez.contract.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount, fee: estimate.suggestedFeeMutez, gasLimit: estimate.gasLimit, storageLimit: 0 })
      await op3.confirmation();

      expect((await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())).toString()).toEqual("0")

      done();
    });
  });
})
