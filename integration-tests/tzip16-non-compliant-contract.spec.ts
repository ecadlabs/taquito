import { CONFIGS } from "./config";
import { tzip16 } from '../packages/taquito-tzip16/src/composer';
import { Tzip16Module } from '../packages/taquito-tzip16/src/tzip16-extension'
import { BigMapMetadataNotFound } from '../packages/taquito-tzip16/src/tzip16-errors';

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    Tezos.addExtension(new Tzip16Module());

    describe(`Tzip16 failing test: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })
        it('Deploy a simple contract having no metadata and try to fetch metadata', async (done) => {

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

            const op = await Tezos.contract.originate({
                code: code,
                storage: value
            });
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
