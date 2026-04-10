import { PollingSubscribeProvider } from "@taquito/taquito";
import { CONFIGS, TAQUITO_MUTEZ, TEST_FUNDS_RECOVERY_ADDRESS } from "../../config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test handling of missed blocks through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 })
    })
    test('Verify operation is found even if the poller skipped blocks', async () => {
      // To simulate the behavior where blocks are skipped, we use a polling interval higher than the time between blocks
      // Before fixing issue #1783, if a block was skipped, the `WalletOperation` class was throwing an error `MissedBlockDuringConfirmationError`
      // After fixing issue #1783, if blocks are skipped, they will be retrieved and inspected by the WalletOperation class
      Tezos.setStreamProvider(Tezos.getFactory(PollingSubscribeProvider)({ pollingIntervalMilliseconds: 60000 }));
      const op = await Tezos.wallet.transfer({ to: TEST_FUNDS_RECOVERY_ADDRESS, amount: TAQUITO_MUTEZ, mutez: true }).send();
      await op.confirmation();
      expect(op.opHash).toBeDefined();
      expect(await op.status()).toBe('applied');

    })
  });
})
