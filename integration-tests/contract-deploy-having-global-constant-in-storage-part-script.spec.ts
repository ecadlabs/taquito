import { Protocols, DefaultGlobalConstantsProvider } from '@taquito/taquito';
import { CONFIGS } from './config';
import { voteSampleGlobalConstants } from './data/vote_contract_global_constant_storage';

CONFIGS().forEach(({ lib, rpc, setup, protocol }) => {
    const Tezos = lib;
    const hangzhounetOrHigher = (protocol === Protocols.PtHangz2 || protocol === Protocols.Psithaca2) ? test : test.skip;

    describe(`Originate a voting contract having two global constants in the storage section of its code: ${rpc}`, () => {
        const globalConstant1 = {
            "prim": "pair",
            "args":
                [{
                    "prim": "address",
                    "annots": ["%addr"]
                },
                {
                    "prim": "option",
                    "args": [{ "prim": "key_hash" }],
                    "annots": ["%key"]
                }],
            "annots": ["%mgr1"]
        };
        const constantHash1 = 'expruv45XuhGc4fdRzTwwXpmp2ZyqwmUYeMmnKbxkCn5Q8uCtwkhM6';

        const globalConstant2 = {
            "prim": "pair",
            "args":
                [{
                    "prim": "address",
                    "annots": ["%addr"]
                },
                {
                    "prim": "option",
                    "args": [{ "prim": "key_hash" }],
                    "annots": ["%key"]
                }],
            "annots": ["%mgr2"]
        }
        const constantHash2 = 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb';

        const storageArg = {
            mgr1: {
                addr: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
                key: null,
            },
            mgr2: {
                addr: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
                key: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
            },
        }

        beforeEach(async (done) => {
            await setup(true);

            // We need to set up a global constants provider on the TezosToolkit
            // We use an instance of DefaultGlobalConstantsProvider where the global constant hash and its corresponding expression need to be loaded manually
            // Taquito use the globalConstantProvider to properly transform the storage object into the corresponding Michelson data on contract origination
            const globalConstantProvider = new DefaultGlobalConstantsProvider();
            globalConstantProvider.loadGlobalConstant({
                [constantHash1]: globalConstant1,
                [constantHash2]: globalConstant2,
            })
            Tezos.setGlobalConstantsProvider(globalConstantProvider);
            done()
        })
        hangzhounetOrHigher('deploy a voting contract having global constants in the storage part of its code using the contract API', async (done) => {
            try {
                // First, we need to register the expression (globalConstant1) as global constants
                const op = await Tezos.contract.registerGlobalConstant({
                    value: globalConstant1
                });
                await op.confirmation();
                expect(op.globalConstantHash).toEqual(constantHash1);
            } catch (ex: any) {
                // If the expression is already registered, the operation fails
                // We can not register the same constant multiple time
                expect(ex.message).toMatch(/context.storage_error/);
            }
            try {
                const op = await Tezos.contract.registerGlobalConstant({
                    value: globalConstant2
                });
                await op.confirmation();
                expect(op.globalConstantHash).toEqual(constantHash2);
            } catch (ex: any) {
                expect(ex.message).toMatch(/context.storage_error/);
            }

            const op = await Tezos.contract.originate({
                balance: "1",
                code: voteSampleGlobalConstants,
                storage: storageArg
            })

            await op.confirmation()
            expect(op.hash).toBeDefined();
            expect(op.operationResults).toBeDefined();

            const contract = await op.contract();

            const storage: any = await contract.storage();
            expect(storage).toEqual(storageArg);
            done();
        });

        hangzhounetOrHigher('deploy a voting contract having global constants in the storage part of its code using the wallet API', async (done) => {

            const op = await Tezos.wallet.originate({
                balance: "1",
                code: voteSampleGlobalConstants,
                storage: storageArg
            }).send()

            await op.confirmation()
            expect(op.opHash).toBeDefined();
            expect(op.operationResults).toBeDefined();

            const contract = await op.contract();

            const storage: any = await contract.storage();
            expect(storage).toEqual(storageArg);
            done();
        });

        hangzhounetOrHigher('deploy a voting contract having global constants in the storage part of its code using the batch method of the contract API', async (done) => {
            const op = await Tezos.contract.batch().withOrigination({
                balance: "1",
                code: voteSampleGlobalConstants,
                storage: storageArg
            }).send();

            await op.confirmation()
            expect(op.hash).toBeDefined();
            done();
        });

        hangzhounetOrHigher('deploy a voting contract having global constants in the storage part of its code using the batch method of the wallet API', async (done) => {
            const op = await Tezos.wallet.batch().withOrigination({
                balance: "1",
                code: voteSampleGlobalConstants,
                storage: storageArg
            }).send();

            await op.confirmation()
            expect(op.opHash).toBeDefined();
            done();
        });
    });
});
