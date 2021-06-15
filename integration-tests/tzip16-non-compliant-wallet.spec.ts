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

            const op = await Tezos.wallet.originate({
                code,
                storage: value
            }).send();
            await op.confirmation();
            const contractAddress = (await op.contract()).address;

            const contract = await Tezos.wallet.at(contractAddress, tzip16);
            try {
                await contract.tzip16().getMetadata();
            } catch (ex) {
                expect(ex).toBeInstanceOf(BigMapMetadataNotFound);
            }
            done();
        });
    });
})
