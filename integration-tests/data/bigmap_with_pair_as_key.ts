const keyType = { "prim": "pair", "args": [{ "prim": "string", annots: ["%test"] }, { "prim": "string", annots: ["%test2"] }] };

export const rpcContractResponse = {
  "balance": "0", "script": {
    "code": [
      { "prim": "parameter", "args": [{ "prim": "unit" }] },
      { "prim": "storage", "args": [{ "prim": "big_map", "args": [keyType, { "prim": "string" }] }] },
      {
        "prim": "code",
        "args":
          [[{ "prim": "DUP" }, { "prim": "CDR" },
          { "prim": "NIL", "args": [{ "prim": "operation" }] },
          { "prim": "PAIR" },
          { "prim": "DIP", "args": [[{ "prim": "DROP" }]] }]]
      }],
    "storage": [
      { "prim": "Elt", "args": [{ "prim": "Pair", args: [{ "string": "test2" }, { "string": "test3" }] }, { "string": "test" }] },
      { "prim": "Elt", "args": [{ "prim": "Pair", args: [{ "string": "test2" }, { "string": "test4" }] }, { "string": "test" }] },
    ]
  }
}

export const mapWithPairAsKeyCode = rpcContractResponse.script.code;

export const mapWithPairAsKeyStorage = rpcContractResponse.script.storage

export const params = rpcContractResponse.script.code.find(
  x => x.prim === 'parameter'
)!.args[0] as any;
