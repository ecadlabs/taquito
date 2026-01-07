import { TezosToolkit } from '@taquito/taquito';
import { CONFIGS } from '../../../config';
import { PrefixV2 } from '@taquito/utils';

CONFIGS().forEach(({ lib, rpc, setup, createAddress, networkName }) => {
  const Tezos = lib;
  const notTezlinknet = networkName === 'TEZLINKNET' ? test.skip : test

  describe(`Test Update Companion Key using: ${rpc}`, () => {
    let delegateAccount: TezosToolkit;
    beforeAll(async () => {
      if (networkName !== 'TEZLINKNET') {
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
    }
    });

    notTezlinknet('should be able to inject update_companion_key operation', async () => {
      const companionAccount = await createAddress(PrefixV2.BLS12_381SecretKey);
      const op = await delegateAccount.contract.updateCompanionKey({ pk: await companionAccount.signer.publicKey(), proof: (await companionAccount.signer.provePossession!()).prefixSig });
      await op.confirmation();
      expect(op.status).toBe('applied');
      expect(op.includedInBlock).toBeDefined();
    });
  });
})
