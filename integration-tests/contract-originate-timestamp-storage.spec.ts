import { CONFIGS } from "./config";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  _describe(`Originate contract with timestamp storage/params: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    });


    _it('should originate contract correctly with number passed into timestamp storage', async () => {
      const date = Date.now();

      const op = await Tezos.contract.originate({
        code: `{ parameter timestamp ;
          storage timestamp ;
          code { CAR ; NIL operation ; PAIR } }`,
        storage: date
      });

      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(Number(op.consumedGas)).toBeGreaterThan(0);
      expect(op.contractAddress).toBeDefined();
      expect(op.status).toEqual('applied');

    });

    _it('should originate contract correctly with string passed into timestamp storage', async () => {
      const date = new Date().toISOString();

      const op = await Tezos.contract.originate({
        code: `{ parameter timestamp ;
          storage timestamp ;
          code { CAR ; NIL operation ; PAIR } }`,
        storage: date
      });

      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(Number(op.consumedGas)).toBeGreaterThan(0);
      expect(op.contractAddress).toBeDefined();
      expect(op.status).toEqual('applied');

    });
  });
});
