import { CONFIGS } from "../../config";

CONFIGS().forEach(({ lib, rpc, setup, networkName }) => {
  const Tezos = lib;
  describe(`Test contract origination with invalid data through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify that wallet.originate for a contract with non-ascii (invalid string) in the init data will fail', async () => {
      expect.assertions(1);
      try {
        await Tezos.wallet.originate({
          balance: "1",
          code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
          init: `"Copyright ©"`
        }).send()
      } catch (ex) {
        if (networkName === 'TEZLINKNET') {
          expect(ex.lastError.error_message).toContain('forbidden character in string')
        } else {
          expect(ex.message).toContain('non_printable_character')
        }
      }
    });
  });
})
