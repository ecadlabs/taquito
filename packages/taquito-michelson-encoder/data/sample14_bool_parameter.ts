const code = [{
  "prim": "parameter",
  "args":
    [{
      "prim": "or",
      "args":
        [{ "prim": "bool", "annots": ["%setBool"] },
        { "prim": "bool", "annots": ["%setNotBool"] }]
    }]
},
{ "prim": "storage", "args": [{ "prim": "bool" }] },
{
  "prim": "code",
  "args":
    [[{
      "prim": "LAMBDA",
      "args":
        [{ "prim": "bool" }, { "prim": "bool" },
        [{ "prim": "DUP" },
        { "prim": "DIP", "args": [[{ "prim": "DROP" }]] }]]
    },
    {
      "prim": "LAMBDA",
      "args":
        [{ "prim": "bool" }, { "prim": "bool" },
        [{ "prim": "DUP" }, { "prim": "NOT" },
        { "prim": "DIP", "args": [[{ "prim": "DROP" }]] }]]
    },
    {
      "prim": "DIP",
      "args": [{ "int": "2" }, [{ "prim": "DUP" }]]
    },
    { "prim": "DIG", "args": [{ "int": "2" }] }, { "prim": "CAR" },
    {
      "prim": "DIP",
      "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
    },
    { "prim": "DIG", "args": [{ "int": "3" }] }, { "prim": "CDR" },
    { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
    { "prim": "SWAP" },
    {
      "prim": "IF_LEFT",
      "args":
        [[{ "prim": "DUP" }, { "prim": "DUP" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [{ "int": "5" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "5" }] }]]
        },
        { "prim": "EXEC" },
        {
          "prim": "DIP",
          "args":
            [[{ "prim": "DROP", "args": [{ "int": "2" }] }]]
        }],
        [{ "prim": "DUP" }, { "prim": "DUP" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [{ "int": "4" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "4" }] }]]
        },
        { "prim": "EXEC" },
        {
          "prim": "DIP",
          "args":
            [[{ "prim": "DROP", "args": [{ "int": "2" }] }]]
        }]]
    },
    { "prim": "NIL", "args": [{ "prim": "operation" }] },
    { "prim": "PAIR" },
    {
      "prim": "DIP",
      "args": [[{ "prim": "DROP", "args": [{ "int": "5" }] }]]
    }]]
}]

export const storage = code.find(
  x => x.prim === 'storage'
)!.args[0] as any;

export const params = code.find(
  x => x.prim === 'parameter'
)!.args[0] as any;
