export const collection_code = [{
  "prim": "parameter",
  "args":
    [{
      "prim": "or",
      "args":
        [{
          "prim": "or",
          "args":
            [{
              "prim": "list", "args": [{ "prim": "nat" }],
              "annots": ["%setList"]
            },
            {
              "prim": "map",
              "args": [{ "prim": "nat" }, { "prim": "mutez" }],
              "annots": ["%setMap"]
            }]
        },
        {
          "prim": "set", "args": [{ "prim": "nat" }],
          "annots": ["%setSet"]
        }]
    }]
},
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
              "prim": "list", "args": [{ "prim": "nat" }],
              "annots": ["%list1"]
            },
            {
              "prim": "map",
              "args": [{ "prim": "nat" }, { "prim": "mutez" }],
              "annots": ["%map1"]
            }]
        },
        {
          "prim": "set", "args": [{ "prim": "nat" }],
          "annots": ["%set1"]
        }]
    }]
},
{
  "prim": "code",
  "args":
    [[{
      "prim": "LAMBDA",
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
                      "prim": "list",
                      "args": [{ "prim": "nat" }]
                    },
                    {
                      "prim": "map",
                      "args":
                        [{ "prim": "nat" },
                        { "prim": "mutez" }]
                    }]
                },
                { "prim": "set", "args": [{ "prim": "nat" }] }]
            },
            { "prim": "set", "args": [{ "prim": "nat" }] }]
        },
        {
          "prim": "pair",
          "args":
            [{
              "prim": "pair",
              "args":
                [{ "prim": "list", "args": [{ "prim": "nat" }] },
                {
                  "prim": "map",
                  "args":
                    [{ "prim": "nat" }, { "prim": "mutez" }]
                }]
            },
            { "prim": "set", "args": [{ "prim": "nat" }] }]
        },
        [{ "prim": "DUP" }, { "prim": "CAR" },
        { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
        { "prim": "SWAP" }, { "prim": "CDR" },
        { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
        { "prim": "SWAP" },
        {
          "prim": "DIP",
          "args":
            [[{ "prim": "DROP", "args": [{ "int": "3" }] }]]
        }]]
    },
    {
      "prim": "LAMBDA",
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
                      "prim": "list",
                      "args": [{ "prim": "nat" }]
                    },
                    {
                      "prim": "map",
                      "args":
                        [{ "prim": "nat" },
                        { "prim": "mutez" }]
                    }]
                },
                { "prim": "set", "args": [{ "prim": "nat" }] }]
            },
            {
              "prim": "map",
              "args": [{ "prim": "nat" }, { "prim": "mutez" }]
            }]
        },
        {
          "prim": "pair",
          "args":
            [{
              "prim": "pair",
              "args":
                [{ "prim": "list", "args": [{ "prim": "nat" }] },
                {
                  "prim": "map",
                  "args":
                    [{ "prim": "nat" }, { "prim": "mutez" }]
                }]
            },
            { "prim": "set", "args": [{ "prim": "nat" }] }]
        },
        [{ "prim": "DUP" }, { "prim": "CAR" },
        { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
        { "prim": "SWAP" }, { "prim": "CDR" },
        { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
        { "prim": "SWAP" },
        {
          "prim": "DIP",
          "args":
            [[{ "prim": "DROP", "args": [{ "int": "3" }] }]]
        }]]
    },
    {
      "prim": "LAMBDA",
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
                      "prim": "list",
                      "args": [{ "prim": "nat" }]
                    },
                    {
                      "prim": "map",
                      "args":
                        [{ "prim": "nat" },
                        { "prim": "mutez" }]
                    }]
                },
                { "prim": "set", "args": [{ "prim": "nat" }] }]
            },
            { "prim": "list", "args": [{ "prim": "nat" }] }]
        },
        {
          "prim": "pair",
          "args":
            [{
              "prim": "pair",
              "args":
                [{ "prim": "list", "args": [{ "prim": "nat" }] },
                {
                  "prim": "map",
                  "args":
                    [{ "prim": "nat" }, { "prim": "mutez" }]
                }]
            },
            { "prim": "set", "args": [{ "prim": "nat" }] }]
        },
        [{ "prim": "DUP" }, { "prim": "CAR" },
        { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
        { "prim": "SWAP" }, { "prim": "CDR" },
        { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
        { "prim": "SWAP" },
        {
          "prim": "DIP",
          "args":
            [[{ "prim": "DROP", "args": [{ "int": "3" }] }]]
        }]]
    },
    {
      "prim": "DIP",
      "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
    },
    { "prim": "DIG", "args": [{ "int": "3" }] }, { "prim": "CAR" },
    {
      "prim": "DIP",
      "args": [{ "int": "4" }, [{ "prim": "DUP" }]]
    },
    { "prim": "DIG", "args": [{ "int": "4" }] }, { "prim": "CDR" },
    { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
    { "prim": "SWAP" },
    {
      "prim": "IF_LEFT",
      "args":
        [[{ "prim": "DUP" },
        {
          "prim": "IF_LEFT",
          "args":
            [[{ "prim": "DUP" },
            {
              "prim": "DIP",
              "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "3" }] },
            {
              "prim": "DIP",
              "args": [[{ "prim": "DUP" }]]
            },
            { "prim": "PAIR" },
            {
              "prim": "DIP",
              "args":
                [[{
                  "prim": "DIP",
                  "args":
                    [{ "int": "5" },
                    [{ "prim": "DUP" }]]
                },
                {
                  "prim": "DIG",
                  "args": [{ "int": "5" }]
                }]]
            },
            { "prim": "EXEC" },
            {
              "prim": "DIP",
              "args":
                [[{
                  "prim": "DROP",
                  "args": [{ "int": "2" }]
                }]]
            }],
            [{ "prim": "DUP" },
            {
              "prim": "DIP",
              "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "3" }] },
            {
              "prim": "DIP",
              "args": [[{ "prim": "DUP" }]]
            },
            { "prim": "PAIR" },
            {
              "prim": "DIP",
              "args":
                [[{
                  "prim": "DIP",
                  "args":
                    [{ "int": "6" },
                    [{ "prim": "DUP" }]]
                },
                {
                  "prim": "DIG",
                  "args": [{ "int": "6" }]
                }]]
            },
            { "prim": "EXEC" },
            {
              "prim": "DIP",
              "args":
                [[{
                  "prim": "DROP",
                  "args": [{ "int": "2" }]
                }]]
            }]]
        },
        { "prim": "DIP", "args": [[{ "prim": "DROP" }]] }],
        [{ "prim": "DUP" },
        {
          "prim": "DIP",
          "args": [{ "int": "2" }, [{ "prim": "DUP" }]]
        },
        { "prim": "DIG", "args": [{ "int": "2" }] },
        { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
        { "prim": "PAIR" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [{ "int": "6" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "6" }] }]]
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
      "args": [[{ "prim": "DROP", "args": [{ "int": "6" }] }]]
    }]]
}]
