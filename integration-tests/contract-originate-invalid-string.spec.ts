import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  const test = require('jest-retries');

  describe(`Test contract origination with invalid data through contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    test('Verify that contract.originate for a contract with non-ascii (invalid string) in the init data will fail', 2, async (done: () => void) => {
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
        if (protocol === Protocols.PsFLorena || protocol === Protocols.PtGRANADs) {
          expect(ex).toEqual(expect.objectContaining({ message: expect.stringContaining('invalid_syntactic_constant') }))
        } else {
          expect(ex).toEqual(expect.objectContaining({ message: expect.stringContaining('non_printable_character') }))
        }
      }
      done();
    });
  });
})
