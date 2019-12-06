export const genericMultisig = [{
  "prim": "parameter",
  "args":
    [{
      "prim": "or",
      "args":
        [{ "prim": "unit", "annots": ["%default"] },
        {
          "prim": "pair",
          "args":
            [{
              "prim": "pair",
              "args":
                [{
                  "prim": "nat",
                  "annots": ["%counter"]
                },
                {
                  "prim": "or",
                  "args":
                    [{
                      "prim": "lambda",
                      "args":
                        [{ "prim": "unit" },
                        {
                          "prim": "list",
                          "args":
                            [{
                              "prim":
                                "operation"
                            }]
                        }],
                      "annots":
                        ["%operation"]
                    },
                    {
                      "prim": "pair",
                      "args":
                        [{
                          "prim": "nat",
                          "annots":
                            ["%threshold"]
                        },
                        {
                          "prim": "list",
                          "args":
                            [{ "prim": "key" }],
                          "annots":
                            ["%keys"]
                        }],
                      "annots":
                        ["%change_keys"]
                    }],
                  "annots": [":action"]
                }],
              "annots": [":payload"]
            },
            {
              "prim": "list",
              "args":
                [{
                  "prim": "option",
                  "args":
                    [{ "prim": "signature" }]
                }],
              "annots": ["%sigs"]
            }],
          "annots": ["%main"]
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
          "prim": "nat",
          "annots": ["%stored_counter"]
        },
        {
          "prim": "pair",
          "args":
            [{
              "prim": "nat",
              "annots": ["%threshold"]
            },
            {
              "prim": "list",
              "args": [{ "prim": "key" }],
              "annots": ["%keys"]
            }]
        }]
    }]
},
{
  "prim": "code",
  "args":
    [[[[{ "prim": "DUP" }, { "prim": "CAR" },
    {
      "prim": "DIP",
      "args": [[{ "prim": "CDR" }]]
    }]],
    {
      "prim": "IF_LEFT",
      "args":
        [[{ "prim": "DROP" },
        {
          "prim": "NIL",
          "args": [{ "prim": "operation" }]
        },
        { "prim": "PAIR" }],
        [{
          "prim": "PUSH",
          "args":
            [{ "prim": "mutez" },
            { "int": "0" }]
        },
        { "prim": "AMOUNT" },
        [[{ "prim": "COMPARE" },
        { "prim": "EQ" }],
        {
          "prim": "IF",
          "args":
            [[],
            [[{ "prim": "UNIT" },
            { "prim": "FAILWITH" }]]]
        }],
        { "prim": "SWAP" }, { "prim": "DUP" },
        {
          "prim": "DIP",
          "args": [[{ "prim": "SWAP" }]]
        },
        {
          "prim": "DIP",
          "args":
            [[[[{ "prim": "DUP" },
            { "prim": "CAR" },
            {
              "prim": "DIP",
              "args":
                [[{ "prim": "CDR" }]]
            }]],
            { "prim": "DUP" },
            { "prim": "SELF" },
            { "prim": "ADDRESS" },
            { "prim": "PAIR" },
            { "prim": "PACK" },
            {
              "prim": "DIP",
              "args":
                [[[[{ "prim": "DUP" },
                {
                  "prim": "CAR",
                  "annots":
                    ["@counter"]
                },
                {
                  "prim": "DIP",
                  "args":
                    [[{
                      "prim":
                        "CDR"
                    }]]
                }]],
                {
                  "prim": "DIP",
                  "args":
                    [[{ "prim": "SWAP" }]]
                }]]
            },
            { "prim": "SWAP" }]]
        },
        [[{ "prim": "DUP" },
        {
          "prim": "CAR",
          "annots": ["@stored_counter"]
        },
        {
          "prim": "DIP",
          "args": [[{ "prim": "CDR" }]]
        }]],
        {
          "prim": "DIP",
          "args": [[{ "prim": "SWAP" }]]
        },
        [[{ "prim": "COMPARE" },
        { "prim": "EQ" }],
        {
          "prim": "IF",
          "args":
            [[],
            [[{ "prim": "UNIT" },
            { "prim": "FAILWITH" }]]]
        }],
        {
          "prim": "DIP",
          "args": [[{ "prim": "SWAP" }]]
        },
        [[{ "prim": "DUP" },
        {
          "prim": "CAR",
          "annots": ["@threshold"]
        },
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "CDR",
              "annots": ["@keys"]
            }]]
        }]],
        {
          "prim": "DIP",
          "args":
            [[{
              "prim": "PUSH",
              "args":
                [{ "prim": "nat" },
                { "int": "0" }],
              "annots": ["@valid"]
            },
            { "prim": "SWAP" },
            {
              "prim": "ITER",
              "args":
                [[{
                  "prim": "DIP",
                  "args":
                    [[{ "prim": "SWAP" }]]
                },
                { "prim": "SWAP" },
                {
                  "prim": "IF_CONS",
                  "args":
                    [[[{
                      "prim":
                        "IF_NONE",
                      "args":
                        [[{
                          "prim":
                            "SWAP"
                        },
                        {
                          "prim":
                            "DROP"
                        }],
                        [{
                          "prim":
                            "SWAP"
                        },
                        {
                          "prim":
                            "DIP",
                          "args":
                            [[{
                              "prim":
                                "SWAP"
                            },
                            {
                              "prim":
                                "DIP",
                              "args":
                                [{
                                  "int":
                                    "2"
                                },
                                [[{
                                  "prim":
                                    "DIP",
                                  "args":
                                    [[{
                                      "prim":
                                        "DUP"
                                    }]]
                                },
                                {
                                  "prim":
                                    "SWAP"
                                }]]]
                            },
                            [[{
                              "prim":
                                "DIP",
                              "args":
                                [{
                                  "int":
                                    "2"
                                },
                                [{
                                  "prim":
                                    "DUP"
                                }]]
                            },
                            {
                              "prim":
                                "DIG",
                              "args":
                                [{
                                  "int":
                                    "3"
                                }]
                            }],
                            {
                              "prim":
                                "DIP",
                              "args":
                                [[{
                                  "prim":
                                    "CHECK_SIGNATURE"
                                }]]
                            },
                            {
                              "prim":
                                "SWAP"
                            },
                            {
                              "prim":
                                "IF",
                              "args":
                                [[{
                                  "prim":
                                    "DROP"
                                }],
                                [{
                                  "prim":
                                    "FAILWITH"
                                }]]
                            }],
                            {
                              "prim":
                                "PUSH",
                              "args":
                                [{
                                  "prim":
                                    "nat"
                                },
                                {
                                  "int":
                                    "1"
                                }]
                            },
                            {
                              "prim":
                                "ADD",
                              "annots":
                                ["@valid"]
                            }]]
                        }]]
                    }]],
                    [[{
                      "prim":
                        "UNIT"
                    },
                    {
                      "prim":
                        "FAILWITH"
                    }]]]
                },
                { "prim": "SWAP" }]]
            }]]
        },
        [[{ "prim": "COMPARE" },
        { "prim": "LE" }],
        {
          "prim": "IF",
          "args":
            [[],
            [[{ "prim": "UNIT" },
            { "prim": "FAILWITH" }]]]
        }],
        {
          "prim": "IF_CONS",
          "args":
            [[[{ "prim": "UNIT" },
            { "prim": "FAILWITH" }]],
            []]
        }, { "prim": "DROP" },
        {
          "prim": "DIP",
          "args":
            [[[[{ "prim": "DUP" },
            { "prim": "CAR" },
            {
              "prim": "DIP",
              "args":
                [[{ "prim": "CDR" }]]
            }]],
            {
              "prim": "PUSH",
              "args":
                [{ "prim": "nat" },
                { "int": "1" }]
            },
            {
              "prim": "ADD",
              "annots": ["@new_counter"]
            },
            { "prim": "PAIR" }]]
        },
        {
          "prim": "IF_LEFT",
          "args":
            [[{ "prim": "UNIT" },
            { "prim": "EXEC" }],
            [{
              "prim": "DIP",
              "args":
                [[{ "prim": "CAR" }]]
            },
            { "prim": "SWAP" },
            { "prim": "PAIR" },
            {
              "prim": "NIL",
              "args":
                [{ "prim": "operation" }]
            }]]
        },
        { "prim": "PAIR" }]]
    }]]
}]
