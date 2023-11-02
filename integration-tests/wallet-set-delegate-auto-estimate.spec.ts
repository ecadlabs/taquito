import { CONFIGS } from "./config";
import { _describe, _it } from "./test-utils";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;
  _describe(`Test account delegation with estimation through wallet api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup(true)
    })
    _it('Verify that an address can be delegated to a known baker with an automatic estimate', async () => {
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
          // When running tests more than one time with the same key, the account is already delegated to the given delegate
          expect(ex.message).toMatch('delegate.unchanged')
        }
      }
    });
  });
})
