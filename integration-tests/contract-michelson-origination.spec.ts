import { CONFIGS } from "./config";
import { idMichelsonCode, idInitData } from "./data/id-contract"

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Originating a plain Michelson contract using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Origination of an ID contract written in plain Michelson', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "0",
        code: idMichelsonCode,
        init: idInitData
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });
  });
})
