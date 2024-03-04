import { CONFIGS } from "../../config";

CONFIGS().forEach(({ lib, rpc, setup }) => {
    const Tezos = lib;
    describe(`Storage contract with pair as key using: ${rpc}`, () => {

        beforeEach(async () => {
            await setup()
        })

        it('originates a contract and call its method using bytes as Uint8Array', async () => {
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
            await op.confirmation();
            const contract = await op.contract();
            const contractAbs = await Tezos.contract.at(contract.address);

            const operation = await contractAbs.methods.default(value).send();
            await operation.confirmation();

            const storage = await contractAbs.storage();

            expect(operation.status).toEqual('applied');
            expect(storage).toEqual('cafecafe');

        })
    });
})
