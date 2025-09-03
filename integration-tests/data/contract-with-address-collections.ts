export const contractWithAddressCollections = [{
  "prim": "parameter",
  "args": [
    {
      "prim": "or",
      "args": [
        {
          "prim": "map",
          "args": [{ "prim": "address" }, { "prim": "int" }],
          "annots": ["%setMap"]
        },
        {
          "prim": "set", "args": [{ "prim": "address" }],
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
          "args": [{ "prim": "address" }, { "prim": "int" }],
          "annots": ["%addressMap"]
        },
        {
          "prim": "set", "args": [{ "prim": "address" }],
          "annots": ["%addressSet"]
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
