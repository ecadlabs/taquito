import { CONFIGS } from "../../config";
import { booleanCode } from "../../data/boolean_parameter";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination with set bool prop on init and via call through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify wallet.originate for a contract with bool storage init to true and then sets to false', async () => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: booleanCode,
        storage: true,
      }).send();
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      expect(op.status).toBeTruthy
      const contract = await op.contract();

      expect(await contract.storage()).toBeTruthy();

      const opMethod = await contract.methods.setBool(false).send();

      await opMethod.confirmation();
      expect(op.opHash).toBeDefined();

      expect(await contract.storage()).toBeFalsy();
    });
  });
})
