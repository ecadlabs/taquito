import { CONFIGS } from "../../../config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Staking pseudo operations: ${rpc}`, () => {

    beforeAll(async () => {
      await setup(true);

      const delegateOp = await Tezos.contract.setDelegate({
        delegate: 'tz1TGKSrZrBpND3PELJ43nVdyadoeiM1WMzb', // is a delegate receiving stake on qenanet, parisnet and ghostnet
        source: await Tezos.signer.publicKeyHash()
      });
      await delegateOp.confirmation();
    });

    it('should throw an error when the destination specified is not the same as source', async () => {
      expect(async () => {
        const op = await Tezos.contract.stake({
          amount: 0.1,
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
