import { WalletConnect2 } from '../src/taquito-wallet-connect-2';

describe('Wallet connect 2 tests', () => {
    const fakeClient = {
        on: () => { 
            // Do nothing
        }
    };

    it('Verify that WalletConnect2 is instantiable', async () => {
        expect(new WalletConnect2(fakeClient as any)).toBeInstanceOf(WalletConnect2);
    });

});
