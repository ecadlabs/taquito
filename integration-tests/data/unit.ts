export const unitContractCode = [{ "prim": "parameter", "args": [{ "prim": "unit" }] },
{ "prim": "storage", "args": [{ "prim": "unit" }] },
{
  "prim": "code",
  "args":
    [[{ "prim": "DUP" }, { "prim": "CDR" },
    {
      "prim": "NIL",
      "args": [{ "prim": "operation" }]
    },
    { "prim": "PAIR" },
    {
      "prim": "DIP",
      "args": [[{ "prim": "DROP" }]]
    }]]
}]
