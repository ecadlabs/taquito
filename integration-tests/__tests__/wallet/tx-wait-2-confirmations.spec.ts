import { CONFIGS } from "../../config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test transaction and wait for 2 confirmations through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify wallet.transfer for 2 XTZ to an address and wait for 2 confirmations', async () => {
      const op = await Tezos.wallet.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 }).send();
      await op.confirmation()
      const [first, second] = await Promise.all([op.confirmation(), op.confirmation(2)])
      expect(first).toBeDefined();
      expect(second).toBeDefined();
      expect(second!.currentConfirmation - first!.currentConfirmation).toEqual(1)
      // Retrying another time should be instant
      const [first2, second2] = await Promise.all([op.confirmation(), op.confirmation(2)])
      expect(first2).toBeDefined();
      expect(second2).toBeDefined();
      expect(second2!.expectedConfirmation! - first2!.expectedConfirmation!).toEqual(1)
    })
  });
})
