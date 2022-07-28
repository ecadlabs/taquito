import { CONFIGS } from "./config";
import { depositContractCode, depositContractStorage } from "./data/deposit_contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');
  describe(`Test contract origination with unit as params through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    test('Verify wallet.originate for a contract and call deposit method with unit param', 2, async (done: () => void) => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: depositContractCode,
        init: depositContractStorage
      }).send();
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toBeTruthy
      done();
    })
  });
})
