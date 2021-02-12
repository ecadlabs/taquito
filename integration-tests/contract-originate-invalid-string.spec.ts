import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  describe(`Test invalid data for origination using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('fails because non-ascii in init data', async (done) => {
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
        if( protocol === Protocols.PtEdo27k) {
          expect(ex).toEqual(expect.objectContaining({ message: expect.stringContaining('michelson_v1.invalid_syntactic_constant') }))
	} else if( protocol === Protocols.PsCARTHA) {
          expect(ex).toEqual(expect.objectContaining({ message: expect.stringContaining('invalidSyntacticConstantError') }))
        } else {
          expect(ex).toEqual(expect.objectContaining({ message: expect.stringContaining('invalid_constant') }))
        }
      }
      done();
    });
  });
})
