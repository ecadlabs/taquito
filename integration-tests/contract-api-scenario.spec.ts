import { CONFIGS } from "./config";
import { ligoSample } from "./data/ligo-simple-contract";
import { tokenCode, tokenInit } from "./data/tokens";
import { voteSample } from "./data/vote-contract";
import { depositContractCode, depositContractStorage } from "./data/deposit_contract";

import { tokenBigmapCode } from './data/token_bigmap'
import { collection_code } from "./data/collection_contract";

import { noAnnotCode, noAnnotInit } from "./data/token_without_annotation";
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT } from "@taquito/taquito";


CONFIGS.forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Simple origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: `parameter string;
        storage string;
        code {CAR;
              PUSH string "Hello ";
              CONCAT;
              NIL operation; PAIR};
        `,
        init: `"test"`
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    it('Simple set delegate', async (done) => {
      const delegate = 'tz1PirboZKFVqkfE45hVLpkpXaZtLk3mqC17'
      const op = await Tezos.contract.setDelegate({
        delegate,
        source: await Tezos.signer.publicKeyHash(),
        fee: DEFAULT_FEE.DELEGATION,
        gasLimit: DEFAULT_GAS_LIMIT.DELEGATION
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)

      const account = await Tezos.rpc.getDelegate(await Tezos.signer.publicKeyHash())
      expect(account).toEqual(delegate)
      done();
    });

    it('Set delegate with automatic estimate', async (done) => {
      const delegate = 'tz1PirboZKFVqkfE45hVLpkpXaZtLk3mqC17'
      const op = await Tezos.contract.setDelegate({
        delegate,
        source: await Tezos.signer.publicKeyHash(),
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)

      const account = await Tezos.rpc.getDelegate(await Tezos.signer.publicKeyHash())
      expect(account).toEqual(delegate)
      done();
    });

    it('Simple ligo origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();

      const storage: any = await contract.storage()
      expect(storage.toString()).toEqual("0")
      const opMethod = await contract.methods.main("2").send();

      await opMethod.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const storage2: any = await contract.storage()
      expect(storage2.toString()).toEqual("2")
      done();
    });

    it('Token origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: tokenCode,
        init: tokenInit(await Tezos.signer.publicKeyHash()),
        fee: 150000,
        storageLimit: 10000,
        gasLimit: 400000,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();
      const opMethod = await contract.methods.mint(await Tezos.signer.publicKeyHash(), 100).send();

      await opMethod.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    it('Token origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: voteSample,
        storage: {
          mgr1: {
            addr: await Tezos.signer.publicKeyHash(),
            key: null,
          },
          mgr2: {
            addr: await Tezos.signer.publicKeyHash(),
            key: await Tezos.signer.publicKeyHash(),
          },
        }
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    it('Transfer using explicit counter', async (done) => {
      try {
        // Rejected because the counter is in the past
        await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2, counter: 1 })
        fail('Expected transfer to fail because counter should be in the past')
      } catch (ex) {
        const error = JSON.parse(ex.body)[0]
        expect(error.id).toMatch("counter_in_the_past")
      }

      // Should pass because Taquito set the counter automatically
      const op = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
      try {
        // Will fail because Taquito fetch the wrong counter from RPC
        // This would need to be batched with the first one to work see: https://github.com/ecadlabs/taquito/issues/177
        // See issue: https://gitlab.com/tezos/tezos/issues/626
        await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2.1 })
        fail('Expected transfer to fail because RPC should provide an already existing counter')
      } catch (ex) {
        const error = JSON.parse(ex.body)[0]
        expect(error.id).toMatch("failure")
      }

      try {
        // Will fail because the node reject counter in the future
        // This would need to be batched with the first one to work see: https://github.com/ecadlabs/taquito/issues/177
        // See issue: https://gitlab.com/tezos/tezos/issues/36
        await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2.1, counter: op.counter!.plus(1).toNumber() })
        fail('Expected transfer to fail because the specified counter should be in the future')
      } catch (ex) {
        const error = JSON.parse(ex.body)[0]
        expect(error.id).toMatch("counter_in_the_future")
      }

      // Operation worked
      await op.confirmation()
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)

      // Send transaction we new counter from RPC
      const op2 = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2.1 })
      await op2.confirmation()
      done();
    })

    it('Transfer and wait 2 confirmations', async (done) => {
      const op = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
      await op.confirmation()
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const [first, second] = await Promise.all([op.confirmation(), op.confirmation(2)])
      expect(second - first).toEqual(1)
      // Retrying another time should be instant
      const [first2, second2] = await Promise.all([op.confirmation(), op.confirmation(2)])
      expect(second2 - first2).toEqual(1)
      done();
    })

    it('Use big map abstraction for big maps', async (done) => {
      // Deploy a contract with a big map
      const op = await Tezos.contract.originate({
        balance: "1",
        code: tokenCode,
        init: tokenInit(`${await Tezos.signer.publicKeyHash()}`),
      })
      const contract = await op.contract()

      // Fetch the storage of the newly deployed contract
      const storage: any = await contract.storage();

      // First property is the big map abstract (The contract do not have annotations)
      const bigMap = storage['0'];

      // Fetch the key (current pkh that is running the test)
      const bigMapValue = await bigMap.get(await Tezos.signer.publicKeyHash())
      expect(bigMapValue['0'].toString()).toEqual("2")
      expect(bigMapValue['1']).toEqual({})
      done();
    })

    it('Test contract with unit as params', async (done) => {
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

    it('Token with empty big map origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: tokenBigmapCode,
        storage: {
          owner: await Tezos.signer.publicKeyHash(),
          accounts: {},
          totalSupply: "0"
        }
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    it('Token with big map and with initial data', async (done) => {
      const addr = await Tezos.signer.publicKeyHash();

      const initialStorage = {
        owner: addr,
        accounts: {
          [addr]: {
            balance: "1",
            allowances: {
              [addr]: "1"
            }
          }
        },
        totalSupply: "1"
      }

      const op = await Tezos.contract.originate({
        balance: "1",
        code: tokenBigmapCode,
        storage: initialStorage
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract()
      const storage: any = await contract.storage()
      expect((await storage.accounts.get(addr)).allowances[addr].toString()).toEqual(initialStorage.accounts[addr].allowances[addr])
      done();
    });

    it('Collection contract test', async (done) => {
      const addr = await Tezos.signer.publicKeyHash();

      const initialStorage = {
        set1: ['1'],
        list1: ['1'],
        map1: { "1": "1" }
      }

      const op = await Tezos.contract.originate({
        balance: "1",
        code: collection_code,
        storage: initialStorage
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract()
      let storage: any = await contract.storage()
      expect(storage['set1'].map((x: any) => x.toString())).toEqual(['1'])
      expect(storage['list1'].map((x: any) => x.toString())).toEqual(['1'])
      expect(storage['map1']['1'].toString()).toEqual('1')

      const setOp = await contract.methods['setSet'](['2']).send()
      await setOp.confirmation();

      const listOp = await contract.methods['setList'](['2']).send()
      await listOp.confirmation();

      const mapOp = await contract.methods['setMap']({ "2": "2" }).send()
      await mapOp.confirmation();

      done();
    });

    it('Test contract with no annotations for methods', async (done) => {
      // Constants to replace annotations
      const ACCOUNTS = '0';
      const BALANCE = '0';
      const ALLOWANCES = '1';
      const TRANSFER = '0';
      const APPROVE = '2';

      // Actual tests

      const ACCOUNT1_ADDRESS = await Tezos.signer.publicKeyHash()
      const ACCOUNT2_ADDRESS = 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'

      // Originate a contract with a known state
      const op = await Tezos.contract.originate({
        balance: "1",
        code: noAnnotCode,
        init: noAnnotInit(await Tezos.signer.publicKeyHash())
      })
      const contract = await op.contract()

      // Make a transfer
      const operation = await contract.methods[TRANSFER](ACCOUNT1_ADDRESS, ACCOUNT2_ADDRESS, "1").send();
      await operation.confirmation();
      expect(operation.status).toEqual('applied')

      // Verify that the transfer was done as expected
      const storage = await contract.storage<any>()
      let account1 = await storage[ACCOUNTS].get(ACCOUNT1_ADDRESS)
      expect(account1[BALANCE].toString()).toEqual('16')

      const account2 = await storage[ACCOUNTS].get(ACCOUNT2_ADDRESS)
      expect(account2[BALANCE].toString()).toEqual('1')

      // Approve
      const operation2 = await contract.methods[APPROVE](ACCOUNT2_ADDRESS, "1").send();
      await operation2.confirmation();
      expect(operation2.status).toEqual('applied')

      // Verify that the allowance was done as expected
      account1 = await storage[ACCOUNTS].get(ACCOUNT1_ADDRESS)
      expect(account1[ALLOWANCES][ACCOUNT2_ADDRESS].toString()).toEqual('1')
      done();
    })

  });
})
