export const managerCode = [{
    "prim": "parameter",
    "args":
        [{
            "prim": "or",
            "args":
                [{
                    "prim": "lambda",
                    "args":
                        [{ "prim": "unit" },
                        {
                            "prim": "list",
                            "args": [{ "prim": "operation" }]
                        }],
                    "annots": ["%do"]
                },
                { "prim": "unit", "annots": ["%default"] }]
        }]
},
{ "prim": "storage", "args": [{ "prim": "key_hash" }] },
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
                [[{
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
                [{
                    "prim": "DIP",
                    "args": [[{ "prim": "DUP" }]]
                },
                { "prim": "SWAP" }],
                { "prim": "IMPLICIT_ACCOUNT" },
                { "prim": "ADDRESS" },
                { "prim": "SENDER" },
                [[{ "prim": "COMPARE" },
                { "prim": "EQ" }],
                {
                    "prim": "IF",
                    "args":
                        [[],
                        [[{ "prim": "UNIT" },
                        { "prim": "FAILWITH" }]]]
                }],
                { "prim": "UNIT" }, { "prim": "EXEC" },
                { "prim": "PAIR" }],
                [{ "prim": "DROP" },
                {
                    "prim": "NIL",
                    "args": [{ "prim": "operation" }]
                },
                { "prim": "PAIR" }]]
        }]]
}]