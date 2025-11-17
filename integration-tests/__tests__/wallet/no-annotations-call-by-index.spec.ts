import { CONFIGS } from "../../config";
import { noAnnotCode, noAnnotInit } from "../../data/token_without_annotation";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test calling methods by index through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup();
    });
    test('Verify calls to the methods of the contract that have no annotations and must be referred to using indexes.', async () => {
      // Constants to replace annotations
      const ACCOUNTS = '0';
      const BALANCE = '0';
      const ALLOWANCES = '1';
      const TRANSFER = '0';
      const APPROVE = '2';

      // Actual tests

      const ACCOUNT1_ADDRESS = await Tezos.signer.publicKeyHash();
      const ACCOUNT2_ADDRESS = 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu';

      // Originate a contract with a known state
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: noAnnotCode,
        init: noAnnotInit(await Tezos.signer.publicKeyHash())
      }).send();
      const contract = await op.contract();

      // Make a transfer
      const operation = await contract.methodsObject[TRANSFER](ACCOUNT1_ADDRESS, ACCOUNT2_ADDRESS, "1").send();
      await operation.confirmation();
      expect(operation.status).toBeTruthy;

      // Verify that the transfer was done as expected
      // file deepcode ignore no-any: any is good enough
      const storage = await contract.storage<any>();
      let account1 = await storage[ACCOUNTS].get(ACCOUNT1_ADDRESS);
      expect(account1[BALANCE].toString()).toEqual('16');

      const account2 = await storage[ACCOUNTS].get(ACCOUNT2_ADDRESS);
      expect(account2[BALANCE].toString()).toEqual('1');

      // Approve
      const operation2 = await contract.methodsObject[APPROVE](ACCOUNT2_ADDRESS, "1").send();
      await operation2.confirmation();
      expect(operation2.status).toBeTruthy;

      // Verify that the allowance was done as expected
      account1 = await storage[ACCOUNTS].get(ACCOUNT1_ADDRESS);
      expect(account1[ALLOWANCES].get(ACCOUNT2_ADDRESS).toString()).toEqual('1');
    });
  });
});
