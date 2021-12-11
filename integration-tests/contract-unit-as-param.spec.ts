import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { depositContractCode, depositContractStorage } from "./data/deposit_contract";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const testRetry = require('jest-retries');
  const skipIdiazabalnet = protocol === Protocols.PtIdiaza ? test.skip : testRetry;
  
  describe(`Test contract with unit as params using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    skipIdiazabalnet('Originates contract and calls deposit method with unit param', 2 , async (done: () => void) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: depositContractCode,
        init: depositContractStorage
      })
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toEqual('applied')
      done();
    })
  });
})
