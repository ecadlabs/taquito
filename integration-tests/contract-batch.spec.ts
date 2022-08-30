import { CONFIGS } from './config';
import { ligoSample, ligoSampleMichelson } from './data/ligo-simple-contract';
import { managerCode } from './data/manager_code';
import { MANAGER_LAMBDA, OpKind } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, knownContract, createAddress }) => {
    const Tezos = lib;
<<<<<<< Updated upstream
    describe(`Test contract.batch using: ${rpc}`, () => {
=======

    describe(`Test contract.batch through contract api using: ${rpc}`, () => {
>>>>>>> Stashed changes
        beforeEach(async (done) => {
            await setup();
            done();
        });
<<<<<<< Updated upstream
        test('Simple transfers with origination (where the code in JSON Michelson format)', async (done) => {
=======
        test('Verify contract.batch simple transfers with origination code in JSON Michelson format',  async (done: () => void) => {
>>>>>>> Stashed changes
            const batch = Tezos.contract
                .batch()
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
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

<<<<<<< Updated upstream
        test('Simple transfers with origination (where the code in Michelson format)', async (done) => {
=======
        test('Verify contract.batch simple transfers with origination code in Michelson format', async (done: () => void) => {
>>>>>>> Stashed changes
            const batch = Tezos.contract
                .batch()
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
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

<<<<<<< Updated upstream
        test('Simple transfers with origination using with', async (done) => {
=======
        test('Verify batch of transfers and origination operation using a combination of the two notations (array of operation with kind mixed with withTransfer method)', async (done: () => void) => {
>>>>>>> Stashed changes
            const op = await Tezos.contract.batch([
                {
                    kind: OpKind.TRANSACTION,
                    to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                    amount: 0.02
                },
                {
                    kind: OpKind.ORIGINATION,
                    balance: "1",
                    code: ligoSample,
                    storage: 0,
                }
            ])
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
                .send();
            await op.confirmation();
            expect(op.status).toEqual('applied')
            done();
        })

<<<<<<< Updated upstream
        test('Simple transfers with bad origination', async (done) => {
=======
        test('Verify handling of contract.batch simple transfers with bad origination', async (done: () => void) => {
>>>>>>> Stashed changes
            expect.assertions(1);
            try {
                await Tezos.contract
                    .batch()
                    .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
                    .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
                    .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
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

<<<<<<< Updated upstream
        test('Test batch from account with low balance', async (done) => {
=======
        test('Verify transfer and origination for contract.batch simple transfers from an account with low balance', async (done: () => void) => {
>>>>>>> Stashed changes
            const LocalTez = await createAddress();
            const op = await Tezos.contract.transfer({ to: await LocalTez.signer.publicKeyHash(), amount: 2 });
            await op.confirmation();

            const contract = await Tezos.contract.at(knownContract);

            const batchOp = await LocalTez.contract
                .batch([
                    {
                        kind: OpKind.TRANSACTION,
                        to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                        amount: 0.01
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

<<<<<<< Updated upstream
        test('Chain contract calls', async (done) => {
=======
        test('Verify contract.batch simple transfers with chained contract calls', async (done: () => void) => {
>>>>>>> Stashed changes
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
                    contract.methods.do(MANAGER_LAMBDA.transferImplicit('tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh', 5))
                )
                .withContractCall(contract.methods.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
                .withContractCall(contract.methods.do(MANAGER_LAMBDA.removeDelegate()));

            const batchOp = await batch.send();

            await batchOp.confirmation();

            expect(batchOp.status).toEqual('applied');
            done();
        });

<<<<<<< Updated upstream
        test('Batch transfers and method call', async (done) => {
=======
        test('Verify contract.batch of simple transfers and a contract entrypoint call using the array notation with kind', async (done: () => void) => {
>>>>>>> Stashed changes
            const contract = await Tezos.contract.at(knownContract);
            const batchOp = await Tezos.contract
                .batch([
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
                    { kind: OpKind.TRANSACTION, ...contract.methods.default([['Unit']]).toTransferParams() }
                ])
                .send();

            await batchOp.confirmation();

            expect(batchOp.status).toEqual('applied');
            done();
        });

        test('Batch multiple originations and get contract address info from getOriginatedContractAddresses member function', async (done) => {
          const batch = Tezos.contract
              .batch()
              .withOrigination({
                balance: '1',
                code: ligoSample,
                storage: 0
              })
              .withOrigination({
                balance: '1',
                code: ligoSampleMichelson,
                storage: 0
              })
              
          const op = await batch.send();
          await op.confirmation();
          
          const addresses = op.getOriginatedContractAddresses();
          expect(op.status).toEqual('applied');
          expect(addresses.length).toEqual(2);
          done();
        })

    });
});
