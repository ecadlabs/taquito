import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');

  describe(`Test trying to get the delegate when there is none: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    test('returns null when the account has no delegate', 2, async (done: () => void) => {
        const signer = await Tezos.signer.publicKeyHash();

        expect (await Tezos.rpc.getDelegate(signer)).toBeNull();
        expect (await Tezos.tz.getDelegate(signer)).toBeNull();

      done();
    });
  });
})
