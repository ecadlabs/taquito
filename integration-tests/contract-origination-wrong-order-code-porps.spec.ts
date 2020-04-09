import { CONFIGS } from "./config";
import { smartpySample } from "./data/smartpy-example-contract";

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Originate contract with code properties in atypical order : ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup()
      done()
    })
    it('originates a contract despite the code storage,parameter,code props are in wrong order', async (done) => {
      const op = await Tezos.contract.originate({
        balance: "1",
        code: smartpySample,
        storage: 0,
        fee: 150000,
        storageLimit: 10000,
        gasLimit: 400000,
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      done();
    });
  });
})
