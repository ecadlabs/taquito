import { CONFIGS } from './config';
import { ligoSample, ligoSampleMichelson } from './data/ligo-simple-contract';
import { managerCode } from './data/manager_code';
import { MANAGER_LAMBDA, OpKind } from '@taquito/taquito';

CONFIGS().forEach(({ lib, rpc, setup, knownContract, knownBaker, createAddress }) => {
    const Tezos = lib;
    
    describe(`Test wallet.batch using: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup();
            done();
        });

        test('Verify wallet.batch simple transfers with origination code in JSON Michelson format', async (done) => {
            const batch = Tezos.wallet
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
            const conf1 = await op.confirmation();
            const currentConf1 = await op.getCurrentConfirmation();

            expect(currentConf1).toEqual(1);
            expect(conf1).toEqual(
                expect.objectContaining({
                    expectedConfirmation: 1,
                    currentConfirmation: 1,
                    completed: true
                })
            );
            expect(op.opHash).toBeDefined();
            expect(await op.status()).toEqual('applied');
            done();
        });

        test('Verify wallet.batch simple transfers with origination code in Michelson format', async (done) => {
            const batch = Tezos.wallet
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
            const conf1 = await op.confirmation();
            const currentConf1 = await op.getCurrentConfirmation();

            expect(currentConf1).toEqual(1);
            expect(conf1).toEqual(
                expect.objectContaining({
                    expectedConfirmation: 1,
                    currentConfirmation: 1,
                    completed: true
                })
            );
            expect(op.opHash).toBeDefined();
            expect(await op.status()).toEqual('applied');
            done();
        });

        test('Verify wallet.batch simple transfers with origination', async (done) => {
            const op = await Tezos.wallet
                .batch([
                    {
                        kind: OpKind.TRANSACTION,
                        to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                        amount: 0.02
                    },
                    {
                        kind: OpKind.ORIGINATION,
                        balance: '1',
                        code: ligoSample,
                        storage: 0
                    }
                ])
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
                .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
                .send();

            const conf1 = await op.confirmation();
            const currentConf1 = await op.getCurrentConfirmation();

            expect(currentConf1).toEqual(1);
            expect(conf1).toEqual(
                expect.objectContaining({
                    expectedConfirmation: 1,
                    currentConfirmation: 1,
                    completed: true
                })
            );
            expect(op.opHash).toBeDefined();
            expect(await op.status()).toEqual('applied');
            done();
        });

        test('Verify wallet.batch simple transfers from an account with low balance', async (done) => {
            const LocalTez = await createAddress();
            const op = await Tezos.wallet.transfer({ to: await LocalTez.wallet.pkh(), amount: 2 }).send();
            await op.confirmation();

            const batchOp = await LocalTez.wallet
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

            expect(batchOp.opHash).toBeDefined();
            expect(await batchOp.status()).toEqual('applied');
            done();
        });

        test('Verify wallet.batch simple transfers with chained contract calls', async (done) => {
            const op = await Tezos.wallet
                .originate({
                    balance: '1',
                    code: managerCode,
                    init: { string: await Tezos.signer.publicKeyHash() }
                })
                .send();

            const contract = await op.contract();
            expect(await op.status()).toEqual('applied');

            const batch = Tezos.wallet
                .batch()
                .withTransfer({ to: contract.address, amount: 1 })
                .withContractCall(
                    contract.methods.do(MANAGER_LAMBDA.transferImplicit('tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh', 5))
                )
                .withContractCall(contract.methods.do(MANAGER_LAMBDA.setDelegate(knownBaker)))
                .withContractCall(contract.methods.do(MANAGER_LAMBDA.removeDelegate()));

            const batchOp = await batch.send();
            await batchOp.confirmation();
            const conf1 = await batchOp.confirmation();
            const currentConf1 = await batchOp.getCurrentConfirmation();

            expect(currentConf1).toEqual(1);
            expect(conf1).toEqual(
                expect.objectContaining({
                    expectedConfirmation: 1,
                    currentConfirmation: 1,
                    completed: true
                })
            );
            expect(batchOp.opHash).toBeDefined();
            expect(await batchOp.status()).toEqual('applied');
            done();
        });

        test('Verify wallet.batch with contract.method call', async (done) => {
            const contract = await Tezos.wallet.at(knownContract);
            const batch = await Tezos.wallet
                .batch([
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 },
                    { kind: OpKind.TRANSACTION, ...contract.methods.default([['Unit']]).toTransferParams() }
                ])
                .send();

            const conf1 = await batch.confirmation();
            const currentConf1 = await batch.getCurrentConfirmation();
            
            expect(currentConf1).toEqual(1);
            expect(conf1).toEqual(
                expect.objectContaining({
                    expectedConfirmation: 1,
                    currentConfirmation: 1,
                    completed: true
                })
            );
            expect(batch.opHash).toBeDefined();
            expect(await batch.status()).toEqual('applied');
            done();
        });
    });

        test('Batch multiple originations and get contract addresses info from getOriginatedContractAddresses member function', async (done) => {
            const batch = Tezos.wallet
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
              });

          const op = await batch.send();
          const confirmation = await op.confirmation()
          const currentConfirmation = await op.getCurrentConfirmation()

          expect(currentConfirmation).toEqual(1);
          expect(confirmation).toEqual(
              expect.objectContaining({
                  expectedConfirmation: 1,
                  currentConfirmation: 1,
                  completed: true
              })
          );
          expect(op.opHash).toBeDefined();
          expect(await op.status()).toEqual('applied');
          expect((await op.getOriginatedContractAddresses()).length).toEqual(2);
          done();
        });
    });