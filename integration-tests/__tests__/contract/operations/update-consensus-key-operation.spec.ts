import { CONFIGS } from '../../../config';

CONFIGS().forEach(({ lib, rpc, setup, createAddress }) => {

  const Tezos = lib;

  describe(`Test Update Consensus Key using: ${rpc}`, () => {
    let pk: string;
    beforeAll(async () => {
      await setup(true);

      try {
        const account = await createAddress();
        pk = await account.signer.publicKey();
        const pkh = await account.signer.publicKeyHash();

        const fund = await Tezos.contract.transfer({ amount: 5, to: pkh });
        await fund.confirmation();

        const register = await Tezos.contract.registerDelegate({});
        await register.confirmation();

      } catch (e) {
        console.log(JSON.stringify(e));
      }

    });

    it('should be able to inject update_consensus_key operation', async () => {
      const op = await Tezos.contract.updateConsensusKey({ pk });
      await op.confirmation();

      expect(op.status).toBe('applied');
      expect(op.includedInBlock).toBeDefined();
    });
  });
})
