import { CONFIGS } from './config';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;

    describe(`Test deploying contract having long numeral in storage and calling default entry point with long numeral using the contract API: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup();
            done();
        });
        test('Originates contract and calls default method with long nat param', async (done) => {
            const code = `parameter nat; storage nat; code { CAR ; NIL operation ; PAIR }`;
            const op = await Tezos.contract.originate({
                code,
                storage: 1000000000000000000000000000000000000000000000000000000
            });
            const contract = await op.contract();

            const operation = await contract.methods
                .default(2000000000000000000000000000000000000000000000000000000)
                .send();
            await operation.confirmation();
            expect(operation.status).toEqual('applied');
            done();
        });
    });

    describe(`Test deploying contract having long numeral in storage and calling default entry point with long numeral using the wallet API: ${rpc}`, () => {
        beforeEach(async (done) => {
            await setup();
            done();
        });

        test('Originates contract and calls default method with long int param', async (done) => {
            const code = `parameter int; storage int; code { CAR ; NIL operation ; PAIR }`;
            const op = await Tezos.wallet.originate({
                code,
                storage: 1000000000000000000000000000000000000000000000000000000
            }).send();
            const contract = await op.contract();

            const operation = await contract.methods
                .default(2000000000000000000000000000000000000000000000000000000)
                .send();
            await operation.confirmation();
            expect(operation.opHash).toBeDefined();
            done();
        });
    });
});
