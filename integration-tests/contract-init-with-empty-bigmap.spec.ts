import { CONFIGS } from "./config";
import { tokenBigmapCode } from "./data/token_bigmap";
import { MichelsonMap } from "@taquito/taquito";

CONFIGS.forEach(({ lib, rpc, setup}) => {
  const Tezos = lib;
  describe(`Token contract with empty big map origination scenario using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
  it('Originate contract and init bigmap to empty map', async (done) => {
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
      done();
    });
  });
})
