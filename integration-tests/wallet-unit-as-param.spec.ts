import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { depositContractCodeHangzhou, depositContractStorageHangzhou } from "./data/deposit_contract_hangzhou";
import { depositContractCodeIthaca, depositContractStorageIthaca } from "./data/deposit_contract_ithaca";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const ithacanet = protocol === Protocols.Psithaca2 ? test: test.skip;
  const hangzhounet = protocol === Protocols.PtHangz2 ? test: test.skip;

  describe(`Test contract made with wallet API with unit as params using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup()
      done()
    })
    hangzhounet('originates contract made with wallet API and calls deposit method with unit param', async (done: () => void) => {
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

    ithacanet('originates contract made with wallet API and calls deposit method with unit param', async (done) => {
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
