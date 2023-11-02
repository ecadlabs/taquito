import { CONFIGS } from "./config";
import { badCode } from "./data/badCode";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  _describe(`Test contract origination fail with bad code through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    _it('Verify that contract.originate for a contract with a missing instruction (FAILWITH_TYPO) in code will return 400 RPC in response', async () => {
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
