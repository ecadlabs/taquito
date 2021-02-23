import { CONFIGS } from "./config";
import { ligoSample } from "./data/ligo-simple-contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Simple ligo origination scenario using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('for wallet api, originates michelson produced by ligo, and increments a counter in storage', async (done) => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      }).send();
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      const contract = await op.contract();

      // file deepcode ignore no-any: any is good enough
      const storage: any = await contract.storage()
      expect(storage.toString()).toEqual("0")
      const opMethod = await contract.methods.default("2").send();

      await opMethod.confirmation();
      expect(op.opHash).toBeDefined();
      // file deepcode ignore no-any: any is good enough
      const storage2: any = await contract.storage()
      expect(storage2.toString()).toEqual("2")
      done();
    });
  });
})
