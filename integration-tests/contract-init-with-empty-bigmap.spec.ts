import { CONFIGS } from "./config";
import { tokenBigmapCode } from "./data/token_bigmap";
import { MichelsonMap } from "@taquito/taquito";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  _describe(`Test contract origination with empty BigMap origination scenario through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    _it('Verify contract.originate for a contract and init the BigMap to empty map', async () => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: tokenBigmapCode,
        storage: {
          owner: await Tezos.signer.publicKeyHash(),
          accounts: new MichelsonMap(),
          totalSupply: "0"
        }
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
    });
  });
})
