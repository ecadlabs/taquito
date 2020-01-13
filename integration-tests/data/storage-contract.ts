export const storageContract = [{ "prim": "parameter", "args": [{ "prim": "unit" }] },
{
  "prim": "storage",
  "args":
    [{
      "prim": "pair",
      "args":
        [{
          "prim": "pair",
          "args":
            [{
              "prim": "pair",
              "args":
                [{
                  "prim": "map",
                  "args":
                    [{ "prim": "address" }, { "prim": "nat" }],
                  "annots": ["%map1"]
                },
                {
                  "prim": "map",
                  "args": [{ "prim": "int" }, { "prim": "nat" }],
                  "annots": ["%map2"]
                }]
            },
            {
              "prim": "pair",
              "args":
                [{
                  "prim": "map",
                  "args": [{ "prim": "nat" }, { "prim": "nat" }],
                  "annots": ["%map3"]
                },
                {
                  "prim": "map",
                  "args":
                    [{ "prim": "string" }, { "prim": "nat" }],
                  "annots": ["%map4"]
                }]
            }]
        },
        {
          "prim": "pair",
          "args":
            [{
              "prim": "pair",
              "args":
                [{
                  "prim": "map",
                  "args":
                    [{ "prim": "bytes" }, { "prim": "nat" }],
                  "annots": ["%map5"]
                },
                {
                  "prim": "map",
                  "args":
                    [{ "prim": "mutez" }, { "prim": "nat" }],
                  "annots": ["%map6"]
                }]
            },
            {
              "prim": "map",
              "args": [{ "prim": "timestamp" }, { "prim": "nat" }],
              "annots": ["%map7"]
            }]
        }]
    }]
},
{
  "prim": "code",
  "args":
    [[{ "prim": "DUP" }, { "prim": "CDR" },
    { "prim": "NIL", "args": [{ "prim": "operation" }] },
    { "prim": "PAIR" },
    { "prim": "DIP", "args": [[{ "prim": "DROP" }]] }]]
}]
