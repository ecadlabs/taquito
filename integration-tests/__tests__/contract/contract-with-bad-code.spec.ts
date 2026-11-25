import { UnexpectedMichelsonValueError } from '@taquito/local-forging';
import { CONFIGS } from "../../config";
import { badCode } from "../../data/badCode";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination fail with bad code through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 2_000_000 })
    })
    it('Verify that contract.originate for a contract with an unregistered instruction (FAILWITH_TYPO) in code rejects during local forging', async () => {
      await expect(Tezos.contract.originate({
        balance: "1",
        code: badCode,
        init: { prim: "Unit" }
      })).rejects.toThrow(UnexpectedMichelsonValueError);
    })
  });
})
