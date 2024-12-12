import { CONFIGS, sleep, isSandbox } from "../../config";
import { TezosToolkit } from "@taquito/taquito";
import { InMemorySigner } from '@taquito/signer';
import { OperationContentsAndResultDrainDelegate } from '@taquito/rpc';

CONFIGS().forEach(({ rpc, protocol, createAddress }) => {
  const tezboxnet = isSandbox({ rpc }) ? test : test.skip;
  const alice = new TezosToolkit(rpc);
  let alicePkh: string;
  let delegate: TezosToolkit;
  let delegatePkh: string;
  let destination: TezosToolkit;
  let destinationPkh: string;

  describe(`Test Drain Delegate in ${protocol.substring(0, 8)}`, () => {
    beforeAll(async () => {
      // tezbox provision Alice account with balance, ref https://github.com/tez-capital/tezbox/blob/main/configuration/accounts.hjson
      alice.setSignerProvider(new InMemorySigner('edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq'));
      alicePkh = await alice.signer.publicKeyHash();
      delegate = await createAddress();
      delegatePkh = await delegate.signer.publicKeyHash();;
      destination = await createAddress();
      destinationPkh = await destination.signer.publicKeyHash();
      // fund the delegate
      const transferOp = await alice.contract.transfer({ to: delegatePkh, amount: 5 });
      await transferOp.confirmation();
      // register as delegate
      const registerOp = await delegate.contract.registerDelegate({});
      await registerOp.confirmation();
      // update consensus key to destination
      const updateOp = await delegate.contract.updateConsensusKey({ pk: await destination.signer.publicKey() });
      await updateOp.confirmation();
    })

    tezboxnet('Should be able to prepare drainDelegate operations accepted by preapply endpoint', async () => {
      // wait for more than preserved_cycles + 1 for consensus_key to be active to perform drainDelegate operation
      const constants = await alice.rpc.getConstants();
      await sleep(((constants.consensus_rights_delay + 2) * (constants.blocks_per_cycle) * (constants.minimal_block_delay!.toNumber())) * 1000);

      const drainPrepared = await destination.prepare.drainDelegate({
        consensus_key: destinationPkh,
        delegate: delegatePkh,
        destination: destinationPkh,
      })
      const drainPreapplied = await destination.rpc.preapplyOperations(await destination.prepare.toPreapply(drainPrepared));

      expect(drainPreapplied).toBeInstanceOf(Array)
      expect(drainPreapplied[0].contents).toBeInstanceOf(Array)
      expect(drainPreapplied[0].contents[0].kind).toEqual('drain_delegate')
      expect((drainPreapplied[0].contents[0] as OperationContentsAndResultDrainDelegate).consensus_key).toEqual(destinationPkh)
      expect((drainPreapplied[0].contents[0] as OperationContentsAndResultDrainDelegate).delegate).toEqual(delegatePkh)
      expect((drainPreapplied[0].contents[0] as OperationContentsAndResultDrainDelegate).destination).toEqual(destinationPkh)
      expect((drainPreapplied[0].contents[0] as OperationContentsAndResultDrainDelegate).metadata).toBeDefined()
    });
    tezboxnet('Should be able to inject drain_delegate operation', async () => {
      //  get the delegate and destination balance before drainDelegate operation
      let delegateBeforeBalance = (await delegate.rpc.getBalance(delegatePkh)).toNumber()
      let destinationBeforeBalance = (await destination.rpc.getBalance(destinationPkh)).toNumber();

      const drainOp = await destination.contract.drainDelegate({
        consensus_key: destinationPkh,
        delegate: delegatePkh,
        destination: destinationPkh,
      });
      await drainOp.confirmation();

      // get the delegate and destination balance after drainDelegate operation
      let delegateAfterBalance = (await destination.rpc.getBalance(delegatePkh)).toNumber()
      let destinationAfterBalance = (await destination.rpc.getBalance(destinationPkh)).toNumber()

      expect(drainOp.includedInBlock).toBeDefined()
      expect(drainOp.status).toBeDefined()
      expect(drainOp.hash).toBeDefined()
      expect(drainOp.operationResults).toBeDefined()
      expect(drainOp.consensusKey).toEqual(destinationPkh)
      expect(drainOp.delegate).toEqual(delegatePkh)
      expect(drainOp.destination).toEqual(destinationPkh)

      expect(delegateBeforeBalance).toBeGreaterThan(0);
      expect(delegateAfterBalance).toBe(0);
      expect(destinationBeforeBalance).toBe(0);
      expect(destinationAfterBalance).toBeGreaterThan(0);
    });
  });
})
