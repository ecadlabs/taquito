import { PvmKind } from '@taquito/rpc';
import { CONFIGS } from '../../config';
import { smartRollupEchoKernel } from '../../data/smart-rollup-echo-kernel';

CONFIGS().forEach(({ lib: Tezos, rpc, setup }) => {
  describe(`Wallet smart rollups using ${rpc}`, () => {
    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 2_000_000 });
    });

    it('originates a rollup and returns its address', async () => {
      const operation = await Tezos.wallet
        .smartRollupOriginate({
          pvmKind: PvmKind.WASM2,
          kernel: smartRollupEchoKernel,
          parametersType: { prim: 'bytes' },
        })
        .send();
      await operation.confirmation();
      expect(await operation.status()).toBe('applied');
      expect(await operation.rollupAddress()).toMatch(/^sr1/);
    });

    it('posts an external message through the wallet', async () => {
      const operation = await Tezos.wallet
        .smartRollupAddMessages({ message: ['7461717569746f'] })
        .send();
      await operation.confirmation();
      expect(await operation.status()).toBe('applied');
      expect((await operation.smartRollupAddMessagesOperation())?.message).toEqual([
        '7461717569746f',
      ]);
    });

    it('posts messages in a wallet batch', async () => {
      const operation = await Tezos.wallet
        .batch()
        .withSmartRollupAddMessages({ message: ['00'] })
        .withSmartRollupAddMessages({ message: ['ff'] })
        .send();
      await operation.confirmation();
      expect(await operation.status()).toBe('applied');
    });
  });
});
