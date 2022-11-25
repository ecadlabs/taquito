import { OperationContentsAndResultTransaction } from "@taquito/rpc";
import { InMemorySigner } from "@taquito/signer";
import { TezosToolkit } from "@taquito/taquito";
import { CONFIGS } from "./config";
import * as Bip39 from 'bip39';

CONFIGS().forEach(({ lib, rpc, setup }) => {
  let Funder: TezosToolkit;
  describe(`Test fromMnemonic instantiation with rpc: ${rpc}`, () => {
    let mnemonic: string;

    beforeAll(async (done) => {
      mnemonic = Bip39.generateMnemonic();
      Funder = lib;
      await setup();
      done();
    });
    it('Should create an InMemorySigner (ed25519) with the fromMnemonic method and transfer tez to an account', async (done) => {
      const Tezos = new TezosToolkit(rpc);
      // with all default values
      const signer = InMemorySigner.fromMnemonic({ mnemonic });
      Tezos.setSignerProvider(signer);

      const funderPKH = await Funder.wallet.pkh();
      const tezosPKH = await Tezos.wallet.pkh();

      const fundOp = await Funder.wallet.transfer({ to: tezosPKH, amount: 5 }).send();
      await fundOp.confirmation();

      const returnOp = await Tezos.wallet.transfer({ to: funderPKH, amount: 1 }).send();
      await returnOp.confirmation();

      const status = await returnOp.status();
      expect(status).toEqual('applied');

      const balance = await Tezos.tz.getBalance(tezosPKH);
      expect(Number(balance)).toBeGreaterThan(0);
      done();
    });
    it('Should create an InMemorySigner (secp256k1) with the fromMnemonic method and transfer tez to an account', async (done) => {
      const Tezos = new TezosToolkit(rpc);
      // with all default values
      const signer = InMemorySigner.fromMnemonic({ mnemonic, curve: 'secp256k1' });
      Tezos.setSignerProvider(signer);

      const funderPKH = await Funder.wallet.pkh();
      const tezosPKH = await Tezos.wallet.pkh();

      const fundOp = await Funder.wallet.transfer({ to: tezosPKH, amount: 5 }).send();
      await fundOp.confirmation();

      const returnOp = await Tezos.wallet.transfer({ to: funderPKH, amount: 1, }).send();
      await returnOp.confirmation();

      const status = await returnOp.status();
      expect(status).toEqual('applied');
      const balance = await Tezos.tz.getBalance(tezosPKH);
      expect(Number(balance)).toBeGreaterThan(0);
      done();
    });
    it('Should create an InMemorySigner (p256) with the fromMnemonic method and transfer tez to an account', async (done) => {
      const Tezos = new TezosToolkit(rpc);
      // with all default values
      const signer = InMemorySigner.fromMnemonic({ mnemonic, curve: 'p256' });
      Tezos.setSignerProvider(signer);

      const funderPKH = await Funder.wallet.pkh();
      const tezosPKH = await Tezos.wallet.pkh();

      const fundOp = await Funder.wallet.transfer({ to: tezosPKH, amount: 5 }).send();
      await fundOp.confirmation();

      const returnOp = await Tezos.wallet.transfer({ to: funderPKH, amount: 1 }).send();
      await returnOp.confirmation();

      const status = await returnOp.status();
      expect(status).toEqual('applied');
      const balance = await Tezos.tz.getBalance(tezosPKH);
      expect(Number(balance)).toBeGreaterThan(0);
      done();
    });
  });
});
