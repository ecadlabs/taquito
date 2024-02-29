import { CONFIGS } from "../../config";
import { depositContractCode, depositContractStorage } from "../../data/deposit_contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test smart contract entrypoint call with unit as param through wallet API using:: ${rpc}`, () => {

    beforeEach(async () => {
      await setup(true)
    })
    test('Verify wallet.originate for a contract and call deposit method with unit param', async () => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: depositContractCode,
        init: depositContractStorage
      }).send();
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toBeTruthy
    })
  });
})
