import { CONFIGS } from "../../config";
import { badCode } from "../../data/badCode";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination fail with bad code through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 2_000_000 })
    })
    it('Verify that wallet.originate for a contract with a missing instruction (FAILWITH_TYPO) in code will return 400 RPC in response', async () => {
      await expect(Tezos.wallet.originate({
        balance: "1",
        code: badCode,
        init: { prim: "Unit" }
      }).send()).rejects.toMatchObject({
        status: 400,
      })
    })
  });
})
