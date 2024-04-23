import { CONFIGS } from "../../../config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  let myPkh: string;

  describe(`Staking pseudo operations: ${rpc}`, () => {

    beforeAll(async () => {
      await setup(true);

      myPkh = await Tezos.signer.publicKeyHash();
      console.log(myPkh);

      const delegateOp = await Tezos.contract.setDelegate({
        delegate: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA',
        source: myPkh,
      });

      await delegateOp.confirmation();
    });

    it('should be able to inject the stake pseudo operation to a designated delegate', async () => {
      const op = await Tezos.contract.stake({
        to: myPkh,
        amount: 0.1
      });
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });

    it('should be able to unstake funds from a designated delegate', async () => {
      const op = await Tezos.contract.unstake({
        to: myPkh,
        amount: 0.1
      });
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });

    it('should be able to finalize_unstake funds from a designated delegate', async () => {
      const op = await Tezos.contract.finalizeUnstake({
        to: myPkh,
        amount: 0
      });
      await op.confirmation();

      expect(op.hash).toBeDefined();
      expect(op.status).toEqual('applied');
    });
  });
});
