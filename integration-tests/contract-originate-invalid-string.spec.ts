import { CONFIGS } from "./config";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;

  _describe(`Test contract origination with invalid data through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    test('Verify that contract.originate for a contract with non-ascii (invalid string) in the init data will fail', async () => {
      expect.assertions(1);
      try {
        await Tezos.contract.originate({
          balance: "1",
          code: `parameter string;
          storage string;
          code {CAR;
                PUSH string "Hello ";
                CONCAT;
                NIL operation; PAIR};
          `,
          init: `"Copyright ©"`
        })
      } catch (ex) {
        expect(ex).toEqual(expect.objectContaining({ message: expect.stringContaining('non_printable_character') }))
      }
    });
  });
})
