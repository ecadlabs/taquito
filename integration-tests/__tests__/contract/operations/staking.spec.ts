import { CONFIGS } from "../../../config";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;
  describe(`Staking pseudo operations: ${rpc}`, () => {

    beforeAll(async () => {
      await setup(true);
      // There is no baker accept staking in qenanet and weeklylnet hence tests will fail
      // Currently TF is a baker that allows staking on parisnet.
      if (rpc.includes('paris')) {
        knownBaker = 'tz3Q67aMz7gSMiQRcW729sXSfuMtkyAHYfqc' // TF
      }
      const delegateOp = await Tezos.contract.setDelegate({
        delegate: knownBaker,
        source: await Tezos.signer.publicKeyHash()
      });
      await delegateOp.confirmation();
    });

    it('should throw an error when the destination specified is not the same as source', async () => {
      expect(async () => {
        const op = await Tezos.contract.stake({
          amount: 0.1,
          to: knownBaker
        });
      }).rejects.toThrow();
    });

    it('should be able to stake funds to a designated delegate', async () => {
      const op = await Tezos.contract.stake({
        amount: 0.1
      });
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });

    it('should be able to unstake funds from a designated delegate', async () => {
      const op = await Tezos.contract.unstake({
        amount: 0.1
      });
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });

    it('should be able to finalize_unstake funds from a designated delegate', async () => {
      const op = await Tezos.contract.finalizeUnstake({});
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });
  });
});
