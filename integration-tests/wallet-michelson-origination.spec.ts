import { CONFIGS } from "./config";
import { idMichelsonCode, idInitData } from "./data/id-contract"

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination in a plain Michelson contract through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Verify wallet.originate for an ID contract written in plain Michelson', async (done) => {
      const op = await Tezos.wallet.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      }).send()
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      expect(op.status).toBeDefined();
      done();
    });
  });
})
