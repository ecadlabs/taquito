export const storageContractWithPairAsKey = [{ "prim": "parameter", "args": [{ "prim": "unit" }] },
{
  "prim": "storage",
  "args":
    [
      {
        prim: 'map',
        args: [
          {
            prim: "pair", args: [
              { prim: "int" },
              {
                prim: "pair", args: [
                  { prim: "nat" },
                  {
                    prim: "pair", args: [
                      { prim: "string" },
                      {
                        prim: "pair", args: [
                          { prim: "bytes" },
                          {
                            prim: "pair", args: [
                              { prim: "mutez" },
                              {
                                prim: "pair", args: [
                                  { prim: "bool" },
                                  {
                                    prim: "pair", args: [
                                      { prim: "key_hash" },
                                      {
                                        prim: "pair", args: [
                                          { prim: "timestamp" },
                                          { prim: "address" }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }, { prim: "int" }]
      },
    ]
},
{
  "prim": "code",
  "args":
    [[{ "prim": "DUP" }, { "prim": "CDR" },
    { "prim": "NIL", "args": [{ "prim": "operation" }] },
    { "prim": "PAIR" },
    { "prim": "DIP", "args": [[{ "prim": "DROP" }]] }]]
}]
