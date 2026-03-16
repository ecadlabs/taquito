import { CONFIGS, SignerType } from "../../../config";

CONFIGS().forEach(({ lib, rpc, setup, signerConfig }) => {
    const Tezos = lib;
    describe(`Test reveal of account through contract API using: ${rpc}`, () => {

        const testWithKeyGen = signerConfig.type === SignerType.SECRET_KEY ? test.skip : test;

        beforeEach(async () => {
            await setup({
                preferFreshKey: true,
                maxAttempts: 8,
                minBalanceMutez: 2_000_000,
            })
        })

        testWithKeyGen('verify that contract.reveal reveals the current account', async () => {

            const pkh = await Tezos.signer.publicKeyHash()
            const pk = await Tezos.signer.publicKey()
            const managerKey = await Tezos.rpc.getManagerKey(pkh)

            if (managerKey) {
                expect(managerKey).toEqual(pk)
                return;
            }

            const op = await Tezos.contract.reveal({})
            await op.confirmation();

            expect(op.hash).toBeDefined();
            expect(op.includedInBlock).toBeLessThan(Number.POSITIVE_INFINITY);
            expect(Number(op.consumedGas)).toBeGreaterThan(0);
            expect(op.publicKey).toEqual(pk);
            expect(op.source).toEqual(pkh);
            expect(op.status).toEqual('applied');
            expect(op.storageDiff).toEqual('0');

            // if the account is revealed, it has a manager
            expect(await Tezos.rpc.getManagerKey(pkh)).toEqual(pk)

        });
    });
})
