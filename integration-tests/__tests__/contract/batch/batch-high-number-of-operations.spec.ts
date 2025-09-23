import { CONFIGS } from '../../../config';
import { b58Encode, PrefixV2 } from '@taquito/utils';
import { InMemorySigner } from '@taquito/signer';
const crypto = require('crypto');

// This test is skipped on Flextesa due to the high number of operations taking too long to resolve in the sandbox
CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;

    describe(`Test contract.batch containing a high number of operations through contract api using: ${rpc}`, () => {
        beforeEach(async () => {
            await setup(true);
        });

        it('Verify contract.batch with 150 operations', async () => {
            const dests: { key: string, pkh: string }[] = [];
            const batchSize = 150;

            for (let i = 0; i < batchSize; i++) {
                const keyBytes = Buffer.alloc(32);
                crypto.randomFillSync(keyBytes)

                const key = b58Encode(new Uint8Array(keyBytes), PrefixV2.Secp256k1SecretKey);
                const pkh = await new InMemorySigner(key).publicKeyHash();
                dests.push({ key, pkh });
            }

            const batch = Tezos.contract.batch()
            dests.forEach(({ pkh }) => {
                batch.withTransfer({ to: pkh, amount: 0.001 });
            })

            const op = await batch.send();
            await op.confirmation(1, 300);

            expect(op.status).toEqual('applied');
        });
    });
});
