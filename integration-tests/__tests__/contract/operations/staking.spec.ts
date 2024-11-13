import { CONFIGS } from "../../../config";
import { InvalidStakingAddressError, InvalidFinalizeUnstakeAmountError } from '@taquito/core';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Staking pseudo operations: ${rpc}`, () => {
    beforeAll(async () => {
      await setup(true);
      try{
        const address = await Tezos.signer.publicKeyHash()
        if(await Tezos.rpc.getDelegate(address) !== address){
          const delegateOp = await Tezos.contract.setDelegate({
            delegate: 'tz1TGKSrZrBpND3PELJ43nVdyadoeiM1WMzb', // is a delegate receiving stake on parisnet and ghostnet
            source: address
          });
          await delegateOp.confirmation();
        };
      }catch(e){console.log}
    });

    it('should throw error when param is against pseudo operation', async () => {
      expect(async () => {
        const op = await Tezos.contract.stake({ amount: 1, to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' });
        await op.confirmation()
      }).rejects.toThrow(InvalidStakingAddressError);
      expect(async () => {
        const op = await Tezos.contract.unstake({ amount: 1, to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' });
        await op.confirmation()
      }).rejects.toThrow(InvalidStakingAddressError);
      expect(async () => {
        const op = await Tezos.contract.finalizeUnstake({ to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' });
        await op.confirmation()
      }).rejects.toThrow(InvalidStakingAddressError);
      expect(async () => {
        const op = await Tezos.contract.finalizeUnstake({ amount: 1 });
        await op.confirmation()
      }).rejects.toThrow(InvalidFinalizeUnstakeAmountError);
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
