import { CONFIGS } from "./config";
import { ligoSample } from "./data/ligo-simple-contract";

CONFIGS.forEach(({ lib, rpc, setup}) => {
  const Tezos = lib;
  describe(`Simple ligo origination scenario using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
  it('originates michelson produced by ligo, and increments a counter in storage', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();

      const storage: any = await contract.storage()
      expect(storage.toString()).toEqual("0")
      const opMethod = await contract.methods.main("2").send();

      await opMethod.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const storage2: any = await contract.storage()
      expect(storage2.toString()).toEqual("2")
      done();
    });
  });
})
