import { TezosToolkit, Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../../config';
import { ProtoGreaterOrEqual } from '@taquito/michel-codec';
import { PrefixV2 } from '@taquito/utils';

CONFIGS().forEach(({ lib, rpc, setup, createAddress, protocol }) => {
  const seoulnetAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtSeouLou) ? test : test.skip;
  const Tezos = lib;

  describe(`Test Update Consensus Key using: ${rpc}`, () => {
    let consensusPk: string;
    let delegateAccount: TezosToolkit;
    let proof: string;

    beforeAll(async () => {
      await setup();
      try {
        delegateAccount = await createAddress();

        const consensusAccount = await createAddress(PrefixV2.BLS12_381SecretKey);
        consensusPk = await consensusAccount.signer.publicKey();
        proof = (await consensusAccount.signer.provePossession!()).prefixSig;

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

    seoulnetAndAlpha('should be able to inject update_consensus_key operation', async () => {
      const op = await delegateAccount.contract.updateConsensusKey({ pk: consensusPk, proof });
      await op.confirmation();
      expect(op.status).toBe('applied');
      expect(op.includedInBlock).toBeDefined();
    });
  });
})
