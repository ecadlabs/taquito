import { CONFIGS } from "./config";
import { failwithContractCode } from "./data/failwith";

CONFIGS.forEach(({ lib, rpc, setup}) => {
  const Tezos = lib;
  describe(`Test contract that throws FAILWITH api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
  it('captures a FAILWITH and throws an error', async (done) => {
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
        await contract.methods.main(null).send()
      } catch (ex) {
        expect(ex.message).toMatch('test')
      }

      try {
        // Bypass estimation by specifyint fee & limits
        await contract.methods.main(null).send({ fee: 20000, gasLimit: 20000, storageLimit: 0 })
      } catch (ex) {
        expect(ex.message).toMatch('test')
      }
      done();
    });
  });
})
