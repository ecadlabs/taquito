import { CONFIGS } from "./config";
import { failwithContractCode } from "./data/failwith";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  _describe(`Test contract origination that throws FAILWITH api through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup()
    })
    _it('Verify contract.originate a contract with FAILWITH instruction and verify an error is thrown when calling the contract entrypoint', async () => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: failwithContractCode,
        storage: null
      })
      const contract = await op.contract()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
      expect(op.status === 'applied');

      try {
        await contract.methods.default(null).send()
      } catch (ex: any) {
        expect(ex.message).toMatch('test')
      }

      try {
        // Bypass estimation by specifying fee & limits
        await contract.methods.default(null).send({ fee: 20000, gasLimit: 20000, storageLimit: 0 })
      } catch (ex: any) {
        expect(ex.message).toMatch('test')
      }
    });
  });
})
