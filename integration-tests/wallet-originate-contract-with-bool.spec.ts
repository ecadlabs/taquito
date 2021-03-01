import { CONFIGS } from "./config";
import { booleanCode } from "./data/boolean_parameter";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Originate contract and set bool prop on init and via call using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('originates a wallet contract with bool storage init to true then sets to false', async (done) => {
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
      done();
    });
  });
})
