import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  describe(`Originating a contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    test('Simple origination scenario', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: `parameter string;
        storage string;
        code {CAR;
              PUSH string "Hello ";
              CONCAT;
              NIL operation; PAIR};
        `,
        init: `"test"`
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
      expect(Number(op.consumedGas)).toBeGreaterThan(0);
      expect(op.contractAddress).toBeDefined();
      expect(op.status).toEqual('applied');
      expect(op.storageDiff).toEqual('62');

      done();
    });
  });
})
