import { CONFIGS } from "./config";
import { miStr } from '../packages/taquito/test/contract/data';
import { importKey } from "@taquito/signer";

CONFIGS().forEach(({ lib, rpc }) => {
    const Tezos = lib;

    describe(`Test origination of a token contract using: ${rpc}`, () => {

        beforeEach(async (done) => {
            // temporary while the key gen doesn't use Taquito v8
            await importKey(
                Tezos,
                'hsvioapt.qnigdfsz@tezos.example.org',
                'OOq9TlNAOX',
                [
                    "midnight",
                    "assault",
                    "zebra",
                    "nothing",
                    "myself",
                    "voice",
                    "suggest",
                    "behind",
                    "maid",
                    "fluid",
                    "trend",
                    "wash",
                    "outside",
                    "amused",
                    "case"
                ].join(' '),
                'aca91c0c576d60fda823e30ff1ea6e5cca1b2036'
            );
            done()
        })

        test('Originates a contract which contains UNPAIR', async (done) => {
            const op = await Tezos.contract.originate({
                code: miStr,
                init: '(Pair 0 "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn")'
            });

            await op.confirmation();
            expect(op.hash).toBeDefined();

            const contract = await op.contract();
            console.log('contract', contract.address);

            done();
        });



    });
})
