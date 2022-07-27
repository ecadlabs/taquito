import { CONFIGS } from "./config";
import { depositContractCodeIthaca, depositContractStorageIthaca } from "./data/deposit_contract_ithaca";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
<<<<<<< HEAD
  const test = require('jest-retries');

  describe(`Test contract origination with unit as params through contract api using: ${rpc}`, () => {
=======

  describe(`Test contract with unit as params using: ${rpc}`, () => {
>>>>>>> master

    beforeEach(async (done) => {
      await setup()
      done()
    })
<<<<<<< HEAD
    test('Verify contract.originate for a contract and call deposit method with unit param', 2 , async (done: () => void) => {
=======

    it('Originates contract and calls deposit method with unit param', async (done) => {
>>>>>>> master
      const op = await Tezos.contract.originate({
        balance: "1",
        code: depositContractCodeIthaca,
        init: depositContractStorageIthaca
      })
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toEqual('applied')
      done();
    })

  });
})
