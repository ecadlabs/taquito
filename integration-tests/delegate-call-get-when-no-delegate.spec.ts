import { CONFIGS } from "./config";

CONFIGS().forEach(({ rpc, setup, createAddress }) => {
  const test = require('jest-retries');

  describe(`Test obtaining the delegate when there is none: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    test('Verify null is returned for getDelegate when the account has no delegate', 2, async (done: () => void) => {
      const LocalTez = await createAddress()
      const signer = await LocalTez.signer.publicKeyHash();

      expect(await LocalTez.rpc.getDelegate(signer)).toBeNull();
      expect(await LocalTez.tz.getDelegate(signer)).toBeNull();

      done();
    });
  });
})
