import { Protocols } from "@taquito/taquito";
import { CONFIGS } from "../../../config";

CONFIGS().forEach(({ lib, rpc, setup, protocol, networkName }) => {
  const Tezos = lib;
  const notTezlinknet = networkName === 'TEZLINKNET' ? test.skip : test
  describe(`Test register delegate through contract api: ${rpc}`, () => {

    beforeEach(async () => {
      await setup(true)
    })
    notTezlinknet('As a User I want to verify that I can register the current address as delegate using contract.registerDelegate', async () => {
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
          // When running tests more than one time with the same key, the account is already delegated to the given delegate
          expect(ex.message).toMatch('delegate.already_active')
        }
      }
    });
  });
})
