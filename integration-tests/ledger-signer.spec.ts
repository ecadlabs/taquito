import { CONFIGS } from './config';
import { LedgerSigner, LedgerTransport, DerivationType } from '../packages/taquito-ledger-signer/src/taquito-ledger-signer';
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { ligoSample } from "./data/ligo-simple-contract";
import { TezosToolkit } from '@taquito/taquito';

/**
 * LedgerSigner test
 * 
 * remove "testPathIgnorePatterns": ["./ledger-signer.spec.ts"] from package.json.
 * 
 * Set up your Ledger device with this mnemonic to run this test file and 
 * 1-prefer 
 * 2-wait 
 * 3-flock 
 * 4-brown 
 * 5-volume 
 * 6-recycle 
 * 7-scrub 
 * 8-elder 
 * 9-rate 
 * 10-pair 
 * 11-twenty 
 * 12-giant 
 */

CONFIGS().forEach(({ lib, setup, rpc }) => {
  const tezos = lib;

  describe('LedgerSigner test', () => {
    let transport: LedgerTransport;

    beforeEach(async (done) => {
      transport = await TransportNodeHid.create();
      await setup(true);
      done();
    });

    it('LedgerSigner is instantiable with default parameters', () => {
      expect(
        new LedgerSigner(
          transport
        )
      ).toBeInstanceOf(LedgerSigner);
    });

    it('LedgerSigner is instantiable with parameters', () => {
      expect(
        new LedgerSigner(
          transport,
          "44'/1729'/0'/0'",
          true,
          DerivationType.SECP256K1
        )
      ).toBeInstanceOf(LedgerSigner);
    });

    describe('Get the public key', () => {
      it('Should get the correct public key and public key hash of the Ledger for tz1 curve and default path', async (done) => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/0'/0'",
          false,
          DerivationType.ED25519
        );
        const pk = await signer.publicKey();
        const pkh = await signer.publicKeyHash();
        expect(pk).toEqual(
          'edpkuRkcStobJ569XFxmE6edyRQQzMmtf4ZnmPkTPfSQnt6P3Nym2V'
        );
        expect(pkh).toEqual(
          'tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY'
        );
        done();
      });

      it('Should get the correct public key and public key hash of the Ledger for tz2 curve and default path', async (done) => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/0'/0'",
          false,
          DerivationType.SECP256K1
        );
        const pk = await signer.publicKey();
        const pkh = await signer.publicKeyHash();
        expect(pk).toEqual(
          'sppk7ZMM9NZLPPueTKcoJobdUG7MjLtaGsdrZqddcn9U6C9Yt99m8sU'
        );
        expect(pkh).toEqual(
          'tz2SxDTGnT3mHzaHf6mwy6Wtw1qUX1hzm1Sw'
        );
        done();
      });

      it('Should get the correct public key and public key hash of the Ledger for tz3 curve and path having 1 as account value', async (done) => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/1'/0'",
          false,
          DerivationType.P256
        );
        const pk = await signer.publicKey();
        const pkh = await signer.publicKeyHash();
        expect(pk).toEqual(
          'p2pk66MZ9MuDHfn5cQsUvtCvU376cijjvDLtTQzBFNeDHMijG4snUZZ'
        );
        expect(pkh).toEqual(
          'tz3PX4M9x9N7oXp2WWxNcQNK6GtaGdCdesK9'
        );
        done();
      });
    });

    describe('Should sign operation with Ledger', () => {
      jest.setTimeout(30000);
      it('Should return the correct signature with the Ledger', async (done) => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/0'/0'",
          false,
          DerivationType.ED25519
        );
        const signed = await signer.sign(
          '03281e35275248696304421740804c13f1434162474ee9449f70fb0f02cfd178f26c00c9fc72e8491bd2973e196f04ec6918ad5bcee22daa0abeb98d01c35000c09a0c0000eadc0855adb415fa69a76fc10397dc2fb37039a000'
        );
        expect(signed).toEqual({
          bytes:
            '03281e35275248696304421740804c13f1434162474ee9449f70fb0f02cfd178f26c00c9fc72e8491bd2973e196f04ec6918ad5bcee22daa0abeb98d01c35000c09a0c0000eadc0855adb415fa69a76fc10397dc2fb37039a000',
          sig:
            'sigsKFbsguu6KmUyVbarrdZiqzF94zaaQh3GWu2gXE5sEdQQbq6RFbmfo8GeC4eFLtzzwEUidf1iSX6xYARMsF8d48HAxQv9',
          prefixSig:
            'edsigu38iivupB2WoYAUtithpX28W1y9vZDHHQxGdm2XD6DFaiEYRbKAgrj33KEorjiXFSYQrQER1rLQHqkaN5WDDKg8E9QHvNZ',
          sbytes:
            '03281e35275248696304421740804c13f1434162474ee9449f70fb0f02cfd178f26c00c9fc72e8491bd2973e196f04ec6918ad5bcee22daa0abeb98d01c35000c09a0c0000eadc0855adb415fa69a76fc10397dc2fb37039a000e029a32d628fe101d9c07f82bfd34c86c0b04ee7e3bbe317420ea098944464f18d701857c42fae94ff81bfaf838b6c16df1188ca462bd78b5dd1a2b7371f3108'
        });
        done();
      });
    })

    describe('Should be able to use Ledger with contract API', () => {
      jest.setTimeout(120000)
      it('Should originate contract with Ledger', async (done) => {

        const fundAccountFirst = await tezos.contract.transfer({ to: 'tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY', amount: 9 });
        await fundAccountFirst.confirmation();

        const signer = new LedgerSigner(
          transport,
          "44'/1729'/0'/0'",
          false,
          DerivationType.ED25519
        );
        const Tezos = new TezosToolkit(rpc);
        Tezos.setSignerProvider(signer);
        const op = await Tezos.contract.originate({
          balance: "1",
          code: ligoSample,
          storage: 0,
        })
        await op.confirmation()
        expect(op.hash).toBeDefined();
        expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
        done();
      });
    })

    describe('Should be able to used Ledger with wallet API', () => {
      jest.setTimeout(120000)

      it('Should sign and inject transaction with Ledger', async (done) => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/0'/0'",
          false,
          DerivationType.ED25519
        );
        const Tezos = new TezosToolkit(rpc);
        Tezos.setSignerProvider(signer);
        const op = await Tezos.wallet.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.1 }).send()
        await op.confirmation()
        expect(op.opHash).toBeDefined();
        done();
      });
    })
  });
});
