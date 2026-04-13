import { CONFIGS, waitForRpcState } from '../../config';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
  const Tezos = lib;
  describe(`Test account delegation with estimation through wallet api using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 2_000_000 });
    });
    it('Verify that an address can be delegated to a known baker with an automatic estimate', async () => {
      const delegate = knownBaker;
      const pkh = await Tezos.signer.publicKeyHash();
      const startingDelegate = await Tezos.rpc.getDelegate(pkh);
      try {
        const op = await Tezos.wallet
          .setDelegate({
            delegate,
          })
          .send();
        await op.confirmation();
        expect(await op.status()).toBe('applied');
        expect(op.opHash).toBeDefined();

        const account = await waitForRpcState(
          Tezos,
          () => Tezos.rpc.getDelegate(pkh),
          (currentDelegate) => currentDelegate === delegate,
          { description: `delegate for ${pkh}` }
        );
        expect(account).toEqual(delegate);
      } catch (ex: any) {
        const currentDelegate = await waitForRpcState(
          Tezos,
          () => Tezos.rpc.getDelegate(pkh),
          () => true,
          { timeoutMs: 2_000, description: `delegate state for ${pkh}` }
        ).catch(() => null);

        if (currentDelegate === pkh) {
          // Forbidden delegate deletion
          expect(ex.message).toMatch('delegate.no_deletion');
        } else if (startingDelegate === delegate || currentDelegate === delegate) {
          // When running tests more than one time with the same key, the account is already delegated to the given delegate
          expect(ex.message).toMatch('delegate.unchanged');
        } else {
          throw ex;
        }
      }
    });
  });
});
