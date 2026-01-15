import { ContractAbstraction, ContractProvider, RpcReadAdapter, SaplingStateAbstraction } from '@taquito/taquito';
import { CONFIGS } from '../../config';
import { InMemorySpendingKey, SaplingToolkit } from '@taquito/sapling';
import BigNumber from 'bignumber.js';
import { saplingContractDoubleJProto } from '../../data/sapling_test_contracts';
import { SaplingStateValue } from '@taquito/michelson-encoder';


CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  let saplingContract: ContractAbstraction<ContractProvider>;
  let saplingStateIdLeft: string;
  let saplingStateIdRight: string;
  let aliceInmemorySpendingKey: InMemorySpendingKey;
  let alicePaymentAddress: string;
  const memoSize = 8;

  describe(`Test interaction with sapling contract having multiple sapling states using: ${rpc}`, () => {

    beforeAll(async () => {
      await setup();

      // Deploy the sapling contract
      // This is an artificial contract used to test handling two states
      // There are 2 sapling states in the contract (named "left" and "right")
      const saplingContractOrigination = await Tezos.contract.originate({
        code: saplingContractDoubleJProto,
        storage: {
          left: SaplingStateValue,
          right: SaplingStateValue
        }
      });
      await saplingContractOrigination.confirmation();
      saplingContract = await saplingContractOrigination.contract();

      // Instantiate an InMemorySpendingKey from a spending key for Alice
      aliceInmemorySpendingKey = new InMemorySpendingKey('sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L')

    });

    it('Verify that Alice can shield tokens to the pool named "left"', async () => {
      // We retrieve the id of the sapling states as follows:
      const storage: { left: SaplingStateAbstraction, right: SaplingStateAbstraction } = await saplingContract.storage();
      saplingStateIdLeft = storage.left.getId();
      saplingStateIdRight = storage.right.getId();

      // When a contract has multiple sapling states, the `saplingId` parameter in the constructor of the `SaplingToolkit` must be defined
      // The `saplingId` parameter indicates which sapling pool we want to interact with
      const aliceSaplingToolkitLeft = new SaplingToolkit({ saplingSigner: aliceInmemorySpendingKey }, { contractAddress: saplingContract.address, memoSize, saplingId: saplingStateIdLeft }, new RpcReadAdapter(Tezos.rpc));
      const aliceSaplingToolkitRight = new SaplingToolkit({ saplingSigner: aliceInmemorySpendingKey }, { contractAddress: saplingContract.address, memoSize, saplingId: saplingStateIdRight }, new RpcReadAdapter(Tezos.rpc));
      const aliceInMemoryViewingKey = await aliceInmemorySpendingKey.getSaplingViewingKeyProvider();

      // Fetch a payment address (zet) for Alice
      alicePaymentAddress = (await aliceInMemoryViewingKey.getAddress()).address;

      // Prepare a shielded transaction for the "left" pool
      const shieldedTxLeft = await aliceSaplingToolkitLeft.prepareShieldedTransaction([{
        to: alicePaymentAddress,
        amount: 3,
        memo: 'Left'
      }])

      // Prepare a shielded transaction for the "right" pool
      const shieldedTxRight = await aliceSaplingToolkitRight.prepareShieldedTransaction([{
        to: alicePaymentAddress,
        amount: 3,
        memo: 'Right'
      }])

      // Inject the sapling transaction using the ContractAbstraction by calling the default entrypoint
      // The amount MUST be specified in the send method in order to transfer the 6 tez to the shielded set
      // In this contract, if the bool param is set to true, the "left" state is updated, if the bool is set to false, the "right" state is updated
      const op = await saplingContract.methodsObject.default({
        0: true,
        left: shieldedTxLeft,
        right: shieldedTxRight
      }).send({ amount: 3 * 2 });

      await op.confirmation();

      expect(op.status).toEqual('applied');
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

    });

    it("Verify that Alice's balance in the 'left' pool updated after the shielded tx", async () => {
      const aliceSaplingToolkitLeft = new SaplingToolkit({ saplingSigner: aliceInmemorySpendingKey }, { contractAddress: saplingContract.address, memoSize, saplingId: saplingStateIdLeft }, new RpcReadAdapter(Tezos.rpc));
      const aliceSaplingToolkitRight = new SaplingToolkit({ saplingSigner: aliceInmemorySpendingKey }, { contractAddress: saplingContract.address, memoSize, saplingId: saplingStateIdRight }, new RpcReadAdapter(Tezos.rpc));

      const aliceTxViewerLeft = await aliceSaplingToolkitLeft.getSaplingTransactionViewer();
      const aliceBalanceLeft = await aliceTxViewerLeft.getBalance();
      const inputsAliceLeft = await aliceTxViewerLeft.getIncomingAndOutgoingTransactions();

      const aliceTxViewerRight = await aliceSaplingToolkitRight.getSaplingTransactionViewer();
      const aliceBalanceRight = await aliceTxViewerRight.getBalance();
      const inputsAliceRight = await aliceTxViewerRight.getIncomingAndOutgoingTransactions();

      // The returned balance is in MUTEZ
      expect(aliceBalanceLeft).toEqual(new BigNumber(3000000));
      expect(inputsAliceLeft).toEqual({
        incoming: [
          {
            value: new BigNumber(3000000),
            memo: 'Left',
            paymentAddress: alicePaymentAddress,
            isSpent: false
          }
        ],
        outgoing: []
      })

      // Because we called the contract with the bool parameter set to "true", only the "left" pool is updated
      // Alice balance in the right pool is 0
      expect(aliceBalanceRight).toEqual(new BigNumber(0));
      expect(inputsAliceRight).toEqual({
        incoming: [],
        outgoing: []
      })
    });

  });
});