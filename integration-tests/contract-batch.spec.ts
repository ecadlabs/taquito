import { CONFIGS } from './config';
import { ligoSample, ligoSampleMichelson } from './data/ligo-simple-contract';
import { managerCode } from './data/manager_code';
import { MANAGER_LAMBDA, OpKind } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, knownContract, createAddress }) => {
    const Tezos = lib;
    const test = require('jest-retries');
    describe(`Test contract.batch using: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup();
            done();
        });
        test('Verify contract.batch simple transfers with origination code in JSON Michelson format', 2, async (done: () => void) => {
            const batch = Tezos.contract
                .batch()
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                .withOrigination({
                    balance: '1',
                    code: ligoSample,
                    storage: 0
                });

            const op = await batch.send();
            await op.confirmation();
            expect(op.status).toEqual('applied');
            done();
        });

        test('Verify contract.batch simple transfers with origination code in Michelson format', 2, async (done: () => void) => {
            const batch = Tezos.contract
                .batch()
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                .withOrigination({
                    balance: '1',
                    code: ligoSampleMichelson,
                    storage: 0
                });

            const op = await batch.send();
            await op.confirmation();
            expect(op.status).toEqual('applied');
            done();
        });

        test('Verify contract.batch simple transfers with origination', 2, async (done: () => void) => {
            const op = await Tezos.contract.batch([
                {
                    kind: OpKind.TRANSACTION,
                    to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                    amount: 2
                },
                {
                    kind: OpKind.ORIGINATION,
                    balance: "1",
                    code: ligoSample,
                    storage: 0,
                }
            ])
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                .send();
            await op.confirmation();
            expect(op.status).toEqual('applied')
            done();
        })

        test('Verify handling of contract.batch simple transfers with bad origination', 2, async (done: () => void) => {
            expect.assertions(1);
            try {
                await Tezos.contract
                    .batch()
                    .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                    .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                    .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
                    .withOrigination({
                        balance: '1',
                        code: ligoSample,
                        storage: 0,
                        storageLimit: 0
                    })
                    .send();
            } catch (ex) {
                expect(ex).toEqual(
                    expect.objectContaining({
                        message: expect.stringContaining('storage_exhausted.operation')
                    })
                );
            }
            done();
        });

        test('Verify contract.batch simple transfers from an account with low balance', 2, async (done: () => void) => {
            const LocalTez = await createAddress();
            const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 });
            await op.confirmation();

            const contract = await Tezos.contract.at(knownContract);

            const batchOp = await LocalTez.contract
                .batch([
                    {
                        kind: OpKind.TRANSACTION,
                        to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                        amount: 1
                    },
                    {
                        kind: OpKind.ORIGINATION,
                        balance: '0',
                        code: ligoSample,
                        storage: 0
                    }
                ])
                .send();
            await batchOp.confirmation();
            expect(op.status).toEqual('applied');
            done();
        });

        test('Verify contract.batch simple transfers with chained contract calls', 2, async (done: () => void) => {
            const op = await Tezos.contract.originate({
                balance: '1',
                code: managerCode,
                init: { string: await Tezos.signer.publicKeyHash() }
            });

            const contract = await op.contract();
            expect(op.status).toEqual('applied');

            const batch = Tezos.contract
                .batch()
                .withTransfer({ to: contract.address, amount: 1 })
                .withContractCall(
                    contract.methods.do(MANAGER_LAMBDA.transferImplicit('tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh', 50))
                )
                .withContractCall(contract.methods.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
                .withContractCall(contract.methods.do(MANAGER_LAMBDA.removeDelegate()));

            const batchOp = await batch.send();

            await batchOp.confirmation();

            expect(batchOp.status).toEqual('applied');
            done();
        });

        test('Verify contract.batch with contract.method call', 2, async (done: () => void) => {
            const contract = await Tezos.contract.at(knownContract);
            const batchOp = await Tezos.contract
                .batch([
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
                    { kind: OpKind.TRANSACTION, ...contract.methods.default([['Unit']]).toTransferParams() }
                ])
                .send();

            await batchOp.confirmation();

            expect(batchOp.status).toEqual('applied');
            done();
        });
    });
});
