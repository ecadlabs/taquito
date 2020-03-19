import { CONFIGS } from "./config";

CONFIGS.forEach(({ lib, rpc, setup, knownBaker}) => {
  const Tezos = lib;
  describe(`Test account delegation with estimation using: ${rpc}`, () => {

    beforeEach(async (done) => {
      // TODO: use fresh key
      await setup()
      done()
    })
    it('delegates account to known baker with automatic estimate', async (done) => {
      const delegate = knownBaker
      const op = await Tezos.contract.setDelegate({
        delegate,
        source: await Tezos.signer.publicKeyHash(),
      })
      await op.confirmation()
      expect(op.hash).toBeDefined();
      expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)

      const account = await Tezos.rpc.getDelegate(await Tezos.signer.publicKeyHash())
      expect(account).toEqual(delegate)
      done();
    });
  });
})
