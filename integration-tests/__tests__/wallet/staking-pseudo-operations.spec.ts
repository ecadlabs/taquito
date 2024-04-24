import { CONFIGS } from '../../config';
import { Protocols } from '@taquito/taquito';
import { ProtoGreaterOrEqual } from '@taquito/michel-codec';
import { InvalidStakingAddressError, InvalidFinalizeUnstakeAmountError } from '@taquito/core';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const parisAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtParisBQ) ? test : test.skip;
  describe(`Test staking pseudo operations using: ${rpc}`, () => {
    beforeAll(async () => {
      await setup(true);
      try {
        const delegateOp = await Tezos.contract.setDelegate({
          delegate: 'tz1PZY3tEWmXGasYeehXYqwXuw2Z3iZ6QDnA',  // can use knownBaker in future
          source: await Tezos.signer.publicKeyHash()
        });
        await delegateOp.confirmation();
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    });

    parisAndAlpha(`should be able to stake successfully: ${rpc}`, async () => {
      const op = await Tezos.wallet.stake({ amount: 3000000, mutez: true }).send()
      await op.confirmation();
      expect(op.status).toBeTruthy();

      const stakedBalance = await Tezos.rpc.getStakedBalance(await Tezos.signer.publicKeyHash());
      expect(stakedBalance.toNumber()).toEqual(3000000);
    });

    parisAndAlpha(`should be able to unstake successfully: ${rpc}`, async () => {
      const op = await Tezos.wallet.unstake({ amount: 1 }).send()
      await op.confirmation();
      expect(op.status).toBeTruthy();

      const UnstakedBalance = await Tezos.rpc.getUnstakedFrozenBalance(await Tezos.signer.publicKeyHash());
      expect(UnstakedBalance.toNumber()).toEqual(1000000); // 1000000 mutez = 1 tez
    });

    parisAndAlpha(`should be able to finalizeUnstake successfully: ${rpc}`, async () => {
      const op = await Tezos.wallet.finalizeUnstake({ }).send()
      await op.confirmation();
      expect(op.status).toBeTruthy();
    });

    parisAndAlpha('should throw error when param is against pseudo operation', async () => {
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
