import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test failing_noop through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    it('Verify that the failing_noop signs an int and fails as expected', async (done) => {
      expect(async () => {
        const op = await Tezos.wallet.failingNoOp({
          arbitrary: "2736475837593756",
        }).send();
        const result = await op.confirmation();
        console.log(JSON.stringify(result, null, 2));
      }).rejects.toThrow(`Http error response: (500) [{"kind":"permanent","id":"proto.017-PtNairob.validate.operation.failing_noop_error"}]`);
      done();
    });
  });
})
