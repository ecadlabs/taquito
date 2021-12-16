import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
  const Tezos = lib;
  describe(`Test  register delegate: ${rpc}`, () => {

    beforeEach(async (done) => {
      await setup(true)
      done()
    })
    it('registers the current address as delegate', async (done) => {
      try {
        const pkh = await Tezos.signer.publicKeyHash();
        const op = await Tezos.contract.registerDelegate({});
        await op.confirmation()
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)

        const account = await Tezos.rpc.getDelegate(pkh)
        expect(account).toEqual(pkh)
      } catch (ex: any) {
        if (protocol === Protocols.PsFLorena) {
          expect(ex.message).toMatch('delegate.unchanged')
        } else {
          // When running tests more than one time with the same faucet key, the account is already delegated to the given delegate
          expect(ex.message).toMatch('delegate.already_active')
        }
      }
      done();
    });
  });
})
