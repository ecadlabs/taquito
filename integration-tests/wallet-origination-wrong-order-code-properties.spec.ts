import { CONFIGS } from "./config";
import { smartpySample } from "./data/smartpy-example-contract";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  _describe(`Test contract origination with code properties in atypical order through wallet api: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })

    test('Verify wallet.originate for a contract despite the code storage, parameter, code props being in wrong order', async () => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: smartpySample,
        storage: 0,
      }).send();
      await op.confirmation()
      expect(op.opHash).toBeDefined();
    });
  });
})
