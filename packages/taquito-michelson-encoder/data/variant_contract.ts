const code = [{
  "prim": "parameter",
  "args":
    [{
      "prim": "or",
      "args":
        [{ "prim": "int", "annots": ["%decrement"] },
        { "prim": "int", "annots": ["%increment"] }]
    }]
},
{
  "prim": "storage",
  "args":
    [{
      "prim": "or",
      "args":
        [{ "prim": "string", "annots": ["%test"] },
        { "prim": "int", "annots": ["%test2"] }]
    }]
},
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

export const storage = code.find(
  x => x.prim === 'storage'
)!.args[0] as any;

export const params = code.find(
  x => x.prim === 'parameter'
)!.args[0] as any;
