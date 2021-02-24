import { CONFIGS } from "./config";
import { idMichelsonCode, idInitData } from "./data/id-contract"

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Originating a plain Michelson contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Origination of an ID contract using wallet API written in plain Michelson', async (done) => {
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
