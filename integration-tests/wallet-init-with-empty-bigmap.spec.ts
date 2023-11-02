import { CONFIGS } from "./config";
import { tokenBigmapCode } from "./data/token_bigmap";
import { MichelsonMap } from "@taquito/taquito";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  const test = require('jest-retries');

  _describe(`Test contract origination with empty BigMap origination scenario through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    test('Verify wallet.originate for a contract and init the BigMap to empty map', 2, async () => {
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
    });
  });
})
