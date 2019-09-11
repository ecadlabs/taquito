export const rpcContractResponse = { "manager": "tz1R726RSR2L9pYK2ALiqfdVnDZuugkrAh5o", "balance": "1000000", "spendable": false, "delegate": { "setable": false }, "script": { "code": [{ "prim": "parameter", "args": [{ "prim": "string" }] }, { "prim": "storage", "args": [{ "prim": "string" }] }, { "prim": "code", "args": [[{ "prim": "CAR" }, { "prim": "PUSH", "args": [{ "prim": "string" }, { "string": "Hello " }] }, { "prim": "CONCAT" }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }], "storage": { "string": "test" } }, "counter": "0" }

export const storage = rpcContractResponse.script.code.find(
    x => x.prim === 'storage'
)!.args[0] as any;

export const params = rpcContractResponse.script.code.find(
    x => x.prim === 'parameter'
)!.args[0];