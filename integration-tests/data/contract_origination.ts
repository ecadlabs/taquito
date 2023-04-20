import { OperationContentsOrigination } from "@taquito/rpc"

export const rpcToForge = {
  "branch": "BLQ6JyEEzUNkA7WEDSAbyFYLoEK7RVcNcjbjrN5LrmqoUW4qmu3",
  "contents":
    [{
      "kind": 'origination',
      "source": "tz1UpizQ6AGjMeCZCLpuyuL4BSzoUC4XD1QE", "fee": "515",
      "counter": "340273", "gas_limit": "1533", "storage_limit": "409",
      "balance": "0",
      "script":
      {
        "code":
          [{
            "prim": "parameter",
            "args":
              [{
                "prim": "pair",
                "args":
                  [{ "prim": "string" }, { "prim": "nat" },
                  { "prim": "tx_rollup_l2_address" },
                  { "prim": "address" }]
              }]
          },
          { "prim": "storage", "args": [{ "prim": "unit" }] },
          {
            "prim": "code",
            "args":
              [[{ "prim": "CAR" },
              { "prim": "UNPAIR", "args": [{ "int": "4" }] },
              { "prim": "TICKET" }, { "prim": "PAIR" },
              { "prim": "SWAP" },
              {
                "prim": "CONTRACT",
                "args":
                  [{
                    "prim": "pair",
                    "args":
                      [{
                        "prim": "ticket",
                        "args": [{ "prim": "string" }]
                      },
                      { "prim": "tx_rollup_l2_address" }]
                  }],
                "annots": ["%deposit"]
              },
              [{
                "prim": "IF_NONE",
                "args":
                  [[[{ "prim": "UNIT" },
                  { "prim": "FAILWITH" }]], []]
              }],
              { "prim": "SWAP" },
              {
                "prim": "PUSH",
                "args": [{ "prim": "mutez" }, { "int": "0" }]
              },
              { "prim": "SWAP" },
              { "prim": "TRANSFER_TOKENS" },
              { "prim": "UNIT" },
              {
                "prim": "NIL",
                "args": [{ "prim": "operation" }]
              },
              { "prim": "DIG", "args": [{ "int": "2" }] },
              { "prim": "CONS" }, { "prim": "PAIR" }]]
          }],
        "storage": { "prim": "Unit" }
      },
    }] as OperationContentsOrigination[]
}
