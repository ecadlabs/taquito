import { CONFIGS } from '../../config';

import {
  depositContractCode,
  depositContractStorage,
} from '../../data/deposit_contract';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Test contract call with amount using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup(true);
    });

    it(
      'originates a contract with SUB MUTEZ and sends base layer tokens when calling contract methods',
      async () => {
        const op = await Tezos.contract.originate({
          balance: '0',
          code: depositContractCode,
          init: depositContractStorage,
        });
        await op.confirmation();
        const contract = await op.contract();

        const operation = await contract.methodsObject.deposit(null).send({ amount: 1 });
        await operation.confirmation();
        expect(operation.status).toEqual('applied');
        let balance = await Tezos.tz.getBalance(contract.address);
        expect(balance.toString()).toEqual('1000000');

        const operationMutez = await contract.methodsObject
          .deposit(null)
          .send({ amount: 1, mutez: true } as any);
        await operationMutez.confirmation();
        expect(operationMutez.status).toEqual('applied');
        balance = await Tezos.tz.getBalance(contract.address);
        expect(balance.toString()).toEqual('1000001');
      }
    );
  });
});
