import { DEFAULT_FEE, DEFAULT_GAS_LIMIT, MANAGER_LAMBDA, TezosToolkit, Protocols, MichelsonMap } from "@taquito/taquito";
import { Contract } from "taquito/src/contract/contract";
import { CONFIGS } from "./config";
import { badCode } from "./data/badCode";
import { booleanCode } from "./data/boolean_parameter";
import { collection_code } from "./data/collection_contract";
import { depositContractCode, depositContractStorage } from "./data/deposit_contract";
import { failwithContractCode } from "./data/failwith";
import { originate, originate2, transferImplicit2 } from "./data/lambda";
import { ligoSample } from "./data/ligo-simple-contract";
import { managerCode } from "./data/manager_code";
import { tokenCode, tokenInit } from "./data/tokens";
import { tokenBigmapCode } from './data/token_bigmap';
import { noAnnotCode, noAnnotInit } from "./data/token_without_annotation";
import { voteSample } from "./data/vote-contract";
import { storageContract } from "./data/storage-contract";
import { mapWithPairAsKeyCode, mapWithPairAsKeyStorage } from "./data/bigmap_with_pair_as_key";
import { storageContractWithPairAsKey } from "./data/storage-contract-with-pair-as-key";

CONFIGS.forEach(({ lib, rpc, setup, knownBaker, createAddress, protocol, knownBigMapContract }) => {
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

    it('Simple origination scenario with non ascii string', async (done) => {
      expect.assertions(1);
      try {
        await Tezos.contract.originate({
          balance: "1",
          code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
          init: `"Copyright ©"`
        })
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({ message: expect.stringContaining('invalidSyntacticConstantError') }))
      }
      done();
    });

    it('Contract with bad code', async (done) => {
      await expect(Tezos.contract.originate({
        balance: "1",
        code: badCode,
        init: { prim: "Unit" }
      })).rejects.toMatchObject({
        status: 400,
      })
      done();
    })

    it('Return undefined when BigMap key is not found', async () => {
      const myContract = await Tezos.contract.at(knownBigMapContract);
      const contractStorage: any = await myContract.storage();
      let value;
      if (rpc === "https://api.tez.ie/rpc/carthagenet") {
        value = await contractStorage.ledger.get("tz1NortRftucvAkD1J58L32EhSVrQEWJCEnB")
      } else {
        value = await contractStorage.ledger.get("tz1RL215HFeALUc1myZp3rKpSt9EuY5EUsbx")
      }
      expect(value).toBeUndefined();
    })

    it('Failwith contract', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: failwithContractCode,
        storage: null
      })
      const contract = await op.contract()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      expect(op.status === 'applied');

      try {
        await contract.methods.main(null).send()
      } catch (ex) {
        expect(ex.message).toMatch('test')
      }

      try {
        // Bypass estimation
        await contract.methods.main(null).send({ fee: 20000, gasLimit: 20000, storageLimit: 0 })
      } catch (ex) {
        expect(ex.message).toMatch('test')
      }
      done();
    });

    it('Failwith contract nested call', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: failwithContractCode,
        storage: null
      })
      const contract = await op.contract()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      expect(op.status === 'applied');

      const opManager = await Tezos.contract.originate({
        balance: "1",
        code: managerCode,
        init: { "string": await Tezos.signer.publicKeyHash() },
      })

      const managerContract = await opManager.contract()
      expect(opManager.hash).toBeDefined();
      expect(opManager.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      expect(opManager.status === 'applied');
      try {
        await managerContract.methods.do(MANAGER_LAMBDA.transferToContract(contract.address, 1)).send({ amount: 0 })
        fail('Expected transfer operation to throw error')
      } catch (ex) {
        expect(ex.message).toMatch('test')
      }
      done();
    });

    it('Simple set delegate', async (done) => {
      const delegate = knownBaker
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
      const delegate = knownBaker
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

    it('Bool parameter contract origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: booleanCode,
        storage: true,
        fee: 150000,
        storageLimit: 10000,
        gasLimit: 400000,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();

      expect(await contract.storage()).toBeTruthy();

      const opMethod = await contract.methods.setBool(false).send();

      await opMethod.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)

      expect(await contract.storage()).toBeFalsy();
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
      expect(bigMapValue['1']).toEqual(expect.objectContaining(new MichelsonMap()))
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
          accounts: new MichelsonMap(),
          totalSupply: "0"
        }
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });

    it('Test contract call with amount', async (done) => {
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
      done();
    })
    it('Token with big map and with initial data', async (done) => {
      const addr = await Tezos.signer.publicKeyHash();

      const initialStorage = {
        owner: addr,
        accounts: MichelsonMap.fromLiteral({
          [addr]: {
            balance: "1",
            allowances: MichelsonMap.fromLiteral({
              [addr]: "1"
            })
          },
          "tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD": {
            balance: "1",
            allowances: MichelsonMap.fromLiteral({
              [addr]: "1"
            })
          },
          "tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2": {
            balance: "2",
            allowances: MichelsonMap.fromLiteral({
              KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv: "1",
              [addr]: "1"
            })
          },
          "tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS": {
            balance: "1",
            allowances: MichelsonMap.fromLiteral({
              [addr]: "1"
            })
          },
          "KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv": {
            balance: "1",
            allowances: MichelsonMap.fromLiteral({
              [addr]: "1"
            })
          }
        }),
        totalSupply: "6"
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
      expect((await storage.accounts.get(addr)).allowances.get(addr).toString()).toEqual(initialStorage.accounts.get(addr).allowances.get(addr))
      done();
    });

    it('Collection contract test', async (done) => {
      const addr = await Tezos.signer.publicKeyHash();

      const initialStorage = {
        set1: ['2', '1', '3'],
        list1: ['1'],
        map1: MichelsonMap.fromLiteral({ "2": "1", "1": "1" })
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
      expect(storage['set1'].map((x: any) => x.toString())).toEqual(['1', '2', '3'])
      expect(storage['list1'].map((x: any) => x.toString())).toEqual(['1'])
      expect(storage['map1'].get('1').toString()).toEqual('1')

      const setOp = await contract.methods['setSet'](['2']).send()
      await setOp.confirmation();

      const listOp = await contract.methods['setList'](['2']).send()
      await listOp.confirmation();

      const mapOp = await contract.methods['setMap'](MichelsonMap.fromLiteral({ "2": "2" })).send()
      await mapOp.confirmation();

      done();
    });
    it('Storage contract', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: storageContract,
        storage: {
          "map1": MichelsonMap.fromLiteral({
            "tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD": 1,
            'KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv': 2,
            "tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2": 2,
            "tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS": 3,
          }),
          "map2": MichelsonMap.fromLiteral({
            "2": 1,
            '3': 2,
            "1": 2,
            "4": 3,
          }),
          "map3": MichelsonMap.fromLiteral({
            "2": 1,
            '3': 2,
            "1": 2,
            "4": 3,
          }),
          "map4": MichelsonMap.fromLiteral({
            "zz": 1,
            'aa': 2,
            "ab": 2,
            "cc": 3,
          }),
          "map5": MichelsonMap.fromLiteral({
            "aaaa": 1,
            "aa": 1,
            'ab': 2,
            "01": 2,
            "22": 3,
          }),
          "map6": MichelsonMap.fromLiteral({
            "2": 1,
            '3': 2,
            "1": 2,
            "4": 3,
          }),
          "map7": MichelsonMap.fromLiteral({
            "2018-04-23T10:26:00.996Z": 1,
            '2017-04-23T10:26:00.996Z': 2,
            "2019-04-23T10:26:00.996Z": 2,
            "2015-04-23T10:26:00.996Z": 3,
          }),
        }
      })

      await op.contract()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    })
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
      expect(account1[ALLOWANCES].get(ACCOUNT2_ADDRESS).toString()).toEqual('1')
      done();
    })

    it('Test emptying a delegated implicit account', async (done) => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 });
      await op.confirmation();

      // Delegating from the account we want to empty
      // This will do the reveal operation automatically
      const op2 = await LocalTez.contract.setDelegate({ delegate: knownBaker, source: await LocalTez.signer.publicKeyHash() });
      await op2.confirmation();

      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.5 });

      // Emptying the account
      // The max amount that can be sent now is the total balance minus the fees (no need for reveal fees)
      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const maxAmount = balance.minus(estimate.suggestedFeeMutez).toNumber();
      expect.assertions(1)
      try {
        await LocalTez.contract.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount, fee: estimate.suggestedFeeMutez, gasLimit: estimate.gasLimit, storageLimit: 0 })
      } catch (ex) {
        if (protocol === Protocols.PsCARTHA) {
          expect(ex.message).toMatch('empty_implicit_delegated_contract')
        } else if (protocol === Protocols.PsBabyM1) {
          expect(ex.message).toMatch('Assert_failure src/proto_005_PsBabyM1/lib_protocol/contract_storage.ml')
        }
      }

      done();
    });

    it('Test emptying an unrevealed implicit account', async (done) => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 0.005 });
      await op.confirmation();
      // A transfer from an unrevealed account will require a an additional fee of 0.00142tz (reveal operation)
      const manager = await Tezos.rpc.getManagerKey(await LocalTez.signer.publicKeyHash())
      const requireReveal = !manager

      // Only need to include reveal fees if the account is not revealed
      const revealFee = requireReveal ? DEFAULT_FEE.REVEAL : 0;

      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: balance.minus(revealFee).toNumber() });

      // The max amount that can be sent now is the total balance minus the fees + reveal fees (assuming the dest is already allocated)
      const maxAmount = balance.minus(estimate.suggestedFeeMutez + revealFee).toNumber();
      const op3 = await LocalTez.contract.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount })
      await op3.confirmation();

      expect((await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())).toString()).toEqual("0")

      done();
    });

    it('Test emptying a revealed implicit account', async (done) => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 });
      await op.confirmation();

      // Sending token from the account we want to empty
      // This will do the reveal operation automatically
      const op2 = await LocalTez.contract.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1 });
      await op2.confirmation();

      const estimate = await LocalTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 0.5 });

      // Emptying the account
      // The max amount that can be sent now is the total balance minus the fees (no need for reveal fees)
      const balance = await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())
      const maxAmount = balance.minus(estimate.suggestedFeeMutez).toNumber();
      const op3 = await LocalTez.contract.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: maxAmount, fee: estimate.suggestedFeeMutez, gasLimit: estimate.gasLimit, storageLimit: 0 })
      await op3.confirmation();

      expect((await Tezos.tz.getBalance(await LocalTez.signer.publicKeyHash())).toString()).toEqual("0")

      done();
    });

    // Pair as key is only supported since proto 006
    if (protocol === Protocols.PsCARTHA) {
      it('Storage contract with pair as key', async (done) => {
        const storageMap = new MichelsonMap();
        storageMap.set({
          0: "1",
          1: "2",
          2: "test",
          3: "cafe",
          4: "10",
          5: true,
          6: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5",
          7: "2019-09-06T15:08:29.000Z",
          8: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
        }, 100)
        storageMap.set({
          0: "1",
          1: "2",
          2: "test",
          3: "cafe",
          4: "10",
          5: false,
          6: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5",
          7: "2019-09-06T15:08:29.000Z",
          8: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
        }, 100)
        storageMap.set({
          0: "2",
          1: "2",
          2: "test",
          3: "cafe",
          4: "10",
          5: true,
          6: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5",
          7: "2019-09-06T15:08:29.000Z",
          8: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
        }, 100)
        storageMap.set({
          0: "1",
          1: "2",
          2: "test",
          3: "cafe",
          4: "10",
          5: true,
          6: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5",
          7: "2018-09-06T15:08:29.000Z",
          8: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"
        }, 100)
        const op = await Tezos.contract.originate({
          balance: "0",
          code: storageContractWithPairAsKey,
          storage: storageMap
        })
        await op.contract()
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
        done();
      })

      it('Contract with pair as key', async (done) => {
        const op = await Tezos.contract.originate({
          balance: "0",
          code: mapWithPairAsKeyCode,
          init: mapWithPairAsKeyStorage
        })
        const contract = await op.contract()
        const storage2 = await contract.storage<any>();
        const value = await storage2.get({ 'test': 'test2', 'test2': 'test3' })
        expect(value).toEqual('test')
        done();
      });
    }
  });

  describe('Estimate scenario', () => {
    let LowAmountTez: TezosToolkit;
    let contract: Contract;
    const amt = 2000000 + DEFAULT_FEE.REVEAL;

    beforeAll(async (done) => {
      try {
        await setup()
        LowAmountTez = await createAddress();
        const pkh = await LowAmountTez.signer.publicKeyHash()
        const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
        await transfer.confirmation();
        const op = await Tezos.contract.originate({
          balance: "1",
          code: managerCode,
          init: { "string": pkh },
        })
        contract = await op.contract();
        contract = await LowAmountTez.contract.at(contract.address)
        expect(op.status).toEqual('applied')
      }
      catch (ex) {
        fail(ex.message)
      } finally {
        done()
      }
    })

    test('Estimate transfer with allocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), amount: 1.9 });
      expect(estimate).toMatchObject({
        gasLimit: 10307,
        storageLimit: 0,
        suggestedFeeMutez: 1384
      });
      done();
    })

    test('Estimate transfer with unallocated destination', async (done) => {
      const estimate = await LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), amount: 1.7 });
      expect(estimate).toMatchObject({
        gasLimit: 10307,
        storageLimit: 257,
        suggestedFeeMutez: 1384
      });
      done();
    });

    test('Estimate simple origination', async (done) => {
      const estimate = await LowAmountTez.estimate.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      expect(estimate).toMatchObject(
        {
          gasLimit: 17932,
          storageLimit: 571,
          suggestedFeeMutez: 2439
        }
      )
      done();
    });

    test('Estimate setDelegate', async (done) => {
      const estimate = await LowAmountTez.estimate.setDelegate({
        delegate: knownBaker,
        source: await LowAmountTez.signer.publicKeyHash(),
      })
      expect(estimate).toMatchObject({
        gasLimit: 10100,
        storageLimit: 0,
        suggestedFeeMutez: 1359
      })
      done();
    })

    test('Estimate internal transfer to allocated implicit', async (done) => {
      const tx = contract.methods.do(MANAGER_LAMBDA.transferImplicit(knownBaker, 50)).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate).toMatchObject({
        gasLimit: 26260,
        storageLimit: 0,
        suggestedFeeMutez: 3052
      })
      done();
    })

    test('Estimate to multiple internal transfer to unallocated account', async (done) => {
      const tx = contract.methods.do(transferImplicit2(
        await (await createAddress()).signer.publicKeyHash(),
        await (await createAddress()).signer.publicKeyHash(),
        50)
      ).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate).toMatchObject({
        gasLimit: 36875,
        storageLimit: 514,
        suggestedFeeMutez: 4173
      })
      done();
    })

    test('Estimate internal origination', async (done) => {
      const tx = contract.methods.do(originate()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate).toMatchObject({
        gasLimit: 28286,
        storageLimit: 317,
        suggestedFeeMutez: 3261
      })
      done();
    })

    test('Estimate multiple internal origination', async (done) => {
      const tx = contract.methods.do(originate2()).toTransferParams();
      const estimate = await LowAmountTez.estimate.transfer(tx)
      expect(estimate).toMatchObject({
        gasLimit: 40928,
        storageLimit: 634,
        suggestedFeeMutez: 4590
      })
      // Do the actual operation
      const op2 = await contract.methods.do(originate2()).send();
      await op2.confirmation();
      done();
    })
  })

  describe('Estimate with very low balance', () => {
    let LowAmountTez: TezosToolkit;
    const amt = 2000 + DEFAULT_FEE.REVEAL;

    beforeAll(async (done) => {
      await setup()
      LowAmountTez = await createAddress();
      const pkh = await LowAmountTez.signer.publicKeyHash()
      const transfer = await Tezos.contract.transfer({ to: pkh, mutez: true, amount: amt });
      await transfer.confirmation();
      done()
    })

    it('Estimate transfer to regular address', async (done) => {
      let estimate = await LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) });
      expect(estimate).toMatchObject({
        gasLimit: 10307,
        storageLimit: 0,
        suggestedFeeMutez: 1382
      });
      done();
    });

    it('Estimate transfer to regular address with a fixed fee', async (done) => {
      // fee, gasLimit and storage limit are not taken into account
      const params = { fee: 2000, to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) }
      let estimate = await LowAmountTez.estimate.transfer(params);
      expect(estimate).toMatchObject({
        gasLimit: 10307,
        storageLimit: 0,
        suggestedFeeMutez: 1382
      });

      await expect(LowAmountTez.contract.transfer(params)).rejects.toEqual(
        expect.objectContaining({
          // Not sure if it is expected according to (https://tezos.gitlab.io/api/errors.html)
          message: expect.stringContaining('storage_error'),
        }));
      done();
    });

    it('Estimate transfer to regular address with unsufficient balance', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await Tezos.signer.publicKeyHash(), mutez: true, amount: amt })
      ).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('balance_too_low'),
        }));
      done();
    });

    it('Estimate transfer to regular address with unsufficient balance to pay storage for allocation', async (done) => {
      await expect(
        LowAmountTez.estimate.transfer({ to: await (await createAddress()).signer.publicKeyHash(), mutez: true, amount: amt - (1382 + DEFAULT_FEE.REVEAL) })
      ).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('storage_exhausted'),
        }));
      done();
    });

    it('Estimate origination with unsufficient balance to pay storage', async (done) => {
      await expect(LowAmountTez.estimate.originate({
        balance: "0",
        code: ligoSample,
        storage: 0,
      })).rejects.toEqual(
        expect.objectContaining({
          message: expect.stringContaining('storage_exhausted'),
        }));
      done();
    })
  });
})
