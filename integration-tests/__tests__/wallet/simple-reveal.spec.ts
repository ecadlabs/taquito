import { CONFIGS, SignerType } from "../../config";

CONFIGS().forEach(({ lib, rpc, setup, signerConfig }) => {
    const Tezos = lib;
    describe(`Test reveal of account through wallet API using: ${rpc}`, () => {

        const testWithKeyGen = signerConfig.type === SignerType.SECRET_KEY ? test.skip : test;

        beforeEach(async () => {
            await setup(true)
        })

        testWithKeyGen('verify that wallet.reveal reveals the current account', async () => {
            const pkh = await Tezos.signer.publicKeyHash()
            const pk = await Tezos.signer.publicKey()
            
            const op = await Tezos.wallet.reveal({}).send();
            await op.confirmation();

            expect(op.opHash).toBeDefined();
            const status = await op.status();
            expect(status).toEqual('applied');

            // if the account is revealed, it has a manager
            expect(await Tezos.rpc.getManagerKey(pkh)).toEqual(pk)
        });
    });
})