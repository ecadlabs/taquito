import { CONFIGS } from "../../config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test origination of a simple contract through the wallet API using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify wallet.originate for a simple contract', async () => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: `parameter string;
        storage string;
        code {CAR;
              PUSH string "Hello ";
              CONCAT;
              NIL operation; PAIR};
        `,
        init: `"test"`
      }).send();
      await op.confirmation()
      expect(op.opHash).toBeDefined();
    });
  });
})
