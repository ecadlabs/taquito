import { ContractAbstraction, ContractProvider, RpcReadAdapter } from '@taquito/taquito';
import { CONFIGS } from '../../config';
import { InMemorySpendingKey, SaplingToolkit } from '@taquito/sapling';
import BigNumber from 'bignumber.js';
import { singleSaplingStateContractJProtocol } from '../../data/single_sapling_state_contract_jakarta_michelson';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  let saplingContract: ContractAbstraction<ContractProvider>;
  let bobInmemorySpendingKey: InMemorySpendingKey;
  let bobPaymentAddress: string;
  let aliceInMemorySpendingKey: InMemorySpendingKey;
  let alicePaymentAddress: string;
  const memoSize = 8;

  describe(`Test interaction with sapling contract having a single sapling state using: ${rpc}`, () => {
    beforeAll(async () => {
      await setup();

      // Deploy the sapling contract
      const saplingContractOrigination = await Tezos.contract.originate({
        code: singleSaplingStateContractJProtocol(),
        init: '{}',
      });
      await saplingContractOrigination.confirmation();
      saplingContract = await saplingContractOrigination.contract();

      // Generate a spending key and an InMemorySpendingKey instance for Bob using a mnemonic
      const mnemonic: string = bip39.generateMnemonic(wordlist);
      bobInmemorySpendingKey = await InMemorySpendingKey.fromMnemonic(mnemonic);

      // Instantiate an InMemorySpendingKey from a spending key for Alice
      aliceInMemorySpendingKey = new InMemorySpendingKey(
        'sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L'
      );
    });

    it('Verify that the initial balance for Alice and Bob are 0 in the sapling contract', async () => {
      const bobSaplingToolkit = new SaplingToolkit(
        { saplingSigner: bobInmemorySpendingKey },
        { contractAddress: saplingContract.address, memoSize },
        new RpcReadAdapter(Tezos.rpc)
      );
      const bobTxViewer = await bobSaplingToolkit.getSaplingTransactionViewer();
      const bobInitialBalance = await bobTxViewer.getBalance();

      expect(bobInitialBalance).toEqual(new BigNumber(0));

      const aliceSaplingToolkit = new SaplingToolkit(
        { saplingSigner: aliceInMemorySpendingKey },
        { contractAddress: saplingContract.address, memoSize },
        new RpcReadAdapter(Tezos.rpc)
      );
      const aliceTxViewer = await aliceSaplingToolkit.getSaplingTransactionViewer();
      const aliceInitialBalance = await aliceTxViewer.getBalance();

      expect(aliceInitialBalance).toEqual(new BigNumber(0));
    });

    it('Verify that Alice can shield tokens', async () => {
      const amountToAlice = 3;
      const aliceSaplingToolkit = new SaplingToolkit(
        { saplingSigner: aliceInMemorySpendingKey },
        { contractAddress: saplingContract.address, memoSize },
        new RpcReadAdapter(Tezos.rpc)
      );
      const aliceInMemoryViewingKey = await aliceInMemorySpendingKey.getSaplingViewingKeyProvider();
      // Fetch a payment address (zet) for Alice
      alicePaymentAddress = (await aliceInMemoryViewingKey.getAddress()).address;

      const shieldedTx = await aliceSaplingToolkit.prepareShieldedTransaction([
        {
          to: alicePaymentAddress,
          amount: amountToAlice,
          memo: 'First Tx',
        },
      ]);

      // Inject the sapling transaction using the ContractAbstraction by calling the default entrypoint
      // The amount MUST be specified in the send method in order to transfer the 3 tez to the shielded pool
      const op = await saplingContract.methods
        .default([shieldedTx])
        .send({ amount: amountToAlice });
      await op.confirmation();

      expect(op.status).toEqual('applied');
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    });

    it("Verify that Alice's balance in the sapling pool updated after the shielded tx", async () => {
      const aliceSaplingToolkit = new SaplingToolkit(
        { saplingSigner: aliceInMemorySpendingKey },
        { contractAddress: saplingContract.address, memoSize },
        new RpcReadAdapter(Tezos.rpc)
      );
      const aliceTxViewer = await aliceSaplingToolkit.getSaplingTransactionViewer();
      const aliceBalance = await aliceTxViewer.getBalance();

      // The returned balance is in MUTEZ
      expect(aliceBalance).toEqual(new BigNumber(3000000));

      const inputsAlice = await aliceTxViewer.getIncomingAndOutgoingTransactions();
      expect(inputsAlice).toEqual({
        incoming: [
          {
            value: new BigNumber(3000000),
            memo: 'First Tx',
            paymentAddress: alicePaymentAddress,
            isSpent: false,
          },
        ],
        outgoing: [],
      });
    });

    it('Verify that Alice can do a shielded transaction to Bob', async () => {
      const amountToBob = 2;
      // Bob needs to give a payment address (zet) to Alice
      const bobInMemoryViewingKey = await bobInmemorySpendingKey.getSaplingViewingKeyProvider();
      bobPaymentAddress = (await bobInMemoryViewingKey.getAddress()).address;

      const aliceSaplingToolkit = new SaplingToolkit(
        { saplingSigner: aliceInMemorySpendingKey },
        { contractAddress: saplingContract.address, memoSize },
        new RpcReadAdapter(Tezos.rpc)
      );
      const tx = await aliceSaplingToolkit.prepareSaplingTransaction([
        {
          to: bobPaymentAddress,
          amount: amountToBob,
          memo: 'A gift',
        },
      ]);

      // Inject the sapling transaction using the ContractAbstraction by calling the default entrypoint
      const op = await saplingContract.methods.default([tx]).send();
      await op.confirmation();

      expect(op.status).toEqual('applied');
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
    });

    it("Verify that Alice's balance in the sapling pool updated after the sapling tx", async () => {
      const aliceSaplingToolkit = new SaplingToolkit(
        { saplingSigner: aliceInMemorySpendingKey },
        { contractAddress: saplingContract.address, memoSize },
        new RpcReadAdapter(Tezos.rpc)
      );
      const aliceTxViewer = await aliceSaplingToolkit.getSaplingTransactionViewer();
      const aliceBalance = await aliceTxViewer.getBalance();

      // The returned balance is in MUTEZ
      expect(aliceBalance).toEqual(new BigNumber(1000000));

      const inputsAlice = await aliceTxViewer.getIncomingAndOutgoingTransactions();
      expect(inputsAlice).toEqual({
        incoming: [
          {
            value: new BigNumber(3000000),
            memo: 'First Tx',
            paymentAddress: alicePaymentAddress,
            isSpent: true,
          },
          {
            // This input is a payback for when Alice sent 2 tz to bob (3tz - 2tz = 1tz).
            // Alice consumed the 3tz input and received 1tz back.
            value: new BigNumber(1000000),
            memo: '',
            paymentAddress: alicePaymentAddress,
            isSpent: false,
          },
        ],
        outgoing: [
          {
            value: new BigNumber(2000000),
            memo: 'A gift',
            paymentAddress: bobPaymentAddress,
          },
          {
            // Here Alice sent 1tz back to her (matching the payback input above).
            value: new BigNumber(1000000),
            memo: '',
            paymentAddress: alicePaymentAddress,
          },
        ],
      });

      const bobSaplingToolkit = new SaplingToolkit(
        { saplingSigner: bobInmemorySpendingKey },
        { contractAddress: saplingContract.address, memoSize },
        new RpcReadAdapter(Tezos.rpc)
      );
      const bobTxViewer = await bobSaplingToolkit.getSaplingTransactionViewer();
      const bobBalance = await bobTxViewer.getBalance();

      // The returned balance is in MUTEZ
      expect(bobBalance).toEqual(new BigNumber(2000000));

      const inputsBob = await bobTxViewer.getIncomingAndOutgoingTransactions();
      expect(inputsBob).toEqual({
        incoming: [
          {
            value: new BigNumber(2000000),
            memo: 'A gift',
            paymentAddress: bobPaymentAddress,
            isSpent: false,
          },
        ],
        outgoing: [],
      });
    });

    it('Verify that Alice can unshield tokens', async () => {
      const newAddress = await createAddress();
      const opToFundNewAddress = await Tezos.contract.transfer({
        to: await newAddress.signer.publicKeyHash(),
        amount: 2,
      });
      await opToFundNewAddress.confirmation();
      const tezosAddress1 = await newAddress.signer.publicKeyHash();

      const amount = 1;
      const aliceSaplingToolkit = new SaplingToolkit(
        { saplingSigner: aliceInMemorySpendingKey },
        { contractAddress: saplingContract.address, memoSize },
        new RpcReadAdapter(Tezos.rpc)
      );
      const tezosInitialBalance = await Tezos.tz.getBalance(tezosAddress1);
      const unshieldedTx = await aliceSaplingToolkit.prepareUnshieldedTransaction({
        to: tezosAddress1,
        amount,
      });

      // Inject the sapling transaction using the ContractAbstraction by calling the default entrypoint
      const op = await saplingContract.methods.default([unshieldedTx]).send();
      await op.confirmation(2);

      expect(op.status).toEqual('applied');
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

      const tezosUpdatedBalance = await Tezos.tz.getBalance(tezosAddress1);
      expect(tezosUpdatedBalance).toEqual(tezosInitialBalance.plus(new BigNumber(1000000)));
    });

    it("Verify that Alice's balance in the sapling pool is updated after the unshielded tx", async () => {
      const aliceSaplingToolkit = new SaplingToolkit(
        { saplingSigner: aliceInMemorySpendingKey },
        { contractAddress: saplingContract.address, memoSize },
        new RpcReadAdapter(Tezos.rpc)
      );
      const aliceTxViewer = await aliceSaplingToolkit.getSaplingTransactionViewer();
      const aliceBalance = await aliceTxViewer.getBalance();

      expect(aliceBalance).toEqual(new BigNumber(0));

      const inputsAlice = await aliceTxViewer.getIncomingAndOutgoingTransactions();
      expect(inputsAlice).toEqual({
        incoming: [
          {
            value: new BigNumber(3000000),
            memo: 'First Tx',
            paymentAddress: alicePaymentAddress,
            isSpent: true,
          },
          {
            value: new BigNumber(1000000),
            memo: '',
            paymentAddress: alicePaymentAddress,
            isSpent: true,
          },
          {
            value: new BigNumber(0),
            memo: '',
            paymentAddress: alicePaymentAddress,
            isSpent: false,
          },
        ],
        outgoing: [
          {
            value: new BigNumber(2000000),
            memo: 'A gift',
            paymentAddress: bobPaymentAddress,
          },
          {
            value: new BigNumber(1000000),
            memo: '',
            paymentAddress: alicePaymentAddress,
          },
          {
            value: new BigNumber(0),
            memo: '',
            paymentAddress: alicePaymentAddress,
          },
        ],
      });
    });
  });
});
