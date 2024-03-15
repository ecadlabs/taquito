import { CONFIGS } from "../../config";
import { ligoSample } from "../../data/ligo-simple-contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination with simple ligo origination scenario through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify contract.originate for a contract in JSON Michelson format produced by LIGO (also increments a counter in the storage)', async () => {
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
      const opMethod = await contract.methods.default("2").send();

      await opMethod.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const storage2: any = await contract.storage()
      expect(storage2.toString()).toEqual("2")
    });
  });
})
