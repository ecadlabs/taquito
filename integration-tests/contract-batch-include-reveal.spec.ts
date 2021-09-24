import { OpKind } from '@taquito/taquito';
import { CONFIGS, SignerType } from './config';

CONFIGS().forEach(({ lib, rpc, setup, knownBaker, signerConfig }) => {
    const Tezos = lib;
    describe(`Test contract.batch using: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup(true);
            done();
        });
        it('Batch estimate including reveal', async (done) => {
            try {
                const pkh = await Tezos.signer.publicKeyHash()
                console.log(pkh, await Tezos.tz.getDelegate(pkh))
                const batchOpEstimate = await Tezos.estimate
                    .batch([
                        { kind: OpKind.DELEGATION, source: await Tezos.signer.publicKeyHash(), delegate: knownBaker },
                        { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
                    ])

                expect(batchOpEstimate.length).toEqual(3);
            } catch (ex: any) {
                // When running tests more than one time with the same faucet key, the account is already delegated to the given delegate
                if (signerConfig.type === SignerType.FAUCET) {
                    expect(ex.message).toMatch('delegate.no_deletion');
                } else {
                    throw ex
                }
            }

            done();
        });

        it('Batch estimate where reveal is not needed', async (done) => {

            try {
                // do a reveal operation first
                const revealOp = await Tezos.contract.reveal({});
                await revealOp.confirmation();

                const batchOpEstimate = await Tezos.estimate
                    .batch([
                        { kind: OpKind.DELEGATION, source: await Tezos.signer.publicKeyHash(), delegate: knownBaker },
                        { kind: OpKind.TRANSACTION, to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 },
                    ])

                expect(batchOpEstimate.length).toEqual(2);

            } catch (ex: any) {
                if (signerConfig.type === SignerType.FAUCET) {
                    // When running the test multiple times with the same faucet, can not reveal an already revealed contract.
                    expect(ex.message).toMatch('The current address is already revealed.')
                } else {
                    throw ex
                }
            }
            done();
        });
    });
});