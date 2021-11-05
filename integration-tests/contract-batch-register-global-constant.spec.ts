import { CONFIGS } from './config';
import { OpKind, Protocols } from '@taquito/taquito';
const crypto = require('crypto');

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
    const Tezos = lib;
    const hangzhounet = protocol === Protocols.PtHangzH ? test : test.skip;

    describe(`Test contract.batch to register global constant using: ${rpc}`, () => {
        const randomAnnots = () => crypto.randomBytes(3).toString('hex');
        beforeEach(async (done) => {
            await setup(true);
            done();
        });

        hangzhounet('Batch transfer and register global constant operations', async (done) => {
            const batchOp = await Tezos.contract
                .batch([
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
                    {
                        kind: OpKind.REGISTER_GLOBAL_CONSTANT,
                        value: {
                            prim: 'list',
                            args: [{ prim: 'nat' }],
                            annots: [`%${randomAnnots()}`]
                        }
                    }
                ])
                .with([
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
                    {
                        kind: OpKind.REGISTER_GLOBAL_CONSTANT,
                        value: {
                            prim: 'int',
                            args: [{ int: '123456' }],
                            annots: [`%${randomAnnots()}`]
                        }
                    }
                ])
                .withRegisterGlobalConstant({
                    value: {
                        prim: 'pair',
                        args: [
                            {
                                prim: 'pair',
                                args: [{ prim: 'address', annots: ['%0'] }, { prim: 'address', annots: ['%1'] }]
                            },
                            { prim: 'contract', args: [{ prim: 'nat' }], annots: ['%2'] }
                        ],
                        annots: [`%${randomAnnots()}`]
                    }
                })
                .send();

            await batchOp.confirmation();

            expect(batchOp.status).toEqual('applied');
            expect(batchOp.results.length).toEqual(6);
            expect(batchOp.results[0].kind).toEqual(OpKind.REVEAL);
            expect(batchOp.results[1].kind).toEqual(OpKind.TRANSACTION);
            expect(batchOp.results[2].kind).toEqual(OpKind.REGISTER_GLOBAL_CONSTANT);
            expect(batchOp.results[3].kind).toEqual(OpKind.TRANSACTION);
            expect(batchOp.results[4].kind).toEqual(OpKind.REGISTER_GLOBAL_CONSTANT);
            expect(batchOp.results[5].kind).toEqual(OpKind.REGISTER_GLOBAL_CONSTANT);
            done();
        });
    });
});
