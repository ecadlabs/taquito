import { CONFIGS } from "./config";
import { failwithContractCode } from "./data/failwith";
import { managerCode } from "./data/manager_code";
import { MANAGER_LAMBDA } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  const test = require('jest-retries');

  describe(`Test contract that calls 2nd contract that FAILs: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    test('Catches a Failwith from a contract called via a manager contract', 2,  async (done: () => void) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: failwithContractCode,
        storage: null
      })
      const contract = await op.contract()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      expect(op.status === 'applied');

      const opManager = await Tezos.contract.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })

      const managerContract = await opManager.contract()
      expect(opManager.hash).toBeDefined();
      expect(opManager.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      expect(opManager.status === 'applied');
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
