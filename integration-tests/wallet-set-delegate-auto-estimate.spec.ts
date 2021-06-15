import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;
  describe(`Test account delegation with estimation using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    it('delegates account to known baker with automatic estimate', async (done) => {
      const delegate = knownBaker
      try {
        const op = await Tezos.wallet.setDelegate({
          delegate,
        }).send()
        await op.confirmation()
        expect(op.opHash).toBeDefined();
  
        const account = await Tezos.rpc.getDelegate(await Tezos.signer.publicKeyHash())
        expect(account).toEqual(delegate)
      } catch (ex) {
        //When running tests more than one time with the same faucet key, the account is already delegated to the given delegate
        expect(ex.message).toMatch('delegate.unchanged')
      }
      done();
    });
  });
})
