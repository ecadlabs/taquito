import { CONFIGS } from "../../config";
import { getRevealFee } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  describe(`Test emptying an unrevealed implicit account through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify that a new unrevealed implicit account can be created, funded and emptied through contract api', async () => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 0.005 });
      await op.confirmation();

      // A transfer from an unrevealed account will require an additional fee (reveal operation)
      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: balance.minus(getRevealFee(await LocalTez.signer.publicKeyHash())).toNumber() });

      // The max amount that can be sent now is the total balance minus the fees + reveal fees (assuming the dest is already allocated)
      const maxAmount = balance.minus(estimate.suggestedFeeMutez + getRevealFee(await LocalTez.signer.publicKeyHash())).toNumber();
      const op3 = await LocalTez.contract.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount, fee: estimate.suggestedFeeMutez, gasLimit: estimate.gasLimit, storageLimit: 0 })
      await op3.confirmation();

      expect((await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())).toString()).toEqual("0")

    });
  });
})
