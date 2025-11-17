import { ContractAbstraction, ContractProvider, RpcReadAdapter } from '@taquito/taquito';
import { CONFIGS } from '../../config';
import { InMemorySpendingKey, InMemoryViewingKey, SaplingToolkit, SaplingTransactionViewer } from '@taquito/sapling';
import BigNumber from 'bignumber.js';
import { singleSaplingStateContractJProtocol } from '../../data/single_sapling_state_contract_jakarta_michelson';
import * as bip39 from 'bip39';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  let saplingContract: ContractAbstraction<ContractProvider>;

  let inMemorySpendingKey1: InMemorySpendingKey;
  let inMemoryViewingKey1: InMemoryViewingKey;
  let txViewer1: SaplingTransactionViewer;
  let saplingToolkit1: SaplingToolkit;
  let paymentAddress1Index0: string;

  let inMemorySpendingKey2: InMemorySpendingKey;
  let inMemoryViewingKey2: InMemoryViewingKey;
  let txViewer2: SaplingTransactionViewer;
  let saplingToolkit2: SaplingToolkit;
  let paymentAddress2Index0: string;
  let paymentAddress2Index5: string;
  let paymentAddress2Index8: string;

  let inMemorySpendingKey3: InMemorySpendingKey;
  let inMemoryViewingKey3: InMemoryViewingKey;
  let txViewer3: SaplingTransactionViewer;
  let saplingToolkit3: SaplingToolkit;
  let paymentAddress3Index0: string;
  let paymentAddress3Index5: string;
  let paymentAddress3Index8: string;

  const memoSize = 4;

  describe(`Sapling transactions: ${rpc}`, () => {

    beforeAll(async () => {
      await setup();

      const saplingContractOrigination = await Tezos.contract.originate({
        code: singleSaplingStateContractJProtocol(4),
        init: '{}'
      });
      await saplingContractOrigination.confirmation();
      saplingContract = await saplingContractOrigination.contract();

      const mnemonic1: string = bip39.generateMnemonic();
      inMemorySpendingKey1 = await InMemorySpendingKey.fromMnemonic(mnemonic1);
      inMemoryViewingKey1 = await inMemorySpendingKey1.getSaplingViewingKeyProvider();
      saplingToolkit1 = new SaplingToolkit({ saplingSigner: inMemorySpendingKey1 }, { contractAddress: saplingContract.address, memoSize }, new RpcReadAdapter(Tezos.rpc));
      txViewer1 = await saplingToolkit1.getSaplingTransactionViewer();
      paymentAddress1Index0 = (await inMemoryViewingKey1.getAddress(0)).address;

      const mnemonic2: string = bip39.generateMnemonic();
      inMemorySpendingKey2 = await InMemorySpendingKey.fromMnemonic(mnemonic2);
      inMemoryViewingKey2 = await inMemorySpendingKey2.getSaplingViewingKeyProvider();
      saplingToolkit2 = new SaplingToolkit({ saplingSigner: inMemorySpendingKey2 }, { contractAddress: saplingContract.address, memoSize }, new RpcReadAdapter(Tezos.rpc));
      txViewer2 = await saplingToolkit2.getSaplingTransactionViewer();
      paymentAddress2Index0 = (await inMemoryViewingKey2.getAddress(0)).address;
      paymentAddress2Index5 = (await inMemoryViewingKey2.getAddress(5)).address;
      paymentAddress2Index8 = (await inMemoryViewingKey2.getAddress(8)).address;

      inMemorySpendingKey3 = new InMemorySpendingKey('sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L')
      inMemoryViewingKey3 = await inMemorySpendingKey3.getSaplingViewingKeyProvider();
      saplingToolkit3 = new SaplingToolkit({ saplingSigner: inMemorySpendingKey3 }, { contractAddress: saplingContract.address, memoSize }, new RpcReadAdapter(Tezos.rpc));
      txViewer3 = await saplingToolkit3.getSaplingTransactionViewer();
      paymentAddress3Index0 = (await inMemoryViewingKey3.getAddress(0)).address;
      paymentAddress3Index5 = (await inMemoryViewingKey3.getAddress(5)).address;
      paymentAddress3Index8 = (await inMemoryViewingKey3.getAddress(8)).address;

    });

    it('Prepare and inject 3 batched shielded transactions', async () => {

      const shieldedTx = await saplingToolkit1.prepareShieldedTransaction([{
        to: paymentAddress1Index0,
        amount: 1,
        memo: 'T1'
      },
      {
        to: paymentAddress2Index0,
        amount: 2,
        memo: 'T2'
      },
      {
        to: paymentAddress3Index0,
        amount: 3,
        memo: 'T3'
      }
      ])

      const op = await saplingContract.methodsObject.default([shieldedTx]).send({ amount: 6 });
      await op.confirmation();
      expect(op.status).toEqual('applied');
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

    });

    it('Verify balances after the shielded tx', async () => {
      const balance1 = await txViewer1.getBalance();
      const inputs1 = await txViewer1.getIncomingAndOutgoingTransactions();

      expect(balance1).toEqual(new BigNumber(1000000));
      expect(inputs1).toEqual({
        incoming: [
          {
            value: new BigNumber(1000000),
            memo: 'T1',
            paymentAddress: paymentAddress1Index0,
            isSpent: false
          }
        ],
        outgoing: []
      })

      const balance2 = await txViewer2.getBalance();
      const inputs2 = await txViewer2.getIncomingAndOutgoingTransactions();

      expect(balance2).toEqual(new BigNumber(2000000));
      expect(inputs2).toEqual({
        incoming: [
          {
            value: new BigNumber(2000000),
            memo: 'T2',
            paymentAddress: paymentAddress2Index0,
            isSpent: false
          }
        ],
        outgoing: []
      })

      const balance3 = await txViewer3.getBalance();
      const inputs3 = await txViewer3.getIncomingAndOutgoingTransactions();

      expect(balance3).toEqual(new BigNumber(3000000));
      expect(inputs3).toEqual({
        incoming: [
          {
            value: new BigNumber(3000000),
            memo: 'T3',
            paymentAddress: paymentAddress3Index0,
            isSpent: false
          }
        ],
        outgoing: []
      })
    });

    it('Prepare and inject batched sapling transactions', async () => {

      const tx = await saplingToolkit1.prepareSaplingTransaction([{
        to: paymentAddress2Index0,
        amount: 10,
        memo: 'tx1',
        mutez: true
      },
      {
        to: paymentAddress2Index5,
        amount: 20,
        memo: 'tx2',
        mutez: true
      },
      {
        to: paymentAddress2Index8,
        amount: 30,
        memo: 'tx3',
        mutez: true
      },
      {
        to: paymentAddress3Index0,
        amount: 40,
        memo: 'tx4',
        mutez: true
      },
      {
        to: paymentAddress3Index5,
        amount: 50,
        memo: 'tx5',
        mutez: true
      },
      {
        to: paymentAddress3Index8,
        amount: 60,
        memo: 'tx6',
        mutez: true
      }
      ])

      const op = await saplingContract.methodsObject.default([tx]).send();
      await op.confirmation();
      expect(op.status).toEqual('applied');
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

    });

    it('Verify balances after the sapling transactions', async () => {
      const balance1 = await txViewer1.getBalance();
      const inputs1 = await txViewer1.getIncomingAndOutgoingTransactions();

      expect(balance1).toEqual(new BigNumber(999790));
      expect(inputs1).toEqual({
        "incoming": [
          {
            "value": new BigNumber("1000000"),
            "memo": "T1",
            "paymentAddress": paymentAddress1Index0,
            "isSpent": true
          },
          {
            "value": new BigNumber("999790"),
            "memo": "",
            "paymentAddress": paymentAddress1Index0,
            "isSpent": false
          }
        ],
        "outgoing": [
          {
            "value": new BigNumber("10"),
            "memo": "tx1",
            "paymentAddress": paymentAddress2Index0
          },
          {
            "value": new BigNumber("20"),
            "memo": "tx2",
            "paymentAddress": paymentAddress2Index5
          },
          {
            "value": new BigNumber("30"),
            "memo": "tx3",
            "paymentAddress": paymentAddress2Index8
          },
          {
            "value": new BigNumber("40"),
            "memo": "tx4",
            "paymentAddress": paymentAddress3Index0
          },
          {
            "value": new BigNumber("50"),
            "memo": "tx5",
            "paymentAddress": paymentAddress3Index5
          },
          {
            "value": new BigNumber("60"),
            "memo": "tx6",
            "paymentAddress": paymentAddress3Index8
          },
          {
            "value": new BigNumber("999790"),
            "memo": "",
            "paymentAddress": paymentAddress1Index0
          }
        ]
      })

      const balance2 = await txViewer2.getBalance();
      const inputs2 = await txViewer2.getIncomingAndOutgoingTransactions();

      expect(balance2).toEqual(new BigNumber(2000060));
      expect(inputs2).toEqual({
        "incoming": [
          {
            "value": new BigNumber("2000000"),
            "memo": "T2",
            "paymentAddress": paymentAddress2Index0,
            "isSpent": false
          },
          {
            "value": new BigNumber("10"),
            "memo": "tx1",
            "paymentAddress": paymentAddress2Index0,
            "isSpent": false
          },
          {
            "value": new BigNumber("20"),
            "memo": "tx2",
            "paymentAddress": paymentAddress2Index5,
            "isSpent": false
          },
          {
            "value": new BigNumber("30"),
            "memo": "tx3",
            "paymentAddress": paymentAddress2Index8,
            "isSpent": false
          }
        ],
        "outgoing": []
      })

      const balance3 = await txViewer3.getBalance();
      const inputs3 = await txViewer3.getIncomingAndOutgoingTransactions();

      expect(balance3).toEqual(new BigNumber(3000150));
      expect(inputs3).toEqual({
        "incoming": [
          {
            "value": new BigNumber("3000000"),
            "memo": "T3",
            "paymentAddress": paymentAddress3Index0,
            "isSpent": false
          },
          {
            "value": new BigNumber("40"),
            "memo": "tx4",
            "paymentAddress": paymentAddress3Index0,
            "isSpent": false
          },
          {
            "value": new BigNumber("50"),
            "memo": "tx5",
            "paymentAddress": paymentAddress3Index5,
            "isSpent": false
          },
          {
            "value": new BigNumber("60"),
            "memo": "tx6",
            "paymentAddress": paymentAddress3Index8,
            "isSpent": false
          }
        ],
        "outgoing": []
      })
    });

  });
});
