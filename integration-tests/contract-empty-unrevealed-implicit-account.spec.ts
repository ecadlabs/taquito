import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  describe(`Test emptying an unrevealed implicit account using: ${rpc}`, () => {
    it('does nothing', async (done) => {
      done();
    })

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('create an unrevealed implicit account, fund it, empty it', async (done) => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 0.005 });
      await op.confirmation();
      const manager = await Tezos.rpc.getManagerKey(await LocalTez.signer.publicKeyHash())
      if(!manager) {
        const revealop = await LocalTez.contract.reveal({});
        await revealop.confirmation();
      }

      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: balance.toNumber() });

      // The max amount that can be sent now is the total balance minus the fees (assuming the dest is already allocated)
      const maxAmount = balance.minus(estimate.suggestedFeeMutez).toNumber();
      const op3 = await LocalTez.contract.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount, fee: estimate.suggestedFeeMutez, gasLimit: estimate.gasLimit, storageLimit: 0 })
      await op3.confirmation();

      expect((await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())).toString()).toEqual("0")

      done();
    });
  });
})
