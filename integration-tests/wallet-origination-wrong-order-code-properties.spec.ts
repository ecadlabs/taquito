import { CONFIGS } from "./config";
import { smartpySample } from "./data/smartpy-example-contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');

  describe(`Originate contract with code properties in atypical order : ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
 test('originates a wallet api contract despite the code storage, parameter, and code props being in wrong order', 2, async (done: () => void) => {
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
