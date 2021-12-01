import { CONFIGS } from "./config";
import { smartpySample } from "./data/smartpy-example-contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');

  describe(`Test contract origination with code properties in atypical order through wallet api: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
 test('Verify wallet.originate for a contract despite the code storage,parameter,code props are in wrong order', 2, async (done: () => void) => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: smartpySample,
        storage: 0,
      }).send();
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      done();
    });
  });
})
