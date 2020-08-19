import { LedgerSigner, LedgerTransport, DerivationType } from '../packages/taquito-ledger-signer/src/taquito-ledger-signer';
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { Tezos } from '@taquito/taquito';
import { ligoSample } from "./data/ligo-simple-contract";

/**
 * LedgerSigner test
 * 
 * Set up your Ledger device with this mnemonic to run this test file and remove " "testPathIgnorePatterns": ["./ledger-signer.spec.ts"] " from package.json.
 * 1. episode
 * 2. capital
 * 3. clerk
 * 4. vanish
 * 5. goat
 * 6. result
 * 7. scan
 * 8. phrase
 * 9. air
 * 10. float
 * 11. shoot
 * 12. nasty
 * 13. wreck
 * 14. safe
 * 15. parade
 * 16. south
 * 17. outside
 * 18. urban
 * 19. bounce
 * 20. art
 * 21. boil
 * 22. mix
 * 23. front
 * 24. security
 */
describe('LedgerSigner test', () => {
  let transport: LedgerTransport;

  beforeEach(async () => {
    transport =  await TransportNodeHid.create();
  });

  it('RemoteSigner is instantiable with default parameters', () => {
    expect(
      new LedgerSigner(
        transport
      )
    ).toBeInstanceOf(LedgerSigner);
  });

  it('RemoteSigner is instantiable with parameters', () => {
    expect(
      new LedgerSigner(
        transport,
        "44'/1729'/0'/0'/0'", 
        true, 
        DerivationType.tz2
      )
    ).toBeInstanceOf(LedgerSigner);
  });

  describe('Get the public key', () => {
    it('Should get the right public key and public key hash of the Ledger for tz1 curve when index of path is 0', async (done) => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/0'/0'/0'", 
          false, 
          DerivationType.tz1
        );
        const pk = await signer.publicKey();
        const pkh = await signer.publicKeyHash();
        expect(pk).toEqual(
          'edpktgyU5HvdQbXSbYMCMUeQvFuFKuAmfqXSMdqSBPJpqGTphs6yNb'
        );
        expect(pkh).toEqual(
          'tz1XMxuGdfC6BjQHkW3PumWtMcy4qeMj8nqW'
        );
        done();
      });

      it('Should get the right public key and public key hash of the Ledger for tz2 curve when index of path is 0', async (done) => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/0'/0'/0'", 
          false, 
          DerivationType.tz2
        );
        const pk = await signer.publicKey();
        const pkh = await signer.publicKeyHash();
        expect(pk).toEqual(
          'sppk7ZyfL4gibJ8uB8SFYx2Tcebbq9acai5zqDm3WjWTN5fG8oS7s1a'
        );
        expect(pkh).toEqual(
          'tz2JWNkgLcVhFTswedDL3XoYCzUbwqogVaH7'
        );
        done();
      });

      it('Should get the right public key and public key hash of the Ledger for tz3 curve when index of path is 0', async (done) => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/0'/0'/0'", 
          false, 
          DerivationType.tz3
        );
        const pk = await signer.publicKey();
        const pkh = await signer.publicKeyHash();
        expect(pk).toEqual(
          'p2pk66rRf1SioA7ExRs7bkC84x8GaB8TQZDGM5Lv8h2nnfaLDMYygne'
        );
        expect(pkh).toEqual(
          'tz3Vr7uy6ncpTBbqd7ptS8YXZWPrWrrVafKZ'
        );
        done();
      });
    });
      
      describe('Should sign operation with Ledger', () => {
        jest.setTimeout(30000);
        it('Should returned the right signature with the Ledger', async (done) => {
          const signer = new LedgerSigner(
            transport,
            "44'/1729'/0'/0'/0'", 
            false, 
            DerivationType.tz1
          );
          const signed = await signer.sign(
            '030368110e29f26373bb4c14b65c026cd88c08a64db67ebb881e7edcc90430d3396c008097b09b3bfdd573ca638ca83ee62cc80a7f4adbe80aab9c60c3500ae8070000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c00'
          );
          expect(signed).toEqual({ 
            bytes:
                '030368110e29f26373bb4c14b65c026cd88c08a64db67ebb881e7edcc90430d3396c008097b09b3bfdd573ca638ca83ee62cc80a7f4adbe80aab9c60c3500ae8070000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c00',
            sig:
                'sigibTrJxrL4ncz5Vxdyh8aFAQkWzagYstUb61iFKVA9FovpH52qiWgXeR1NHDBwtb12kge1QiH9qb1wCujqZUeNXfcPURNz',
            prefixSig:
                'sigibTrJxrL4ncz5Vxdyh8aFAQkWzagYstUb61iFKVA9FovpH52qiWgXeR1NHDBwtb12kge1QiH9qb1wCujqZUeNXfcPURNz',
            sbytes:
                '030368110e29f26373bb4c14b65c026cd88c08a64db67ebb881e7edcc90430d3396c008097b09b3bfdd573ca638ca83ee62cc80a7f4adbe80aab9c60c3500ae8070000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c009d81b67d88a7bb98628862c4f4ef3870f9016f14af39c8eeaa2a7e34dca37bfced2985c327654ae1355fbe52cbfe89660578f4d328998a8aa84c192f0c51cc0f' 
          });
          done();
        });
  })

  describe('Should be abble to use Ledger with contract API', () => {
    jest.setTimeout(60000)
    it('Should originate contract with Ledger', async (done) => {
      const signer = new LedgerSigner(
        transport,
        "44'/1729'/0'/0'/0'", 
        false, 
        DerivationType.tz1
      );
      Tezos.setProvider({ rpc: 'https://api.tez.ie/rpc/carthagenet', signer: signer });
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

describe('Should be abble to used Ledger with wallet API', () => {
    jest.setTimeout(60000)

    it('Should sign and inject transaction with Ledger', async (done) => {
        const signer = new LedgerSigner(
          transport,
          "44'/1729'/0'/0'/0'", 
          false, 
          DerivationType.tz1
        );
        Tezos.setProvider({ rpc: 'https://api.tez.ie/rpc/carthagenet', signer: signer });
        const op = await Tezos.wallet.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.1 }).send()
      await op.confirmation()
      expect(op.opHash).toBeDefined();
      done();
      });
})
});
