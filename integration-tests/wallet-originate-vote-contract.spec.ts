import { CONFIGS } from "./config";
import { voteSample } from "./data/vote-contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');
  describe(`Test contract origination of a vote contract through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    test('Verify wallet.originate for a voting contract and init the storage', 2, async (done: () => void) => {
      // TODO: probably remove this as very expensive
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: voteSample,
        storage: {
          mgr1: {
            addr: await Tezos.signer.publicKeyHash(),
            key: null,
          },
          mgr2: {
            addr: await Tezos.signer.publicKeyHash(),
            key: await Tezos.signer.publicKeyHash(),
          },
        }
      }).send()
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      expect(op.operationResults).toBeDefined();
      done();
    });
  });
})
