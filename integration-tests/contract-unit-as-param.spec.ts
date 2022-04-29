import { CONFIGS } from "./config";
import { depositContractCodeIthaca, depositContractStorageIthaca } from "./data/deposit_contract_ithaca";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contract with unit as params using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })

    it('Originates contract and calls deposit method with unit param', async (done) => {
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
