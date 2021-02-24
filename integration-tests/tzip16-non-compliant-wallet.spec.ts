import { CONFIGS } from "./config";
import { tzip16, Tzip16Module, BigMapMetadataNotFound } from '@taquito/tzip16';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    Tezos.addExtension(new Tzip16Module());

    describe(`Tzip16 failing test: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })
        it('Deploy a simple contract using wallet api having no metadata and try to fetch metadata', async (done) => {

            const value = '1234';
            const code =
                [{ "prim": "parameter", "args": [{ "prim": "bytes" }] },
                { "prim": "storage", "args": [{ "prim": "bytes" }] },
                {
                    "prim": "code",
                    "args":
                        [[{ "prim": "DUP" }, { "prim": "CAR" }, { "prim": "SWAP" },
                        { "prim": "CDR" }, { "prim": "CONCAT" },
                        { "prim": "NIL", "args": [{ "prim": "operation" }] },
                        { "prim": "PAIR" }]]
                }];

            // file deepcode ignore object-literal-shorthand: not sure how to fix
            const op = await Tezos.wallet.originate({
                code: code,
                storage: value
            }).send();
            await op.confirmation();
            const contractAddress = (await op.contract()).address;

            const contract = await Tezos.contract.at(contractAddress, tzip16);
            try {
                await contract.tzip16().getMetadata();
            } catch (ex) {
                expect(ex).toBeInstanceOf(BigMapMetadataNotFound);
            }
            done();
        });
    });
})
