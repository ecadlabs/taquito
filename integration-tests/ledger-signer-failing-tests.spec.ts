import { CONFIGS } from './config';
import { LedgerSigner, LedgerTransport, DerivationType } from '../packages/taquito-ledger-signer/src/taquito-ledger-signer';
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { ligoSample } from "./data/ligo-simple-contract";

/**
 * LedgerSigner failing test
 *
 */

CONFIGS().forEach(({ lib, setup }) => {
    const tezos = lib;

    describe('Test LedgerSigner declining operations to verify that Ledger throw a proper error', () => {
        let transport: LedgerTransport;

        beforeEach(async (done) => {
            transport = await TransportNodeHid.create();
            await setup();
            done();
        });

        describe('Test to verify that user can decline all prompts on the ledger device', () => {
            it('As a User I want to verify that Ledger will throw an error when I declined to provide public key', async (done) => {
                const signer = new LedgerSigner(
                    transport,
                    "44'/1729'/0'/0'",
                    true,
                    DerivationType.ED25519
                );
                try {
                    await signer.publicKey();
                }
                catch (error: any) {
                    expect(error.message).toBe(`Unable to retrieve public key`);
                }
                done();
            });

            it('As a User I want to verify that Ledger will throw an error when I declined to sign', async (done) => {
                const signer = new LedgerSigner(
                    transport,
                    "44'/1729'/0'/0'",
                    false,
                    DerivationType.ED25519
                );
                try {
                    const signed = await signer.sign(
                        '030368110e29f26373bb4c14b65c026cd88c08a64db67ebb881e7edcc90430d3396c008097b09b3bfdd573ca638ca83ee62cc80a7f4adbe80aab9c60c3500ae8070000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c00'
                    );
                }
                catch (error: any) {
                    expect(error.message).toBe("Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)")
                }
                done();
            });

            describe('Test that Ledger can be used with wallet API', () => {
                jest.setTimeout(60000)
                it('SAs a User I want to verify that Ledger will throw an error when I declined to originate contract with Ledger\n', async (done) => {
                    const signer = new LedgerSigner(
                        transport,
                        "44'/1729'/0'/0'",
                        false,
                        DerivationType.ED25519
                    );
                    tezos.setSignerProvider(signer);
                    try {
                        const op = await tezos.wallet.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.1 }).send()
                        await op.confirmation()
                    }
                    catch (error: any) {
                        expect(error.message).toBe("Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)")
                    }
                    done();
                });
            });

            describe('Should be abble to use Ledger with contract API', () => {
                jest.setTimeout(60000)
                it('Should throw error when user declines to originate contract with Ledger', async (done) => {
                    const signer = new LedgerSigner(
                        transport,
                        "44'/1729'/0'/0'",
                        false,
                        DerivationType.ED25519
                    );
                    tezos.setSignerProvider(signer);
                    try {
                        const op = await tezos.contract.originate({
                            balance: "1",
                            code: ligoSample,
                            storage: 0,
                        })
                        await op.confirmation()
                    }
                    catch (error: any) {
                        expect(error.message).toBe("Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)")
                    }
                    done();
                });
            })
        });
    });
});
