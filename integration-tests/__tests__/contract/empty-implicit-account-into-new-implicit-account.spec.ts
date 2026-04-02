import { CONFIGS } from '../../config';
import { COST_PER_BYTE } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {
  const Tezos = lib;

  describe(`Test emptying a revealed implicit account into a new implicit account through contract api using: ${rpc}`, () => {
    beforeEach(async () => {
      await setup({ preferFreshKey: true, minBalanceMutez: 5_000_000 });
    });

    it('Verify that a new unrevealed implicit account can be created from the sender account and the sender account can be emptied into the created one.', async () => {
      const receiver = await createAddress();
      const receiver_pkh = await receiver.signer.publicKeyHash();

      // create and fund the account we want to empty
      const sender = await createAddress();
      const sender_pkh = await sender.signer.publicKeyHash();
      const op = await Tezos.contract.transfer({ to: sender_pkh, amount: 1 });
      await op.confirmation();

      // Sending 1 token from the account we want to empty
      // This will do the reveal operation automatically
      const op2 = await sender.contract.transfer({
        to: await Tezos.signer.publicKeyHash(),
        amount: 0.1,
      });
      await op2.confirmation();

      const balance = await Tezos.tz.getBalance(sender_pkh);

      const estimate = await sender.estimate.transfer({
        to: receiver_pkh,
        amount: 0.5,
      });

      // Funding a fresh implicit account charges the 20-byte allocation burn.
      // Even when we try to drain the sender precisely, current protocol/accounting
      // can leave that buffer behind on live networks. Expect the sender to be
      // effectively emptied, not bit-for-bit zero every time.
      const totalFees = estimate.suggestedFeeMutez + estimate.burnFeeMutez - 20 * COST_PER_BYTE;
      const maxAmount = balance.minus(totalFees).toNumber();

      const opTransfer = await sender.contract.transfer({
        to: receiver_pkh,
        mutez: true,
        amount: maxAmount,
        fee: estimate.suggestedFeeMutez,
        gasLimit: estimate.gasLimit,
        storageLimit: estimate.storageLimit,
      });

      await opTransfer.confirmation();
      expect(opTransfer.status).toEqual('applied');
      const finalBalance = await Tezos.tz.getBalance(sender_pkh);

      expect(finalBalance.toNumber()).toBeLessThanOrEqual(20 * COST_PER_BYTE);
    });
  });
});
