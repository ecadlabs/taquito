import { CONFIGS } from "../../config";
import { failwithContractCode } from "../../data/failwith";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test contract origination that throws FAILWITH api through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    it('Verify calling the default method of a contract with FAILWITH code will fail and throw an error', async () => {
      const op = await Tezos.wallet.originate({
        balance: "1",
        code: failwithContractCode,
        storage: null
      }).send()
      const contract = await op.contract()
      expect(op.opHash).toBeDefined();
      expect(op.status.name === 'applied');

      try {
        await contract.methods.default(null).send()
      } catch (ex: any) {
        expect(ex.message).toMatch('test')
      }

      try {
        // Bypass estimation by specify int fee & limits
        await contract.methods.default(null).send({ fee: 20000, gasLimit: 20000, storageLimit: 0 })
      } catch (ex: any) {
        expect(ex.message).toMatch('test')
      }
    });
  });
})
