import { CONFIGS } from "../../config";
import { badCode } from "../../data/badCode";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination fail with bad code through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify that contract.originate for a contract with a missing instruction (FAILWITH_TYPO) in code will return 400 RPC in response', async () => {
      await expect(Tezos.contract.originate({
        balance: "1",
        code: badCode,
        init: { prim: "Unit" }
      })).rejects.toMatchObject({
        status: 400,
      })
    })
  });
})
