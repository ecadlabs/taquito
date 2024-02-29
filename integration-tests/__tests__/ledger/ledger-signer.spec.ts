import { CONFIGS } from '../../config';
import { LedgerSigner, LedgerTransport, DerivationType } from '@taquito/ledger-signer';
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { ligoSample } from "../../data/ligo-simple-contract";
import { TezosToolkit } from '@taquito/taquito';
import { localForger } from '@taquito/local-forging';
import { rpcToForge } from '../../data/contract_origination';

// PLEASE NOTE MAY NEED TO TEST ONE TEST AT A TIME
// as the ledger will fail if requested multiple times at once

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

  describe('Verify LedgerSigner', () => {
    let transport: LedgerTransport;

    beforeEach(async () => {
      transport = await TransportNodeHid.create();
      await setup(true);
    });

    it('Verify that LedgerSigner is instantiable with default parameters', () => {
      expect(
        new LedgerSigner(
          transport
        )
      ).toBeInstanceOf(LedgerSigner);
    });

    it('Verify that LedgerSigner is instantiable with parameters', () => {
      expect(
        new LedgerSigner(
          transport,
          "44'/1729'/0'/0'",
          true,
          DerivationType.SECP256K1
        )
      ).toBeInstanceOf(LedgerSigner);
    });

    describe('Verify retrieving the public key from the Ledger', () => {
      it('Verify that Ledger will provide correct public key and public key hash for tz1 curve and default path', async () => {
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
      });

      it('Verify that Ledger will provide correct public key and public key hash for tz2 curve and default path', async () => {
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
      });

      it('Verify that that Ledger will provide correct public key and public key hash for tz3 curve and path having 1 as account value', async () => {
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
      });
    });

    describe('Verify signing operation with Ledger Device', () => {
      jest.setTimeout(30000);

      it('Verify that Ledger returns the correct signature', async () => {
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
      });
    })

    describe('Verify the use of a Ledger Device with contract api', () => {
      jest.setTimeout(240000)
      it('Verify that a contract can be originated with Ledger', async () => {

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
      });
    })

    describe('Verify the use of a Ledger Device with wallet api', () => {
      jest.setTimeout(120000)

      it('Verify signing and injecting a transaction with Ledger', async () => {
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
      });
    })

    describe('Verify that use of a ledger device works with bip32_ed25519', () => {
      jest.setTimeout(60000);
      it('Verify that the pk and pkh is correct', async () => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/1'/0'",
          false,
          DerivationType.BIP32_ED25519
        )
        const Tezos = new TezosToolkit(rpc);
        Tezos.setSignerProvider(signer);

        const pk = await Tezos.signer.publicKey();
        const pkh = await Tezos.signer.publicKeyHash();

        expect(pk).toEqual('edpkujVjFVJtb9Z1D7jpSpPMrKzdTRZSRT8E3L26T42vvA6VSv7jND');
        expect(pkh).toEqual('tz1UpizQ6AGjMeCZCLpuyuL4BSzoUC4XD1QE');

      })
    })

    describe('Verify bip32 signature', () => {
      jest.setTimeout(60000);
      it('Verify that the signature is correctly prefixed with originated contract', async () => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/1'/0'",
          false,
          DerivationType.BIP32_ED25519
        )
        const Tezos = new TezosToolkit(rpc);
        Tezos.setSignerProvider(signer);

        const contractCode = rpcToForge.contents[0].script!
        const contract = await Tezos.contract.originate(contractCode)

        await contract.confirmation();
        expect(contract.status).toEqual('applied')

        expect(contract.raw.opOb.signature?.slice(0, 5)).toEqual('edsig')
      })

      jest.setTimeout(60000);
      it('Verify that the signature is correct with set forged payload', async () => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/1'/0'",
          false,
          DerivationType.BIP32_ED25519
        )
        const Tezos = new TezosToolkit(rpc);

        const forge = await localForger.forge(rpcToForge)
        const sig = await signer.sign(forge, new Uint8Array([3]))

        expect(sig.prefixSig).toEqual('edsigtfJQi7mj7Lxbt4pt9U8LG6YU9pCCjxqR6qWyhGGorZ1iWJBCd9Wvhg8mFJKZfqhRSEnKoTEAbxNXaUvMAUeXdNYDp2PC5K')
        expect(sig.bytes).toEqual('5a64ae05e0014c3a7936c2b09a51517116a1b1e47063319affade059baa45a7e6d0064beee4178338ea816d4e6e41eb7df5285b5fd318304b1e214fd0b990300000000007a02000000750500096500000008036803620394036e000000000501036c050202000000560316057a000403880342034c0655076505870368039400000008256465706f7369740200000015072f02000000090200000004034f03270200000000034c0743036a0000034c034d034f053d036d05700002031b034200000002030b')
      })
    })
  });
})

