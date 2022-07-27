import { CONFIGS } from './config';
import {
  depositContractCodeHangzhou,
  depositContractStorageHangzhou,
} from './data/deposit_contract_hangzhou';
import {
  depositContractCodeIthaca,
  depositContractStorageIthaca,
} from './data/deposit_contract_ithaca';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
<<<<<<< HEAD
  describe(`Test contract origination and obtaining with amount through contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Verify contract.originate for a contract and send base layer token when calling contract methods', async (done) => {
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
=======

  describe(`Test contract call with amount using: ${rpc}`, () => {
    beforeEach(async (done) => {
      await setup();
>>>>>>> master
      done();
    });

    it(
      'originates a contract on Ithaca with SUB MUTEZ and sends base layer tokens when calling contract methods',
      async (done) => {
        const op = await Tezos.contract.originate({
          balance: '0',
          code: depositContractCodeIthaca,
          init: depositContractStorageIthaca,
        });
        const contract = await op.contract();

        const operation = await contract.methods.deposit(null).send({ amount: 1 });
        await operation.confirmation();
        expect(operation.status).toEqual('applied');
        let balance = await Tezos.tz.getBalance(contract.address);
        expect(balance.toString()).toEqual('1000000');

        const operationMutez = await contract.methods
          .deposit(null)
          .send({ amount: 1, mutez: true } as any);
        await operationMutez.confirmation();
        expect(operationMutez.status).toEqual('applied');
        balance = await Tezos.tz.getBalance(contract.address);
        expect(balance.toString()).toEqual('1000001');
        done();
      }
    );

    it('fail to originate a contract on Ithaca with SUB', async () => {
      try {
        await Tezos.contract.originate({
          balance: '0',
          code: depositContractCodeHangzhou,
          init: depositContractStorageHangzhou,
        });
      } catch (error: any) {
        expect(error.message).toContain(
          'michelson_v1.deprecated_instruction'
        );
      }
    });

  });
});
