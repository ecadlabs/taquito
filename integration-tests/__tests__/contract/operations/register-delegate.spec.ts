import { CONFIGS } from '../../../config';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  const Tezos = lib;
  describe(`Test register delegate through contract api: ${rpc}`, () => {
    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 2_000_000 });
    });
    it('As a User I want to verify that I can register the current address as delegate using contract.registerDelegate', async () => {
      try {
        const pkh = await Tezos.signer.publicKeyHash();
        const op = await Tezos.contract.registerDelegate({});
        await op.confirmation();
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);

        const account = await Tezos.rpc.getDelegate(pkh);
        expect(account).toEqual(pkh);
      } catch (ex: any) {
        // Live shadownet keys are not pristine snowflakes. Depending on prior state
        // and protocol wording, registerDelegate can report either variant here.
        expect(ex.message).toMatch(/delegate\.(already_active|unchanged)/);
      }
    });
  });
});
