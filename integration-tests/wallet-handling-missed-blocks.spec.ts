import { PollingSubscribeProvider } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test handling of missed blocks through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    test('Verify operation is found even if the poller skipped blocks', async () => {
      // To simulate the behavior where blocks are skipped, we use a polling interval higher than the time between blocks
      // Before fixing issue #1783, if a block was skipped, the `WalletOperation` class was throwing an error `MissedBlockDuringConfirmationError`
      // After fixing issue #1783, if blocks are skipped, they will be retrieved and inspected by the WalletOperation class
      Tezos.setStreamProvider(Tezos.getFactory(PollingSubscribeProvider)({ pollingIntervalMilliseconds: 60000 }));
      const op = await Tezos.wallet.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 }).send();
      await op.confirmation();
      expect(op.opHash).toBeDefined();
      expect(await op.status()).toBe('applied');

    })
  });
})
