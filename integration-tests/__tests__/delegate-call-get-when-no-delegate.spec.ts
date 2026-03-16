import { CONFIGS } from "../config";

CONFIGS().forEach(({ rpc, setup, createAddress }) => {
  describe(`Test obtaining the delegate when there is none: ${rpc}`, () => {

    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 2_000_000 })
    })
    it('Verify null is returned for getDelegate when the account has no delegate', async () => {
      const LocalTez = await createAddress()
      const signer = await LocalTez.signer.publicKeyHash();

      expect(await LocalTez.rpc.getDelegate(signer)).toBeNull();
      expect(await LocalTez.tz.getDelegate(signer)).toBeNull();

    });
  });
})
