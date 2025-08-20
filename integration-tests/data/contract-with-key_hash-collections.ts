export const contractWithKeyHashCollections = [{
  "prim": "parameter",
  "args": [
    {
      "prim": "or",
      "args": [
        {
          "prim": "map",
          "args": [{ "prim": "key_hash" }, { "prim": "int" }],
          "annots": ["%setMap"]
        },
        {
          "prim": "set", "args": [{ "prim": "key_hash" }],
          "annots": ["%setSet"]
        }]
    }
  ]
},
{
  "prim": "storage",
  "args": [
    {
      "prim": "pair",
      "args":
        [{
          "prim": "map",
          "args": [{ "prim": "key_hash" }, { "prim": "int" }],
          "annots": ["%keyHashMap"]
        },
        {
          "prim": "set", "args": [{ "prim": "key_hash" }],
          "annots": ["%keyHashSet"]
        }]
    }
  ]
},
{
  "prim": "code",
  "args": [
    [{ "prim": "UNPAIR" },
    {
      "prim": "IF_LEFT",
      "args":
        [[{ "prim": "SWAP" }, { "prim": "CDR" }, { "prim": "SWAP" },
        { "prim": "PAIR" }],
        [{ "prim": "SWAP" }, { "prim": "CAR" }, { "prim": "PAIR" }]]
    },
    { "prim": "NIL", "args": [{ "prim": "operation" }] },
    { "prim": "PAIR" }]
  ]
}]
