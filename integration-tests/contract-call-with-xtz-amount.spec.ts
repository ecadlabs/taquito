import { CONFIGS } from "./config";
import { depositContractCode, depositContractStorage } from "./data/deposit_contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract call with amount using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('originates a contract and sends base layer tokens when calling contract methods', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "0",
        code: depositContractCode,
        init: depositContractStorage
      })
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toEqual('applied')
      let balance = await Tezos.tz.getBalance(contract.address);
      expect(balance.toString()).toEqual("1000000")

      const operationMutez = await contract.methods.deposit(null).send({ amount: 1, mutez: true } as any);
      await operationMutez.confirmation();
      expect(operationMutez.status).toEqual('applied')
      balance = await Tezos.tz.getBalance(contract.address);
      expect(balance.toString()).toEqual("1000001")
      done();
    })
  });
})
