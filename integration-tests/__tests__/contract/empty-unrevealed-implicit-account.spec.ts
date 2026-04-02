import { CONFIGS } from '../../config';

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;
  describe(`Test emptying an unrevealed implicit account through contract api using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 });
    });

    it('Verify that a new unrevealed implicit account can be created, funded and emptied through contract api', async () => {
      const LocalTez = await createAddress();
      const op = await Tezos.contract.transfer({
        to: await LocalTez.signer.publicKeyHash(),
        amount: 0.005,
      });
      await op.confirmation();

      const pkh = await LocalTez.signer.publicKeyHash();
      const balance = await Tezos.tz.getBalance(pkh);
      const estimate = await LocalTez.estimate.transfer({
        to: await Tezos.signer.publicKeyHash(),
        mutez: true,
        amount: balance.toNumber(),
      });

      const op3 = await LocalTez.contract.transfer({
        to: await Tezos.signer.publicKeyHash(),
        mutez: true,
        amount: balance.minus(estimate.suggestedFeeMutez).toNumber(),
        fee: estimate.suggestedFeeMutez,
        gasLimit: estimate.gasLimit,
        storageLimit: 0,
      });
      await op3.confirmation();

      expect(op3.status).toEqual('applied');
      expect((await Tezos.tz.getBalance(pkh)).toString()).toEqual('0');
    });
  });
});
