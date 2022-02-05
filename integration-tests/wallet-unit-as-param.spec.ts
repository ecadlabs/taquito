import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { depositContractCodeHangzhou, depositContractStorageHangzhou } from "./data/deposit_contract_hangzhou";
import { depositContractCodeIthaca, depositContractStorageIthaca } from "./data/deposit_contract_ithaca";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const testRetry = require('jest-retries');
  const skipIthacanet = protocol === Protocols.Psithaca2 ? test.skip : testRetry;
  const skipHangzhounet = protocol === Protocols.PtHangz2 ? test.skip : test;
  const skipHangzhouAndIthaca = protocol === Protocols.PtHangz2 || Protocols.Psithaca2 ? test.skip : test;

  describe(`Test contract made with wallet API with unit as params using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup()
      done()
    })
    skipIthacanet('originates contract made with wallet API and calls deposit method with unit param', async (done: () => void) => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: depositContractCodeHangzhou,
        init: depositContractStorageHangzhou
      }).send();
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toBeTruthy
      done();
    })

    skipHangzhouAndIthaca('originates contract made with wallet API and calls deposit method with unit param', async (done) => {
      //restore to skipHangzhou when forger supports new sub_mutez for Ithaca
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: depositContractCodeIthaca,
        init: depositContractStorageIthaca
      }).send();
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toBeTruthy
      done();
    })
  });
})
