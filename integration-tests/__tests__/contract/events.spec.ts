import { CONFIGS } from "../../config";
import { mainContractWithDuplicateEvents } from "../../data/main-contract-with-duplicate-events";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Events using contract API: ${rpc}`, () => {

    beforeEach(async () => {
      await setup(true)
    })
    it(`We should be able to access events of an originated contract`, async () => {
      // Contract origination
      const op = await Tezos.contract.originate({
        code: mainContractWithDuplicateEvents,
        storage: 42,
      });
      await op.confirmation();
      const contract = await op.contract();

      expect(contract.eventSchema.length).toEqual(3);

      expect(contract.eventSchema[0].tag).toEqual('%tagOneOnlyIntRepeated');
      expect(contract.eventSchema[0].type?.prim).toEqual('int');

      expect(contract.eventSchema[1].tag).toEqual('%tagTwoIntAndString');
      expect(contract.eventSchema[1].type?.prim).toEqual('string');

      expect(contract.eventSchema[2].tag).toEqual('%tagTwoIntAndString');
      expect(contract.eventSchema[2].type?.prim).toEqual('int');
    });
  });
});
