import { CONFIGS } from "./config";
import { depositContractCodeIthaca, depositContractStorageIthaca } from "./data/deposit_contract_ithaca";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
<<<<<<< HEAD
  const test = require('jest-retries');
  describe(`Test contract origination with unit as params through wallet api using: ${rpc}`, () => {
=======
>>>>>>> master

  describe(`Test contract made with wallet API with unit as params using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup()
      done()
    })
<<<<<<< HEAD
    test('Verify wallet.originate for a contract and call deposit method with unit param', 2, async (done: () => void) => {
=======

    it('originates contract made with wallet API and calls deposit method with unit param', async (done) => {
>>>>>>> master
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: depositContractCodeIthaca,
        init: depositContractStorageIthaca
      }).send();
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toBeTruthy
      done();
    })
  });
})
