import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Originate contract with timestamp storage/params: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    });

    
    it('should originate contract correctly with number passed into timestamp storage', async (done) => {
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

      done();
    });

    it('should originate contract correctly with string passed into timestamp storage', async (done) => {
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

      done();
    });
  });
});
