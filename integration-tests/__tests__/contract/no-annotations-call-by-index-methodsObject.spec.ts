import { FieldNumberingStrategy } from "@taquito/michelson-encoder";
import { CONFIGS } from "../../config";
import { noAnnotCode, noAnnotInit } from "../../data/token_without_annotation";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination with no annotations calling methods by index using methodObjects through contract api: ${rpc}`, () => {
    /** The goal of the test is to verify a contract entrypoint call using the methodsObject method (contract.methodsObject)
     *  in case of a contract having no annotation in its code. */

    beforeEach(async () => {
      await setup()
    })

    // Constants to replace annotations
    const ACCOUNTS = '0';
    const BALANCE = '0';
    const ALLOWANCES = '1';
    const TRANSFER = '0';
    const APPROVE = '2';

    // Actual tests

    const ACCOUNT2_ADDRESS = 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'
    
    // Runs the entire tests for a given fieldNumberingStrategy
    const testContract = (strategy: FieldNumberingStrategy, innerObjectStartingIndex: number) => {
      it(`Verify contract.originate for a contract with no annotations for methods using methodObjects with fieldNumberingStrategy: ${strategy}`, async () => {
        Tezos.setFieldNumberingStrategy(strategy);
        const ACCOUNT1_ADDRESS = await Tezos.signer.publicKeyHash()
        // Originate a contract with a known state
        const op = await Tezos.contract.originate({
          balance: "1",
          code: noAnnotCode,
          init: noAnnotInit(await Tezos.signer.publicKeyHash())
        })
        await op.confirmation()
        const contract = await op.contract()

        // Make a transfer

        const operation = await contract.methodsObject[TRANSFER]({
          0: ACCOUNT1_ADDRESS,
          1: ACCOUNT2_ADDRESS,
          2: "1"
        }).send();

        await operation.confirmation();
        expect(operation.status).toEqual('applied')

        // Verify that the transfer was done as expected
        const storage = await contract.storage<any>()
        let account1 = await storage[ACCOUNTS].get(ACCOUNT1_ADDRESS)
        expect(account1[BALANCE].toString()).toEqual('16')

        const account2 = await storage[ACCOUNTS].get(ACCOUNT2_ADDRESS)
        expect(account2[BALANCE].toString()).toEqual('1')

        // Approve
        const operation2 = await contract.methodsObject[APPROVE]({
          [innerObjectStartingIndex]: ACCOUNT2_ADDRESS,
          [innerObjectStartingIndex + 1]: "1"
        }).send();

        await operation2.confirmation();
        expect(operation2.status).toEqual('applied')

        // Verify that the allowance was done as expected
        account1 = await storage[ACCOUNTS].get(ACCOUNT1_ADDRESS)
        expect(account1[ALLOWANCES].get(ACCOUNT2_ADDRESS).toString()).toEqual('1')
      });
    };
    
    // Run the tests for all fieldNumberingStrategies
    testContract('Legacy', 2);
    testContract('ResetFieldNumbersInNestedObjects', 0);
    testContract('Latest', 0);

  });
});
