import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;
  describe(`Test account delegation with estimation through wallet api using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    it('As a User I want to verify that I can delegate account to known baker with automatic estimate', async (done) => {
      const delegate = knownBaker
      const pkh = await Tezos.signer.publicKeyHash();
      try {
        const op = await Tezos.wallet.setDelegate({
          delegate,
        }).send()
        await op.confirmation()
        expect(op.opHash).toBeDefined();

        const account = await Tezos.rpc.getDelegate(pkh)
        expect(account).toEqual(delegate)
      } catch (ex: any) {
        if (await Tezos.rpc.getDelegate(pkh) === pkh) {
          // Forbidden delegate deletion
          expect(ex.message).toMatch('delegate.no_deletion')
        } else {
          // When running tests more than one time with the same faucet key, the account is already delegated to the given delegate
          expect(ex.message).toMatch('delegate.unchanged')
        }
      }
      done();
    });
  });
})
