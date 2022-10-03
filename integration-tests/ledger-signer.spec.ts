import { CONFIGS } from './config';
import { LedgerSigner, LedgerTransport, DerivationType } from '@taquito/ledger-signer';
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { ligoSample } from "./data/ligo-simple-contract";
import { TezosToolkit } from '@taquito/taquito';

// PLEASE NOTE MAY NEED TO TEST ONE TEST AT A TIME

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

    beforeEach(async (done) => {
      transport = await TransportNodeHid.create();
      await setup(true);
      done();
    });

    // it('Verify that LedgerSigner is instantiable with default parameters', () => {
    //   expect(
    //     new LedgerSigner(
    //       transport
    //     )
    //   ).toBeInstanceOf(LedgerSigner);
    // });

    // it('Verify that LedgerSigner is instantiable with parameters', () => {
    //   expect(
    //     new LedgerSigner(
    //       transport,
    //       "44'/1729'/0'/0'",
    //       true,
    //       DerivationType.SECP256K1
    //     )
    //   ).toBeInstanceOf(LedgerSigner);
    // });

    // describe('Verify retrieving the public key from the Ledger', () => {

    //   it('Verify that Ledger will provide correct public key and public key hash for tz1 curve and default path', async (done) => {
    //     const signer = new LedgerSigner(
    //       transport,
    //       "44'/1729'/0'/0'",
    //       false,
    //       DerivationType.ED25519
    //     );
    //     const pk = await signer.publicKey();
    //     const pkh = await signer.publicKeyHash();
    //     expect(pk).toEqual(
    //       'edpkuRkcStobJ569XFxmE6edyRQQzMmtf4ZnmPkTPfSQnt6P3Nym2V'
    //     );
    //     expect(pkh).toEqual(
    //       'tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY'
    //     );
    //     done();
    //   });

    //   it('Verify that Ledger will provide correct public key and public key hash for tz2 curve and default path', async (done) => {
    //     const signer = new LedgerSigner(
    //       transport,
    //       "44'/1729'/0'/0'",
    //       false,
    //       DerivationType.SECP256K1
    //     );
    //     const pk = await signer.publicKey();
    //     const pkh = await signer.publicKeyHash();
    //     expect(pk).toEqual(
    //       'sppk7ZMM9NZLPPueTKcoJobdUG7MjLtaGsdrZqddcn9U6C9Yt99m8sU'
    //     );
    //     expect(pkh).toEqual(
    //       'tz2SxDTGnT3mHzaHf6mwy6Wtw1qUX1hzm1Sw'
    //     );
    //     done();
    //   });

    //   it('Verify that that Ledger will provide correct public key and public key hash for tz3 curve and path having 1 as account value', async (done) => {
    //     const signer = new LedgerSigner(
    //       transport,
    //       "44'/1729'/1'/0'",
    //       false,
    //       DerivationType.P256
    //     );
    //     const pk = await signer.publicKey();
    //     const pkh = await signer.publicKeyHash();
    //     expect(pk).toEqual(
    //       'p2pk66MZ9MuDHfn5cQsUvtCvU376cijjvDLtTQzBFNeDHMijG4snUZZ'
    //     );
    //     expect(pkh).toEqual(
    //       'tz3PX4M9x9N7oXp2WWxNcQNK6GtaGdCdesK9'
    //     );
    //     done();
    //   });
    // });

    // describe('Verify signing operation with Ledger Device', () => {

    //   jest.setTimeout(30000);

    //   it('Verify that Ledger returns the correct signature', async (done) => {
    //     const signer = new LedgerSigner(
    //       transport,
    //       "44'/1729'/0'/0'",
    //       false,
    //       DerivationType.ED25519
    //     );
    //     const signed = await signer.sign(
    //       '03281e35275248696304421740804c13f1434162474ee9449f70fb0f02cfd178f26c00c9fc72e8491bd2973e196f04ec6918ad5bcee22daa0abeb98d01c35000c09a0c0000eadc0855adb415fa69a76fc10397dc2fb37039a000'
    //     );
    //     expect(signed).toEqual({
    //       bytes:
    //         '03281e35275248696304421740804c13f1434162474ee9449f70fb0f02cfd178f26c00c9fc72e8491bd2973e196f04ec6918ad5bcee22daa0abeb98d01c35000c09a0c0000eadc0855adb415fa69a76fc10397dc2fb37039a000',
    //       sig:
    //         'sigsKFbsguu6KmUyVbarrdZiqzF94zaaQh3GWu2gXE5sEdQQbq6RFbmfo8GeC4eFLtzzwEUidf1iSX6xYARMsF8d48HAxQv9',
    //       prefixSig:
    //         'edsigu38iivupB2WoYAUtithpX28W1y9vZDHHQxGdm2XD6DFaiEYRbKAgrj33KEorjiXFSYQrQER1rLQHqkaN5WDDKg8E9QHvNZ',
    //       sbytes:
    //         '03281e35275248696304421740804c13f1434162474ee9449f70fb0f02cfd178f26c00c9fc72e8491bd2973e196f04ec6918ad5bcee22daa0abeb98d01c35000c09a0c0000eadc0855adb415fa69a76fc10397dc2fb37039a000e029a32d628fe101d9c07f82bfd34c86c0b04ee7e3bbe317420ea098944464f18d701857c42fae94ff81bfaf838b6c16df1188ca462bd78b5dd1a2b7371f3108'
    //     });
    //     done();
    //   });
    // })

    // describe('Verify the use of a Ledger Device with contract api', () => {
    //   jest.setTimeout(240000)
    //   it('Verify that a contract can be originated with Ledger', async (done) => {

    //     const fundAccountFirst = await tezos.contract.transfer({ to: 'tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY', amount: 9 });
    //     await fundAccountFirst.confirmation();

    //     const signer = new LedgerSigner(
    //       transport,
    //       "44'/1729'/0'/0'",
    //       false,
    //       DerivationType.ED25519
    //     );
    //     const Tezos = new TezosToolkit(rpc);
    //     Tezos.setSignerProvider(signer);
    //     const op = await Tezos.contract.originate({
    //       balance: "1",
    //       code: ligoSample,
    //       storage: 0,
    //     })
    //     await op.confirmation()
    //     expect(op.hash).toBeDefined();
    //     expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY)
    //     done();
    //   });
    // })

    // describe('Verify the use of a Ledger Device with wallet api', () => {
    //   jest.setTimeout(120000)

    //   it('Verify signing and injecting a transaction with Ledger', async (done) => {
    //     const signer = new LedgerSigner(
    //       transport,
    //       "44'/1729'/0'/0'",
    //       false,
    //       DerivationType.ED25519
    //     );
    //     const Tezos = new TezosToolkit(rpc);
    //     Tezos.setSignerProvider(signer);
    //     const op = await Tezos.wallet.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.1 }).send()
    //     await op.confirmation()
    //     expect(op.opHash).toBeDefined();
    //     done();
    //   });
    // })

    // describe('Verify that use of a ledger device works with bip32', () => {
    //   jest.setTimeout(60000);
    //   it('Verify that the pk is correct', async (done) => {
    //     const signer = new LedgerSigner(
    //       transport,
    //       "44'/1729'/1'/0'",
    //       false,
    //       DerivationType.BIP32_ED25519
    //     )
    //     const Tezos = new TezosToolkit(rpc);
    //     Tezos.setSignerProvider(signer);
    //     const pk = await Tezos.signer.publicKey();
    //     expect(pk).toEqual('edpkujVjFVJtb9Z1D7jpSpPMrKzdTRZSRT8E3L26T42vvA6VSv7jND');
    //     done();
    //   })
    // })

    describe('Verify that use of a ledger device works with bip32', () => {
      // jest.setTimeout(60000);
      // it('Verify that the pk and pkh is correct', async (done) => {
      //   const signer = new LedgerSigner(
      //     transport,
      //     "44'/1729'/1'/0'",
      //     false,
      //     DerivationType.BIP32_ED25519
      //   )
      //   const Tezos = new TezosToolkit(rpc);
      //   Tezos.setSignerProvider(signer);

      //   const pk = await Tezos.signer.publicKey();
      //   const pkh = await Tezos.signer.publicKeyHash();
      //   // const sig = await Tezos.signer.sign("BL7TGGZCKHyz6SpZcEPF6ii3BVJquMMuabKtt8VFqYCocdVgntq")

      //   expect(pk).toEqual('edpkujVjFVJtb9Z1D7jpSpPMrKzdTRZSRT8E3L26T42vvA6VSv7jND');
      //   expect(pkh).toEqual('tz1UpizQ6AGjMeCZCLpuyuL4BSzoUC4XD1QE');
      //   // expect(sig).toEqual('edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q')


      //   done();
      // })
      jest.setTimeout(60000);
      it('Verify that the signature is correct', async (done) => {
          const signer = new LedgerSigner(
            transport,
            "44'/1729'/1'/0'",
            false,
            DerivationType.BIP32_ED25519
            )
            const Tezos = new TezosToolkit(rpc);
            await Tezos.setSignerProvider(signer);
            const key = await Tezos.signer.publicKeyHash()
            // expect(key).toEqual('')

            // expect(signer).toEqual({})

            const contract = await Tezos.contract.originate({
              code: `parameter (pair string nat tx_rollup_l2_address address);
              storage unit;
              code {
                CAR;
                UNPAIR 4;
                TICKET;
                PAIR;
                SWAP;
                CONTRACT %deposit (pair (ticket string) tx_rollup_l2_address);
                 ASSERT_SOME;
                 SWAP;
                 PUSH mutez 0;
                 SWAP;
                 TRANSFER_TOKENS;
                 UNIT;
                 NIL operation;
                 DIG 2;
                 CONS;
                 PAIR;
                };`,
                init: 'Unit'
              })

        done();
      })
    })

  });
})
