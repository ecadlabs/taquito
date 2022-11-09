//This contract is used in integration tests where origination of contracts using voting is tested.

import { CONFIGS } from "./config";
import { contractCode } from "./data/metadataViews";
import { nftContract } from "./data/nft-contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Originate an nft contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('originates an nft contract and inits the storage', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: nftContract,
        init: `(Pair (Pair (Pair "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" {}) {} {})
      (Pair False {})
      0)`
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      console.log("contract address " + op.contractAddress)
      done();
    });
  });
})
