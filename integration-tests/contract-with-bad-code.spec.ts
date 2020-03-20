import { CONFIGS } from "./config";
import { badCode } from "./data/badCode";

CONFIGS.forEach(({ lib, rpc, setup}) => {
  const Tezos = lib;
  describe(`Test contract failing with bad code using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
  it('fails with a 400 RPC response', async (done) => {
      await expect(Tezos.contract.originate({
        balance: "1",
        code: badCode,
        init: { prim: "Unit" }
      })).rejects.toMatchObject({
        status: 400,
      })
      done();
    })
  });
})
