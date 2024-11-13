import { CONFIGS } from '../../config';
import { InvalidStakingAddressError, InvalidFinalizeUnstakeAmountError } from '@taquito/core';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test staking pseudo operations using: ${rpc}`, () => {
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
        const op = await Tezos.wallet.stake({ amount: 1, to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' }).send();
        await op.confirmation()
      }).rejects.toThrow(InvalidStakingAddressError);

      expect(async () => {
        const op = await Tezos.wallet.unstake({ amount: 1, to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' }).send();
        await op.confirmation()
      }).rejects.toThrow(InvalidStakingAddressError);
      expect(async () => {
        const op = await Tezos.wallet.finalizeUnstake({ to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' }).send();
        await op.confirmation()
      }).rejects.toThrow(InvalidStakingAddressError);
      expect(async () => {
        const op = await Tezos.wallet.finalizeUnstake({ amount: 1 }).send();
        await op.confirmation()
      }).rejects.toThrow(InvalidFinalizeUnstakeAmountError);
    });

    it(`should be able to stake successfully: ${rpc}`, async () => {
      const op = await Tezos.wallet.stake({ amount: 3 }).send()
      await op.confirmation();
      expect(await op.status()).toBe('applied');

      const stakedBalance = await Tezos.rpc.getStakedBalance(await Tezos.signer.publicKeyHash());
      // staked balance returned in mutez therefore dividing by 1000000 and rounding explanation here https://tezos-dev.slack.com/archives/C05RS0MEJ9H/p1714641691368019?thread_ts=1714604532.409029&cid=C05RS0MEJ9H
      expect(Math.round(stakedBalance.toNumber() / 1000000)).toBeGreaterThanOrEqual(3);
    });

    it(`should be able to unstake successfully: ${rpc}`, async () => {
      const op = await Tezos.wallet.unstake({ amount: 1 }).send()
      await op.confirmation();
      expect(await op.status()).toBe('applied');

      const UnstakedBalance = await Tezos.rpc.getUnstakedFrozenBalance(await Tezos.signer.publicKeyHash());
      // unstaked balance returned in mutez therefore dividing by 1000000 and rounding explanation here https://tezos-dev.slack.com/archives/C05RS0MEJ9H/p1714641691368019?thread_ts=1714604532.409029&cid=C05RS0MEJ9H
      expect(Math.round(UnstakedBalance.toNumber() / 1000000)).toBeGreaterThanOrEqual(1);
    });

    it(`should be able to finalizeUnstake successfully: ${rpc}`, async () => {
      const op = await Tezos.wallet.finalizeUnstake({}).send()
      await op.confirmation();
      expect(await op.status()).toBe('applied');
    });
  });
});