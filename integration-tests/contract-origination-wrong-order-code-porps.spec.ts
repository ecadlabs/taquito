import { CONFIGS } from "./config";
import { smartpySample } from "./data/smartpy-example-contract";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  _describe(`Test contract origination with code properties in atypical order through contract api: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    _it('Verify contract.originate for a contract despite the code storage,parameter,code props are in wrong order', async () => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: smartpySample,
        storage: 0,
        fee: 150000,
        storageLimit: 10000,
        gasLimit: 400000,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
    });
  });
})
