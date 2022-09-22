import { IntegerError } from "@taquito/taquito";
import { CONFIGS } from "./config";
import { idMichelsonCode, idInitData } from "./data/id-contract"

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination in a plain Michelson through contract api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('Verify contract.originate for an ID contract written in plain Michelson', async (done) => {
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
    it('Origination should pass with balance as number', async (done) => {
      const op = await Tezos.contract.originate({
        balance: 0,
        code: idMichelsonCode,
        init: idInitData
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      done();
    });
    it('Origination should thow error if given NaN for balance', async (done) => {
      expect(() => Tezos.contract.originate({
        balance: "asdf",
        code: idMichelsonCode,
        init: idInitData
      })).rejects.toThrowError(IntegerError)
      done();
    });
  });
})
