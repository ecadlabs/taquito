import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
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
        expect(ex).toEqual(expect.objectContaining({ message: expect.stringContaining('invalidSyntacticConstantError') }))
      }
      done();
    });
  });
})
