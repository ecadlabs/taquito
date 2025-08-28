import { TezosToolkit, Protocols } from '@taquito/taquito';
import { CONFIGS } from '../../../config';
import { ProtoGreaterOrEqual } from '@taquito/michel-codec';
import { PrefixV2 } from '@taquito/utils';

CONFIGS().forEach(({ lib, rpc, setup, createAddress, protocol }) => {
  const seoulnetAndAlpha = ProtoGreaterOrEqual(protocol, Protocols.PtSeouLou) ? test : test.skip;
  const Tezos = lib;

  describe(`Test Update Companion Key using: ${rpc}`, () => {
    let companionPk: string;
    let delegateAccount: TezosToolkit;
    let proof: string;

    beforeAll(async () => {
      await setup();
      try {
        delegateAccount = await createAddress();

        const companionAccount = await createAddress(PrefixV2.BLS12_381SecretKey);
        companionPk = await companionAccount.signer.publicKey();
        proof = (await companionAccount.signer.provePossession!()).prefixSig;

        const fund = await Tezos.contract.batch()
        .withTransfer({ amount: 2, to: await delegateAccount.signer.publicKeyHash() })
        .withTransfer({ amount: 2, to: await companionAccount.signer.publicKeyHash()})
        .send();
        await fund.confirmation();
        const register = await delegateAccount.contract.registerDelegate({});
        await register.confirmation();
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    });

    seoulnetAndAlpha('should be able to inject update_companion_key operation', async () => {
      const op = await delegateAccount.contract.updateCompanionKey({ pk: companionPk, proof });
      await op.confirmation();
      expect(op.status).toBe('applied');
      expect(op.includedInBlock).toBeDefined();
    });
  });
})
