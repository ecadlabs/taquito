import { CONFIGS } from "../../config";
import { booleanCode } from "../../data/boolean_parameter";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination with set bool prop on init and via call through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify contract.originate for a contract with bool storage init to true and then sets to false', async () => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: booleanCode,
        storage: true,
        fee: 150000,
        storageLimit: 10000,
        gasLimit: 400000,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      const contract = await op.contract();

      expect(await contract.storage()).toBeTruthy();

      const opMethod = await contract.methods.setBool(false).send();

      await opMethod.confirmation();
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)

      expect(await contract.storage()).toBeFalsy();
    });
  });
})
