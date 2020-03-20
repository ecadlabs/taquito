import { CONFIGS } from "./config";
import { Protocols } from "@taquito/taquito";

CONFIGS.forEach(({ lib, rpc, setup, createAddress, knownBaker, protocol}) => {
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
        if (protocol === Protocols.PsCARTHA) {
          expect(ex.message).toMatch('empty_implicit_delegated_contract')
        } else if (protocol === Protocols.PsBabyM1) {
          expect(ex.message).toMatch('Assert_failure src/proto_005_PsBabyM1/lib_protocol/contract_storage.ml')
        }
      }
      done();
    });
  });
})
