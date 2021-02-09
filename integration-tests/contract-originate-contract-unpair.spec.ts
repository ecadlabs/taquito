import { CONFIGS } from './config';
import { miStr, miObject } from './data/contractWithUnpair';
import { importKey } from '@taquito/signer';
import { Protocols } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, protocol }) => {
    const Tezos = lib;

    describe(`Test origination of a token contract using: ${rpc}`, () => {
        beforeEach(async (done) => {
            // temporary while the key gen doesn't use Taquito v8
            await importKey(
                Tezos,
                'hsvioapt.qnigdfsz@tezos.example.org',
                'OOq9TlNAOX',
                [
                    'midnight',
                    'assault',
                    'zebra',
                    'nothing',
                    'myself',
                    'voice',
                    'suggest',
                    'behind',
                    'maid',
                    'fluid',
                    'trend',
                    'wash',
                    'outside',
                    'amused',
                    'case'
                ].join(' '),
                'aca91c0c576d60fda823e30ff1ea6e5cca1b2036'
            );
            done();
        });

        test('Originates a contract having UNPAIR with code and init in Michelson', async (done) => {
            const op = await Tezos.contract.originate({
                code: miStr,
                init: '(Pair 0 "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn")'
            });

            await op.confirmation();
            expect(op.hash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            if (protocol === Protocols.PtEdoTez) {
                expect(instUnpair).toBeDefined();
            } else {
                expect(instUnpair).toBeUndefined();
            }

            done();
        });

        test('Originates a contract having UNPAIR with code in Michelson and init in JSON Michelson', async (done) => {
            const op = await Tezos.contract.originate({
                code: miStr,
                init: { prim: 'Pair', args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }] }
            });

            await op.confirmation();
            expect(op.hash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            if (protocol === Protocols.PtEdoTez) {
                expect(instUnpair).toBeDefined();
            } else {
                expect(instUnpair).toBeUndefined();
            }

            done();
        });

        test('Originates a contract having UNPAIR with code in Michelson and storage', async (done) => {
            const op = await Tezos.contract.originate({
                code: miStr,
                storage: {
                    0: '0',
                    1: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
                }
            });

            await op.confirmation();
            expect(op.hash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            if (protocol === Protocols.PtEdoTez) {
                expect(instUnpair).toBeDefined();
            } else {
                expect(instUnpair).toBeUndefined();
            }

            done();
        });

        test('Originates a contract having UNPAIR with code in JSON Michelson and init in Michelson', async (done) => {
            const op = await Tezos.contract.originate({
                code: miObject,
                init: '(Pair 0 "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn")'
            });

            await op.confirmation();
            expect(op.hash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            if (protocol === Protocols.PtEdoTez) {
                expect(instUnpair).toBeDefined();
            } else {
                expect(instUnpair).toBeUndefined();
            }

            done();
        });

        test('Originates a contract having UNPAIR with code and init in JSON Michelson', async (done) => {
            const op = await Tezos.contract.originate({
                code: miObject,
                init: { prim: 'Pair', args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }] }
            });

            await op.confirmation();
            expect(op.hash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            if (protocol === Protocols.PtEdoTez) {
                expect(instUnpair).toBeDefined();
            } else {
                expect(instUnpair).toBeUndefined();
            }

            done();
        });

        test('Originates a contract having UNPAIR with code in JSON Michelson and storage', async (done) => {
            const op = await Tezos.contract.originate({
                code: miObject,
                storage: {
                    0: '0',
                    1: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
                }
            });

            await op.confirmation();
            expect(op.hash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            if (protocol === Protocols.PtEdoTez) {
                expect(instUnpair).toBeDefined();
            } else {
                expect(instUnpair).toBeUndefined();
            }

            done();
        });
    });
});
