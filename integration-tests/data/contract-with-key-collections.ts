export const contractWithKeyCollections = [{
  "prim": "parameter",
  "args": [
    {
      "prim": "or",
      "args": [
        {
          "prim": "map",
          "args": [{ "prim": "key" }, { "prim": "int" }],
          "annots": ["%setMap"]
        },
        {
          "prim": "set", "args": [{ "prim": "key" }],
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
          "args": [{ "prim": "key" }, { "prim": "int" }],
          "annots": ["%keyMap"]
        },
        {
          "prim": "set", "args": [{ "prim": "key" }],
          "annots": ["%keySet"]
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
