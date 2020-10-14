export const tokenBigmapStorage = {
  prim: 'Pair',
  args: [
    {
      prim: 'Pair',
      args: [
        [],
        {
          string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        },
      ],
    },
    {
      int: '100',
    },
  ],
};

export const tokenBigmapCode = [{
  "prim": "parameter",
  "args":
    [{
      "prim": "pair",
      "args":
        [{
          "prim": "pair",
          "args": [{ "prim": "address" }, { "prim": "address" }]
        },
        { "prim": "int" }]
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
              "prim": "big_map",
              "args":
                [{ "prim": "address" },
                {
                  "prim": "pair",
                  "args":
                    [{
                      "prim": "map",
                      "args":
                        [{ "prim": "address" },
                        { "prim": "int" }],
                      "annots": ["%allowances"]
                    },
                    { "prim": "int", "annots": ["%balance"] }]
                }],
              "annots": ["%accounts"]
            },
            { "prim": "address", "annots": ["%owner"] }]
        },
        { "prim": "int", "annots": ["%totalSupply"] }]
    }]
},
{
  "prim": "code",
  "args":
    [[{ "prim": "DUP" },
    {
      "prim": "LAMBDA",
      "args":
        [{
          "prim": "pair",
          "args":
            [{
              "prim": "pair",
              "args":
                [{ "prim": "address" }, { "prim": "address" }]
            },
            {
              "prim": "pair",
              "args":
                [{ "prim": "int" },
                {
                  "prim": "pair",
                  "args":
                    [{
                      "prim": "pair",
                      "args":
                        [{
                          "prim": "big_map",
                          "args":
                            [{ "prim": "address" },
                            {
                              "prim": "pair",
                              "args":
                                [{
                                  "prim": "map",
                                  "args":
                                    [{ "prim": "address" },
                                    { "prim": "int" }]
                                },
                                { "prim": "int" }]
                            }]
                        },
                        { "prim": "address" }]
                    },
                    { "prim": "int" }]
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
                  "prim": "big_map",
                  "args":
                    [{ "prim": "address" },
                    {
                      "prim": "pair",
                      "args":
                        [{
                          "prim": "map",
                          "args":
                            [{ "prim": "address" },
                            { "prim": "int" }]
                        },
                        { "prim": "int" }]
                    }]
                },
                { "prim": "address" }]
            }, { "prim": "int" }]
        },
        [{ "prim": "DUP" }, { "prim": "CAR" }, { "prim": "CAR" },
        { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
        { "prim": "SWAP" }, { "prim": "CAR" }, { "prim": "CDR" },
        {
          "prim": "DIP",
          "args": [{ "int": "2" }, [{ "prim": "DUP" }]]
        },
        { "prim": "DIG", "args": [{ "int": "2" }] },
        { "prim": "CDR" }, { "prim": "CAR" },
        {
          "prim": "DIP",
          "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
        },
        { "prim": "DIG", "args": [{ "int": "3" }] },
        { "prim": "CDR" }, { "prim": "CDR" }, { "prim": "DUP" },
        { "prim": "CAR" }, { "prim": "CAR" }, { "prim": "SOURCE" },
        { "prim": "GET" },
        {
          "prim": "IF_NONE",
          "args":
            [[{
              "prim": "PUSH",
              "args":
                [{ "prim": "string" },
                { "string": "GET_FORCE" }]
            },
            { "prim": "FAILWITH" }], []]
        },
        {
          "prim": "PUSH",
          "args": [{ "prim": "int" }, { "int": "0" }]
        },
        {
          "prim": "EMPTY_MAP",
          "args": [{ "prim": "address" }, { "prim": "int" }]
        },
        { "prim": "PAIR" },
        {
          "prim": "DIP",
          "args": [{ "int": "4" }, [{ "prim": "DUP" }]]
        },
        { "prim": "DIG", "args": [{ "int": "4" }] },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [{ "int": "2" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "2" }] },
            { "prim": "CAR" }, { "prim": "CAR" }]]
        },
        { "prim": "GET" },
        {
          "prim": "IF_NONE",
          "args":
            [[{
              "prim": "PUSH",
              "args":
                [{ "prim": "unit" }, { "prim": "Unit" }]
            }],
            [{ "prim": "DUP" },
            {
              "prim": "DIP",
              "args":
                [[{
                  "prim": "DIP",
                  "args": [[{ "prim": "DUP" }]]
                },
                { "prim": "SWAP" }, { "prim": "DROP" }]]
            },
            { "prim": "SWAP" }, { "prim": "DROP" },
            {
              "prim": "DIP",
              "args": [[{ "prim": "DROP" }]]
            },
            {
              "prim": "PUSH",
              "args":
                [{ "prim": "unit" }, { "prim": "Unit" }]
            }]]
        },
        { "prim": "DROP" },
        {
          "prim": "DIP",
          "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
        },
        { "prim": "DIG", "args": [{ "int": "3" }] },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [[{ "prim": "DUP" }]]
            },
            { "prim": "SWAP" }, { "prim": "CDR" }]]
        },
        { "prim": "COMPARE" }, { "prim": "GT" },
        {
          "prim": "IF",
          "args":
            [[{
              "prim": "PUSH",
              "args":
                [{ "prim": "string" },
                { "string": "Balance is too low" }]
            },
            { "prim": "FAILWITH" }],
            [{
              "prim": "PUSH",
              "args":
                [{ "prim": "unit" }, { "prim": "Unit" }]
            }]]
        },
        { "prim": "DROP" },
        { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
        { "prim": "SWAP" }, { "prim": "CDR" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "3" }] }]]
        },
        { "prim": "SUB" }, { "prim": "DUP" },
        {
          "prim": "PUSH",
          "args": [{ "prim": "int" }, { "int": "0" }]
        },
        { "prim": "SWAP" }, { "prim": "COMPARE" },
        { "prim": "LT" },
        {
          "prim": "IF",
          "args":
            [[{
              "prim": "PUSH",
              "args":
                [{ "prim": "string" },
                { "string": "Balance cannot be negative" }]
            },
            { "prim": "FAILWITH" }],
            [{ "prim": "DUP" },
            {
              "prim": "DIP",
              "args":
                [[{
                  "prim": "DIP",
                  "args":
                    [{ "int": "2" },
                    [{ "prim": "DUP" }]]
                },
                {
                  "prim": "DIG",
                  "args": [{ "int": "2" }]
                },
                { "prim": "CAR" }]]
            },
            { "prim": "SWAP" }, { "prim": "PAIR" },
            {
              "prim": "DIP",
              "args":
                [{ "int": "3" }, [{ "prim": "DROP" }]]
            },
            { "prim": "DUG", "args": [{ "int": "2" }] },
            {
              "prim": "PUSH",
              "args":
                [{ "prim": "unit" }, { "prim": "Unit" }]
            }]]
        },
        { "prim": "DROP" },
        { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
        { "prim": "SWAP" }, { "prim": "CDR" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [{ "int": "4" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "4" }] }]]
        },
        { "prim": "ADD" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [[{ "prim": "DUP" }]]
            },
            { "prim": "SWAP" }, { "prim": "CAR" }]]
        },
        { "prim": "SWAP" }, { "prim": "PAIR" }, { "prim": "SWAP" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [[{ "prim": "DROP" }]]
            }]]
        },
        {
          "prim": "DIP",
          "args": [{ "int": "2" }, [{ "prim": "DUP" }]]
        },
        { "prim": "DIG", "args": [{ "int": "2" }] },
        { "prim": "SOME" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "3" }] },
            { "prim": "CAR" }, { "prim": "CAR" }]]
        },
        { "prim": "SOURCE" }, { "prim": "UPDATE" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "3" }] },
            { "prim": "DUP" }, { "prim": "CDR" },
            { "prim": "SWAP" }, { "prim": "CAR" },
            { "prim": "CDR" }]]
        }, { "prim": "PAIR" },
        { "prim": "PAIR" },
        {
          "prim": "DIP",
          "args": [{ "int": "4" }, [{ "prim": "DROP" }]]
        },
        { "prim": "DUG", "args": [{ "int": "3" }] },
        {
          "prim": "DIP",
          "args": [{ "int": "5" }, [{ "prim": "DUP" }]]
        },
        { "prim": "DIG", "args": [{ "int": "5" }] },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [[{ "prim": "DUP" }]]
            },
            { "prim": "SWAP" }, { "prim": "SOME" },
            {
              "prim": "DIP",
              "args":
                [[{
                  "prim": "DIP",
                  "args":
                    [{ "int": "3" },
                    [{ "prim": "DUP" }]]
                },
                {
                  "prim": "DIG",
                  "args": [{ "int": "3" }]
                },
                { "prim": "CAR" }, { "prim": "CAR" }]]
            }]]
        },
        { "prim": "UPDATE" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
            },
            { "prim": "DIG", "args": [{ "int": "3" }] },
            { "prim": "DUP" }, { "prim": "CDR" },
            { "prim": "SWAP" }, { "prim": "CAR" },
            { "prim": "CDR" }]]
        }, { "prim": "PAIR" },
        { "prim": "PAIR" },
        {
          "prim": "DIP",
          "args": [{ "int": "4" }, [{ "prim": "DROP" }]]
        },
        { "prim": "DUG", "args": [{ "int": "3" }] },
        {
          "prim": "DIP",
          "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
        },
        { "prim": "DIG", "args": [{ "int": "3" }] },
        {
          "prim": "DIP",
          "args":
            [[{ "prim": "DROP", "args": [{ "int": "8" }] }]]
        }]]
    },
    { "prim": "SWAP" }, { "prim": "CAR" },
    {
      "prim": "DIP",
      "args": [{ "int": "2" }, [{ "prim": "DUP" }]]
    },
    { "prim": "DIG", "args": [{ "int": "2" }] }, { "prim": "CDR" },
    { "prim": "DIP", "args": [[{ "prim": "DUP" }]] },
    { "prim": "SWAP" }, { "prim": "DUP" }, { "prim": "CAR" },
    { "prim": "CAR" },
    {
      "prim": "DIP",
      "args":
        [[{ "prim": "DUP" }, { "prim": "CAR" }, { "prim": "CDR" }]]
    },
    { "prim": "PAIR" },
    {
      "prim": "DIP",
      "args":
        [[{ "prim": "DUP" }, { "prim": "CDR" },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "DIP",
              "args": [[{ "prim": "DUP" }]]
            },
            { "prim": "SWAP" }]]
        }, { "prim": "PAIR" }]]
    },
    { "prim": "PAIR" },
    {
      "prim": "DIP",
      "args":
        [[{
          "prim": "DIP",
          "args": [{ "int": "3" }, [{ "prim": "DUP" }]]
        },
        { "prim": "DIG", "args": [{ "int": "3" }] }]]
    },
    { "prim": "EXEC" },
    { "prim": "DIP", "args": [[{ "prim": "DROP" }]] },
    { "prim": "NIL", "args": [{ "prim": "operation" }] },
    { "prim": "PAIR" },
    {
      "prim": "DIP",
      "args": [[{ "prim": "DROP", "args": [{ "int": "4" }] }]]
    }]]
}]
