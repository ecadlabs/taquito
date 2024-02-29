import { CONFIGS } from '../../config';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;

    describe(`Test contract origination for a contract having long numeral in storage and calling default entry point with long numeral through contract api using: ${rpc}`, () => {
        beforeEach(async () => {
            await setup();
        });
        test('Verify contract.originate for a contract and then call default method with long int param', async () => {
            const code = `parameter nat; storage nat; code { CAR ; NIL operation ; PAIR }`;
            const op = await Tezos.contract.originate({
                code,
                storage: 1000000000000000000000000000000000000000000000000000000
            });
            await op.confirmation();
            const contract = await op.contract();

            const operation = await contract.methods
                .default(2000000000000000000000000000000000000000000000000000000)
                .send();
            await operation.confirmation();
            expect(operation.status).toEqual('applied');
        });
    });

    describe(`Test contract origination having long numeral in storage and calling default entry point with long numeral through wallet api using: ${rpc}`, () => {
        beforeEach(async () => {
            await setup();
        });

        test('Verify wallet.originate for a contract and then call default method with long int param', async () => {
            const code = `parameter int; storage int; code { CAR ; NIL operation ; PAIR }`;
            const op = await Tezos.wallet.originate({
                code,
                storage: 1000000000000000000000000000000000000000000000000000000
            }).send();
            await op.confirmation();
            const contract = await op.contract();

            const operation = await contract.methods
                .default(2000000000000000000000000000000000000000000000000000000)
                .send();
            await operation.confirmation();
            expect(operation.opHash).toBeDefined();
        });
    });
});
