import { CONFIGS } from "../../config";
import { booleanCode } from "../../data/boolean_parameter";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination with set bool prop on init and via call through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 2_000_000 })
    })
    it('Verify wallet.originate for a contract with bool storage init to true and then sets to false', async () => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: booleanCode,
        storage: true,
      }).send();
      await op.confirmation()
      expect(await op.status()).toBe('applied');
      expect(op.opHash).toBeDefined();
      const contract = await op.contract();

      expect(await contract.storage()).toBeTruthy();

      const opMethod = await contract.methodsObject.setBool(false).send();

      await opMethod.confirmation();
      expect(await opMethod.status()).toBe('applied');

      expect(await contract.storage()).toBeFalsy();
    });
  });
})
