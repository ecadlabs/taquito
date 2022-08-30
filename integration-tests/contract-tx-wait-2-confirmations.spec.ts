import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
<<<<<<< Updated upstream
  describe(`Test tx and waiting for 2 confirmations using: ${rpc}`, () => {
=======
  const test = require('jest-retries');
  describe(`Test tx and waiting for 2 confirmations through contract api using: ${rpc}`, () => {
>>>>>>> Stashed changes

    beforeEach(async (done) => {
      await setup()
      done()
    })
<<<<<<< Updated upstream
    test('transfers 0.02 tez and waits for 2 confirmations', async (done) => {
      const op = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
=======
    test('Verify contract.transfer for 2 XTZ to an address and waits for 2 confirmations', 2, async (done: () => void) => {
      const op = await Tezos.contract.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
>>>>>>> Stashed changes
      await op.confirmation()
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const [first, second] = await Promise.all([op.confirmation(), op.confirmation(2)])
      expect(second - first).toEqual(1)
      // Retrying another time should be instant
      const [first2, second2] = await Promise.all([op.confirmation(), op.confirmation(2)])
      expect(second2 - first2).toEqual(1)
      done();
    })
  });
})
