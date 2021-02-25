import { CONFIGS } from "./config";
import { tokenBigmapCode } from "./data/token_bigmap";
import { MichelsonMap } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');
  
  describe(`Token contract with empty big map origination scenario using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    test('Originate wallet contract and init bigmap to empty map', 2, async (done: () => void) => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: tokenBigmapCode,
        storage: {
          owner: await Tezos.signer.publicKeyHash(),
          accounts: new MichelsonMap(),
          totalSupply: "0"
        }
      }).send()
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      done();
    });
  });
})
