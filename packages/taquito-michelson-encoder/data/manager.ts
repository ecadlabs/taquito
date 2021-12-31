/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const rpcContractResponse = { "balance": "1000000", "script": { "code": [{ "prim": "parameter", "args": [{ "prim": "or", "args": [{ "prim": "lambda", "args": [{ "prim": "unit" }, { "prim": "list", "args": [{ "prim": "operation" }] }], "annots": ["%do"] }, { "prim": "unit", "annots": ["%default"] }] }] }, { "prim": "storage", "args": [{ "prim": "key_hash" }] }, { "prim": "code", "args": [[[[{ "prim": "DUP" }, { "prim": "CAR" }, { "prim": "DIP", "args": [[{ "prim": "CDR" }]] }]], { "prim": "IF_LEFT", "args": [[{ "prim": "PUSH", "args": [{ "prim": "mutez" }, { "int": "0" }] }, { "prim": "AMOUNT" }, [[{ "prim": "COMPARE" }, { "prim": "EQ" }], { "prim": "IF", "args": [[], [[{ "prim": "UNIT" }, { "prim": "FAILWITH" }]]] }], [{ "prim": "DIP", "args": [[{ "prim": "DUP" }]] }, { "prim": "SWAP" }], { "prim": "IMPLICIT_ACCOUNT" }, { "prim": "ADDRESS" }, { "prim": "SENDER" }, [[{ "prim": "COMPARE" }, { "prim": "EQ" }], { "prim": "IF", "args": [[], [[{ "prim": "UNIT" }, { "prim": "FAILWITH" }]]] }], { "prim": "UNIT" }, { "prim": "EXEC" }, { "prim": "PAIR" }], [{ "prim": "DROP" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }]] }], "storage": { "string": "tz1UbbpwwefHU7N7EiHr6hiyFA2sDJi5vXkq" } } }

export const params = rpcContractResponse.script.code.find(
    x => x.prim === 'parameter'
)!.args[0] as any;

export const storage = rpcContractResponse.script.code.find(
    x => x.prim === 'storage'
)!.args[0] as any;

export const doSchema = { "prim": "lambda", "args": [{ "prim": "unit" }, { "prim": "list", "args": [{ "prim": "operation" }] }] };