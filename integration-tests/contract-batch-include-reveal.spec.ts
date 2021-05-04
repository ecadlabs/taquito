import { OpKind } from '@taquito/taquito';
import { CONFIGS } from './config';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker }) => {
    const Tezos = lib;
    describe(`Test contract.batch using: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup(true);
            done();
        });
        it('Batch estimate including reveal', async (done) => {
            const batchOpEstimate = await Tezos.estimate
                .batch([
                    { kind: OpKind.DELEGATION, source: await Tezos.signer.publicKeyHash(), delegate: knownBaker },
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
                ], { includeRevealOperation:true })

            expect(batchOpEstimate.length).toEqual(3);
            done();
        });

        it('Batch estimate not including reveal fees', async (done) => {
            const batchOpEstimate = await Tezos.estimate
                .batch([
                    { kind: OpKind.DELEGATION, source: await Tezos.signer.publicKeyHash(), delegate: knownBaker },
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
                ])

            expect(batchOpEstimate.length).toEqual(2);
            done();
        });

        it('Batch estimate where includeRevealOperation is true but reveal is not needed', async (done) => {

            // do a reveal operation first
            const revealOp = await Tezos.contract.reveal({});
            await revealOp.confirmation();

            const batchOpEstimate = await Tezos.estimate
                .batch([
                    { kind: OpKind.DELEGATION, source: await Tezos.signer.publicKeyHash(), delegate: knownBaker },
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
                ], { includeRevealOperation: true })

            expect(batchOpEstimate.length).toEqual(2);
            done();
        });
    });
});