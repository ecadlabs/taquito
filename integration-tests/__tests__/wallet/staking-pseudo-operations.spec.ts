import { CONFIGS } from '../../config';
import { InvalidStakingAddressError, InvalidFinalizeUnstakeAmountError } from '@taquito/core';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;
  describe(`Test staking pseudo operations using: ${rpc}`, () => {
    beforeAll(async () => {
      await setup(true);
      try {
        // There is no baker accept staking in betanet and weeklylnet hence tests will fail
        // Currently TF is a baker that allows staking on parisnet.
        if (rpc.includes('paris')) {
          knownBaker = 'tz3Q67aMz7gSMiQRcW729sXSfuMtkyAHYfqc' // TF
        }
        const delegateOp = await Tezos.contract.setDelegate({
          delegate: knownBaker,
          source: await Tezos.signer.publicKeyHash()
        });
        await delegateOp.confirmation();
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    });

    it(`should be able to stake successfully: ${rpc}`, async () => {
      const op = await Tezos.wallet.stake({ amount: 3 }).send()
      await op.confirmation();
      expect(await op.status()).toBe('applied');

      const stakedBalance = await Tezos.rpc.getStakedBalance(await Tezos.signer.publicKeyHash());
      // staked balance returned in mutez therefore dividing by 1000000 and rounding explanation here https://tezos-dev.slack.com/archives/C05RS0MEJ9H/p1714641691368019?thread_ts=1714604532.409029&cid=C05RS0MEJ9H
      expect(Math.round(stakedBalance.toNumber() / 1000000)).toEqual(3);
    });

    it(`should be able to unstake successfully: ${rpc}`, async () => {
      const op = await Tezos.wallet.unstake({ amount: 1 }).send()
      await op.confirmation();
      expect(await op.status()).toBe('applied');

      const UnstakedBalance = await Tezos.rpc.getUnstakedFrozenBalance(await Tezos.signer.publicKeyHash());
      // unstaked balance returned in mutez therefore dividing by 1000000 and rounding explanation here https://tezos-dev.slack.com/archives/C05RS0MEJ9H/p1714641691368019?thread_ts=1714604532.409029&cid=C05RS0MEJ9H
      expect(Math.round(UnstakedBalance.toNumber() / 1000000)).toEqual(1);
    });

    it(`should be able to finalizeUnstake successfully: ${rpc}`, async () => {
      const op = await Tezos.wallet.finalizeUnstake({}).send()
      await op.confirmation();
      expect(await op.status()).toBe('applied');
    });

    it('should throw error when param is against pseudo operation', async () => {
      expect(async () => {
        const op = await Tezos.wallet.stake({ amount: 1, to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' }).send();
      }).rejects.toThrow(InvalidStakingAddressError);
      expect(async () => {
        const op = await Tezos.wallet.unstake({ amount: 1, to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' }).send();
      }).rejects.toThrow(InvalidStakingAddressError);
      expect(async () => {
        const op = await Tezos.wallet.finalizeUnstake({ to: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA' }).send();
      }).rejects.toThrow(InvalidStakingAddressError);
      expect(async () => {
        const op = await Tezos.wallet.finalizeUnstake({ amount: 1 }).send();
      }).rejects.toThrow(InvalidFinalizeUnstakeAmountError);
    });
  });
});
