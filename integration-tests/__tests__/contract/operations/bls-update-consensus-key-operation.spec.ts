import { TezosToolkit, Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../../config';
import { ProtoGreaterOrEqual } from '@taquito/michel-codec';
import { PrefixV2 } from '@taquito/utils';

CONFIGS().forEach(({ lib, rpc, setup, createAddress, protocol }) => {
  const seoulnetAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtSeouLou) ? test : test.skip;
  const Tezos = lib;

  describe(`Test Update Consensus Key using: ${rpc}`, () => {
    let delegateAccount: TezosToolkit;

    beforeAll(async () => {
      await setup();
      try {
        delegateAccount = await createAddress();
        const fund = await Tezos.contract.transfer({ amount: 2, to: await delegateAccount.signer.publicKeyHash() })
        await fund.confirmation();
        const register = await delegateAccount.contract.registerDelegate({});
        await register.confirmation();
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    });

    seoulnetAndAlpha('should be able to inject update_consensus_key operation', async () => {
      const consensusAccount = await createAddress(PrefixV2.BLS12_381SecretKey);
      const op = await delegateAccount.contract.updateConsensusKey({ pk: await consensusAccount.signer.publicKey(), proof: (await consensusAccount.signer.provePossession!()).prefixSig });
      await op.confirmation();
      expect(op.status).toBe('applied');
      expect(op.includedInBlock).toBeDefined();
    });
  });
})
