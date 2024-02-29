import { CONFIGS } from "../../../config";

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;
  describe(`Test delegation of account through contract api using: ${rpc}`, () => {

    beforeEach(async () => {
      await setup(true)
    })
    it('Verify that account can be delegated to a known baker using contract.setDelegate', async () => {
      const delegate = knownBaker
      const pkh = await Tezos.signer.publicKeyHash()
      try {
        const op = await Tezos.contract.setDelegate({
          delegate,
          source: pkh,
        })
        await op.confirmation()
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
        expect(Number(op.consumedGas)).toBeGreaterThan(0);
        expect(op.delegate).toEqual(delegate);
        expect(op.storageLimit).toEqual(0);
        expect(op.isRegisterOperation).toBeFalsy();
        expect(op.source).toEqual(pkh);
        expect(op.status).toEqual('applied');

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
