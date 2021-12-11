import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { depositContractCode, depositContractStorage } from "./data/deposit_contract";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const testRetry = require('jest-retries');
  const skipIdiazabalnet = protocol === Protocols.PtIdiaza ? test.skip : testRetry;
  describe(`Test contract made with wallet API with unit as params using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    skipIdiazabalnet('originates contract made with wallet API and calls deposit method with unit param', 2, async (done: () => void) => {
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
