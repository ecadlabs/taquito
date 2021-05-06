import { CONFIGS } from "./config";
import { failwithContractCode } from "./data/failwith";
import { managerCode } from "./data/manager_code";
import { MANAGER_LAMBDA } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract that calls 2nd contract that FAILs: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Catches a Failwith from a contract made with wallet api called via a manager contract', async (done) => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: failwithContractCode,
        storage: null
      }).send();
      const contract = await op.contract()
      expect(op.opHash).toBeDefined();
      await op.confirmation();

      const opManager = await Tezos.wallet.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      }).send()

      const managerContract = await opManager.contract()
      expect(opManager.opHash).toBeDefined();
      await opManager.confirmation();
      try {
        await managerContract.methods.do(MANAGER_LAMBDA.transferToContract(contract.address, 1)).send({ amount: 0 })
        fail('Expected transfer operation to throw error')
      } catch (ex) {
        expect(ex.message).toMatch('test')
      }
      done();
    });
  });
})
