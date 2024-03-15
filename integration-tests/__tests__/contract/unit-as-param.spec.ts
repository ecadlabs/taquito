import { CONFIGS } from "../../config";
import { depositContractCode, depositContractStorage } from "../../data/deposit_contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contract origination with unit as params through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup(true)
    })
    test('Verify contract.originate for a contract and call deposit method with unit param', async () => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: depositContractCode,
        init: depositContractStorage
      })
      await op.confirmation()
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toEqual('applied')
    })

  });
})
