import { CONFIGS } from './config';
import { miStr, miObject } from './data/contractWithUnpair';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    const test = require('jest-retries');

    describe(`Test origination of a token contract using: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup();
            done();
        });

        test('Originates a contract having UNPAIR with code and init in Michelson', 2, async (done: () => void) => {
            const op = await Tezos.wallet.originate({
                code: miStr,
                init: '(Pair 0 "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn")'
            }).send();

            await op.confirmation();
            expect(op.opHash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            expect(instUnpair).toBeDefined();
            done();
        });

        test('Originates a contract having UNPAIR with code in Michelson and init in JSON Michelson', 2, async (done: () => void) => {
            const op = await Tezos.wallet.originate({
                code: miStr,
                init: { prim: 'Pair', args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }] }
            }).send();

            await op.confirmation();
            expect(op.opHash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            expect(instUnpair).toBeDefined();
            done();
        });

        test('Originates a contract having UNPAIR with code in Michelson and storage', 2, async (done: () => void) => {
            const op = await Tezos.wallet.originate({
                code: miStr,
                storage: {
                    0: '0',
                    1: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
                }
            }).send();

            await op.confirmation();
            expect(op.opHash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            expect(instUnpair).toBeDefined();
            done();
        });

        test('Originates a contract having UNPAIR with code in JSON Michelson and init in Michelson', 2, async (done: () => void) => {
            const op = await Tezos.wallet.originate({
                code: miObject,
                init: '(Pair 0 "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn")'
            }).send();

            await op.confirmation();
            expect(op.opHash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            expect(instUnpair).toBeDefined();
            done();
        });

        test('Originates a contract having UNPAIR with code and init in JSON Michelson', 2, async (done: () => void) => {
            const op = await Tezos.wallet.originate({
                code: miObject,
                init: { prim: 'Pair', args: [{ int: '0' }, { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }] }
            }).send();

            await op.confirmation();
            expect(op.opHash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            expect(instUnpair).toBeDefined();
            done();
        });

        test('Originates a contract having UNPAIR with code in JSON Michelson and storage', 2, async (done: () => void) => {
            const op = await Tezos.wallet.originate({
                code: miObject,
                storage: {
                    0: '0',
                    1: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'
                }
            }).send();

            await op.confirmation();
            expect(op.opHash).toBeDefined();

            const contract = await op.contract();

            const code: any = contract.script.code.find((x: any) => x.prim === 'code');
            const instUnpair = code.args[0].find((x: any) => x.prim === 'UNPAIR');

            expect(instUnpair).toBeDefined();
            done();
        });
    });
});
