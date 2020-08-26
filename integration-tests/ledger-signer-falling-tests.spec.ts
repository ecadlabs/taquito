import { LedgerSigner, LedgerTransport, DerivationType } from '../packages/taquito-ledger-signer/src/taquito-ledger-signer';
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { Tezos } from '@taquito/taquito';
import { ligoSample } from "./data/ligo-simple-contract";

/**
 * LedgerSigner falling test
 * 
 */
describe('LedgerSigner falling test', () => {
    let transport: LedgerTransport;
    
    beforeEach(async () => {
        transport =  await TransportNodeHid.create();
    });
    
    describe('Tests where user declines all prompts on the ledger device', () => {
        it('Should throw error when user declines to provide public key', async(done) => {
            const signer = new LedgerSigner(
                transport,
                "44'/1729'/0'/0'/0'", 
                true, 
                DerivationType.tz1
            );
            try {
                await signer.publicKey(); 
            }
            catch (error) {
                expect(error.message).toBe(`Unable to retrieve public key`);
            }
            done();
        });
    
        it('Should throw error when user declines to sign', async (done) => {
            const signer = new LedgerSigner(
                transport,
                "44'/1729'/0'/0'/0'", 
                false, 
                DerivationType.tz1
            );
            try {
                const signed = await signer.sign(
                    '030368110e29f26373bb4c14b65c026cd88c08a64db67ebb881e7edcc90430d3396c008097b09b3bfdd573ca638ca83ee62cc80a7f4adbe80aab9c60c3500ae8070000b24ac1e1759565d5c9b69af8450ce7ea3d1ee64c00'
                );
            }
            catch (error) {
                expect(error.message).toBe("Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)")
            }
            done();
        });

        describe('Should be abble to used Ledger with wallet API', () => {
            jest.setTimeout(60000)
            it('Should throw error when user declines transaction with Ledger', async (done) => {
                const signer = new LedgerSigner(
                    transport,
                    "44'/1729'/0'/0'/0'", 
                    false, 
                    DerivationType.tz1
                );
                Tezos.setProvider({ rpc: 'https://api.tez.ie/rpc/carthagenet', signer: signer });
                try {
                    const op = await Tezos.wallet.transfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.1 }).send()
                    await op.confirmation()
                } 
                catch (error) {
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
                    "44'/1729'/0'/0'/0'", 
                    false, 
                    DerivationType.tz1
                );
                Tezos.setProvider({ rpc: 'https://api.tez.ie/rpc/carthagenet', signer: signer });
                try {
                    const op = await Tezos.contract.originate({
                        balance: "1",
                        code: ligoSample,
                        storage: 0,
                    })
                    await op.confirmation()
                }
                catch (error) {
                    expect(error.message).toBe("Ledger device: Condition of use not satisfied (denied by the user?) (0x6985)")
                }
                done();
            });
        })
    });
});
