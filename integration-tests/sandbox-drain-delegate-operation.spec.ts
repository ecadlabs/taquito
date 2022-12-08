import { TezosToolkit } from "@taquito/taquito";
import { CONFIGS, sleep } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  const flextesaLimaNet = (rpc === 'http://localhost:20000') ? it : it.skip;

  describe(`Test Drain Delegate using: ${rpc}`, () => {
    let Delegate: TezosToolkit;
    let delegatePkh: string;
    let Destination: TezosToolkit;
    let destinationPkh: string;
    beforeAll(async (done) => {
      await setup(true);

      try {
        Delegate = await createAddress();
        delegatePkh = await Delegate.signer.publicKeyHash();;
        Destination = await createAddress();
        destinationPkh = await Destination.signer.publicKeyHash();

        // fund the delegate
        const transferOp = await Tezos.contract.transfer({ to: delegatePkh, amount: 5 });
        await transferOp.confirmation();

        // register as delegate
        const registerOp = await Delegate.contract.registerDelegate({});
        await registerOp.confirmation();

        // update consensus key to destination
        const updateOp = await Delegate.contract.updateConsensusKey({ pk: await Destination.signer.publicKey() });
        await updateOp.confirmation();

        // wait for more than preserved_cycles + 1 for consensus_key to be active
        const constants = await Delegate.rpc.getConstants();
        await sleep(((constants.preserved_cycles + 2) * constants.blocks_per_cycle * (constants.minimal_block_delay!.toNumber())) * 1000);

      } catch(e) {
        console.log(JSON.stringify(e));
      }
      done();
    })
    flextesaLimaNet('Should be able to inject drain_delegate operation', async (done) => {
      expect((await Delegate.rpc.getBalance(delegatePkh)).toNumber()).toBeGreaterThan(0);
      let destinationBalanceBefore = (await Destination.rpc.getBalance(destinationPkh)).toNumber();

      const drainOp = await Destination.contract.drainDelegate({
        consensus_key: destinationPkh,
        delegate: delegatePkh,
        destination: destinationPkh,
      });
      await drainOp.confirmation();

      expect(drainOp.includedInBlock).toBeDefined()
      expect((await Delegate.rpc.getBalance(delegatePkh)).toNumber()).toEqual(0);
      expect((await Destination.rpc.getBalance(destinationPkh)).toNumber()).toBeGreaterThan(destinationBalanceBefore);
      done();
    });
  });
})
