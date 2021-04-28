import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test tx and waiting for 2 confirmations using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('transfers 2 tez and waits for 2 confirmations with wallet', async (done) => {
      const op = await Tezos.wallet.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 }).send();
      await op.confirmation()
      const [first, second] = await Promise.all([op.confirmation(), op.confirmation(2)])
      expect(second.currentConfirmation - first.currentConfirmation).toEqual(1)
      // Retrying another time should be instant
      const [first2, second2] = await Promise.all([op.confirmation(), op.confirmation(2)])
      expect(second2.expectedConfirmation! - first2.expectedConfirmation!).toEqual(1)
      done();
    })
  });
})
