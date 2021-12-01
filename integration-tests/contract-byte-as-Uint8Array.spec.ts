import { CONFIGS } from "./config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    describe(`Test contract origination and obtaining using bytes as Uint8Array through contract api: ${rpc}`, () => {

        beforeEach(async (done) => {
            await setup()
            done()
        })

        it('Verify contract.originate for a contract and then calls its method using bytes as Uint8Array', async (done) => {
            const value = new Uint8Array([202, 254]);
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
            const contract = await op.contract();
            const contractAbs = await Tezos.contract.at(contract.address);

            const operation = await contractAbs.methods.default(value).send();
            await operation.confirmation();

            const storage = await contractAbs.storage();

            expect(operation.status).toEqual('applied');
            expect(storage).toEqual('cafecafe');

            done();
        })
    });
})
