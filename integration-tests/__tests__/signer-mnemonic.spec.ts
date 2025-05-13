import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';
import { CONFIGS } from '../config';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  let Funder: TezosToolkit;
  describe(`Create signer instances with fromMnemonic: ${rpc}`, () => {
    let mnemonic: string;
    let Tez1: TezosToolkit, Tez2: TezosToolkit, Tez3: TezosToolkit;

    let funderPKH: string;

    beforeAll(async () => {
      mnemonic = bip39.generateMnemonic(wordlist);
      Funder = lib;
      await setup();

      try {
        funderPKH = await Funder.signer.publicKeyHash();

        /**
         * Create 3 TezosToolkits with signer providers of different curves
         * and Fund them with the Funder account
         */
        Tez1 = new TezosToolkit(rpc);
        const signer1 = InMemorySigner.fromMnemonic({ mnemonic });
        Tez1.setSignerProvider(signer1);
        const tez1Pkh = await Tez1.signer.publicKeyHash();

        Tez2 = new TezosToolkit(rpc);
        const signer2 = InMemorySigner.fromMnemonic({
          mnemonic,
          curve: 'secp256k1',
        });
        Tez2.setSignerProvider(signer2);
        const tez2Pkh = await Tez2.signer.publicKeyHash();

        Tez3 = new TezosToolkit(rpc);
        const signer3 = InMemorySigner.fromMnemonic({
          mnemonic,
          curve: 'p256',
        });
        Tez3.setSignerProvider(signer3);
        const tez3Pkh = await Tez3.signer.publicKeyHash();

        // Fund all the signer accounts
        const send1 = await Funder.contract.transfer({
          to: tez1Pkh,
          amount: 2,
        });
        await send1.confirmation();

        const send2 = await Funder.contract.transfer({
          to: tez2Pkh,
          amount: 2,
        });
        await send2.confirmation();

        const send3 = await Funder.contract.transfer({
          to: tez3Pkh,
          amount: 2,
        });
        await send3.confirmation();
      } catch (e) {
        console.log(`Error when trying to fund account: \n ${JSON.stringify(e)}`);
      }
    });

    it('should create a signer instance (ed25519) using the fromMnemonic method and successfully sign an op', async () => {
      const op = await Tez1.contract.transfer({ to: funderPKH, amount: 0.1 });
      await op.confirmation();

      expect(op.hash).toBeDefined();
    });

    it('should create a signer instance (secp256k1) using the fromMnemonic method and successfully sign an op', async () => {
      const op = await Tez2.contract.transfer({ to: funderPKH, amount: 0.1 });
      await op.confirmation();

      expect(op.hash).toBeDefined();
    });

    it('should create a signer instance (p256) using the fromMnemonic method and successfully sign an op', async () => {
      const op = await Tez3.contract.transfer({ to: funderPKH, amount: 0.1 });
      await op.confirmation();

      expect(op.hash).toBeDefined();
    });
  });
});
