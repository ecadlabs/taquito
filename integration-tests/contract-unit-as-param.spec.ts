import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { depositContractCodeHangzhou, depositContractStorageHangzhou } from "./data/deposit_contract_hangzhou";
import { depositContractCodeIthaca, depositContractStorageIthaca } from "./data/deposit_contract_ithaca";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const ithacanet = protocol === Protocols.Psithaca2 ? test: test.skip;
  const hangzhounet = protocol === Protocols.PtHangz2 ? test: test.skip;
  
  describe(`Test contract with unit as params using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    hangzhounet('Originates contract and calls deposit method with unit param', async (done: () => void) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: depositContractCodeHangzhou,
        init: depositContractStorageHangzhou
      })
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toEqual('applied')
      done();
    })

    ithacanet('Originates contract and calls deposit method with unit param', async (done: () => void) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: depositContractCodeIthaca,
        init: depositContractStorageIthaca
      })
      const contract = await op.contract()

      const operation = await contract.methods.deposit(null).send({ amount: 1, });
      await operation.confirmation();
      expect(operation.status).toEqual('applied')
      done();
    })
  });
})
