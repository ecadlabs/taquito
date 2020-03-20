import { CONFIGS } from "./config";
import { DEFAULT_FEE, DEFAULT_GAS_LIMIT } from "@taquito/taquito";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;
  describe(`Test delegation off account using: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    it('succeeds in delegating its account to a known baker', async (done) => {
      const delegate = knownBaker
      const op = await Tezos.contract.setDelegate({
        delegate,
        source: await Tezos.signer.publicKeyHash(),
        fee: DEFAULT_FEE.DELEGATION,
        gasLimit: DEFAULT_GAS_LIMIT.DELEGATION
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
