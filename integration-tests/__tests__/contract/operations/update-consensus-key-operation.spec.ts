import { TezosToolkit } from '@taquito/taquito';
import { CONFIGS } from '../../../config';

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {

  const Tezos = lib;

  describe(`Test Update Consensus Key using: ${rpc}`, () => {
    let consensusPk: string;
    let delegateAccount: TezosToolkit;
    beforeAll(async () => {
      await setup(true);

      try {
        delegateAccount = await createAddress();

        const consensusAccount = await createAddress();
        consensusPk = await consensusAccount.signer.publicKey();

        const fund = await Tezos.contract.batch()
        .withTransfer({ amount: 2, to: await delegateAccount.signer.publicKeyHash() })
        .withTransfer({ amount: 2, to: await consensusAccount.signer.publicKeyHash()})
        .send();
        await fund.confirmation();

        const register = await delegateAccount.contract.registerDelegate({});
        await register.confirmation();

      } catch (e) {
        console.log(JSON.stringify(e));
      }

    });

    it('should be able to inject update_consensus_key operation', async () => {
      const op = await delegateAccount.contract.updateConsensusKey({ pk: consensusPk });
      await op.confirmation();

      expect(op.status).toBe('applied');
      expect(op.includedInBlock).toBeDefined();
    });
  });
})
