import { CONFIGS } from "../../config";

CONFIGS().forEach(({ lib, rpc, setup, createAddress, knownBaker, networkName }) => {
  const Tezos = lib;
  const notTezlinknet = networkName === 'TEZLINKNET' ? test.skip : test

  describe(`Test emptying a delegated implicit account through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    notTezlinknet('Verify that new Account can be created, delegated and attempt to empty, it should fail despite delegation', async () => {
      const LocalTez = await createAddress();
      const op = await Tezos.wallet.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 }).send();
      await op.confirmation();

      // Delegating from the account we want to empty
      // This will do the reveal operation automatically
      const op2 = await LocalTez.wallet.setDelegate({ delegate: knownBaker }).send();
      await op2.confirmation();

      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.5 });

      // Emptying the account
      // The max amount that can be sent now is the total balance minus the fees (no need for reveal fees)
      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const maxAmount = balance.minus(estimate.suggestedFeeMutez).toNumber();
      expect.assertions(1)
      try {
        await LocalTez.wallet.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount }).send();
      } catch (ex: any) {
        expect(ex.message).toMatch('empty_implicit_delegated_contract')
      }
    });
  });
})
