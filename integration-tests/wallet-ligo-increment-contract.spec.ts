import { CONFIGS } from "./config";
import { ligoSample } from "./data/ligo-simple-contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination with simple ligo origination scenario through wallet api using: ${rpc}`, () => {

    beforeAll(async () => {
      await setup()
    })
    it('Verify wallet.originate for a contract in Michelson format produced by LIGO (also increments a counter in a storage).', async () => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: ligoSample,
        storage: 0,
      }).send();
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      const contract = await op.contract();

      // file deepcode ignore no-any: any is good enough
      const storage1: any = await contract.storage()
      expect(storage1.toString()).toEqual("0")
      const opMethod = await contract.methods.default("2").send();
      await opMethod.confirmation();
      expect(opMethod.opHash).toBeDefined();
      // file deepcode ignore no-any: any is good enough
      const storage2: any = await contract.storage()
      expect(storage2.toString()).toEqual("2")
    });
  });
})
