import { OpKind } from "@taquito/taquito";
import { importKey } from "@taquito/signer";
import { CONFIGS } from "./config";
import { booleanCode } from "./data/boolean_parameter";

CONFIGS().forEach(({ lib, rpc, setup, knownContract }) => {
    const Tezos = lib;

    describe(`Test send more than 1 tx in the same block: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            // temporarily use a faucet key waiting to update the keygen
            await importKey(
                Tezos,
                'oeqmgekb.yidlohon@tezos.example.org',
                'CH7w7xY62N',
                [
                    "now",
                    "device",
                    "cost",
                    "dance",
                    "depend",
                    "picture",
                    "fatal",
                    "smile",
                    "blast",
                    "leader",
                    "push",
                    "famous",
                    "health",
                    "evolve",
                    "orange"
                ].join(' '),
                '929737d82bcbfb2ff53daef282dcf70a2f3400e2'
            );

            done()
        })

        it('send multiple operations in a block using the contract api', async (done) => {
            const contract = await Tezos.wallet.at(knownContract);

            const op1 = await Tezos.wallet.transfer({
                to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                amount: 2,
                gasLimit: 1527,
                fee: 443,
                storageLimit: 0
            }).send();

            const op2 = await Tezos.wallet.transfer({ to: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY', amount: 2 }).send();

            const op3 = await Tezos.wallet.transfer({
                to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                amount: 1,
                gasLimit: 1527,
                fee: 480,
                storageLimit: 0
            }).send();

            const op4 = await Tezos.wallet.originate({
                balance: '1',
                code: booleanCode,
                storage: true
            }).send();

            const op5 = await Tezos.wallet.originate({
                balance: '1',
                code: booleanCode,
                storage: true,
                fee: 150000,
                storageLimit: 10000,
                gasLimit: 400000
            }).send();

            const op6 = await Tezos.wallet
                .batch([
                    {
                        kind: OpKind.TRANSACTION,
                        to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
                        amount: 2,
                        gasLimit: 1527,
                        fee: 442,
                        storageLimit: 0
                    },
                    { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
                    { kind: OpKind.TRANSACTION, ...contract.methods.default([['Unit']]).toTransferParams() }
                ]).send();

            await Promise.all([
                op1.confirmation(),
                op2.confirmation(),
                op3.confirmation(),
                op4.confirmation(),
                op5.confirmation(),
                op6.confirmation()
            ]);

            expect(op1.opHash).toBeDefined();
            expect(op2.opHash).toBeDefined();
            expect(op3.opHash).toBeDefined();
            expect(op4.opHash).toBeDefined();
            expect(op5.opHash).toBeDefined();
            expect(op6.opHash).toBeDefined();

            done();
        });
    });
})
