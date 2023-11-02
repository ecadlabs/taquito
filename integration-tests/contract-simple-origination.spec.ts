import { CONFIGS } from "./config";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  _describe(`Test contract origination of a simple contract through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup();
    });

    _it('Verify contract.originate for a simple contract', async () => {

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

    });
  });
});
