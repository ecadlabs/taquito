export const code = {
    "code":
        [{
            "prim": "parameter",
            "args":
                [{
                    "prim": "option",
                    "args": [{ "prim": "key_hash" }]
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
                                    "prim": "address",
                                    "annots": ["%addr"]
                                },
                                {
                                    "prim": "option",
                                    "args": [{ "prim": "key_hash" }],
                                    "annots": ["%key"]
                                }],
                            "annots": ["%mgr1"]
                        },
                        {
                            "prim": "pair",
                            "args":
                                [{
                                    "prim": "address",
                                    "annots": ["%addr"]
                                },
                                {
                                    "prim": "option",
                                    "args": [{ "prim": "key_hash" }],
                                    "annots": ["%key"]
                                }],
                            "annots": ["%mgr2"]
                        }]
                }]
        },
        {
            "prim": "code",
            "args":
                [[{ "prim": "DUP" },
                [{ "prim": "CDR" }, { "prim": "CAR" },
                { "prim": "CAR", "annots": ["%addr", "@%"] }],
                { "prim": "SENDER" },
                { "prim": "PAIR", "annots": ["%@", "%@"] },
                [[{ "prim": "DUP" }, { "prim": "CAR" },
                {
                    "prim": "DIP",
                    "args": [[{ "prim": "CDR" }]]
                }]],
                [{ "prim": "COMPARE" }, { "prim": "EQ" },
                {
                    "prim": "IF",
                    "args":
                        [[[[{ "prim": "DUP" },
                        { "prim": "CAR" },
                        {
                            "prim": "DIP",
                            "args": [[{ "prim": "CDR" }]]
                        }]],
                        { "prim": "SWAP" },
                        [{ "prim": "DUP" },
                        {
                            "prim": "DIP",
                            "args":
                                [[{
                                    "prim": "CAR",
                                    "annots": ["@%%"]
                                },
                                [{ "prim": "DUP" },
                                {
                                    "prim": "CDR",
                                    "annots": ["%key"]
                                },
                                { "prim": "DROP" },
                                {
                                    "prim": "CAR",
                                    "annots": ["@%%"]
                                },
                                {
                                    "prim": "PAIR",
                                    "annots":
                                        ["%@", "%key"]
                                }]]]
                        },
                        {
                            "prim": "CDR",
                            "annots": ["@%%"]
                        },
                        { "prim": "SWAP" },
                        {
                            "prim": "PAIR",
                            "annots":
                                ["%@", "%@",
                                    "@changed_mgr1_key"]
                        }]],
                        [{ "prim": "DUP" },
                        [{ "prim": "CDR" }, { "prim": "CDR" },
                        { "prim": "CAR" }],
                        { "prim": "SENDER" },
                        [{ "prim": "COMPARE" },
                        { "prim": "EQ" },
                        {
                            "prim": "IF",
                            "args":
                                [[[[{ "prim": "DUP" },
                                { "prim": "CAR" },
                                {
                                    "prim": "DIP",
                                    "args":
                                        [[{ "prim": "CDR" }]]
                                }]],
                                { "prim": "SWAP" },
                                [{ "prim": "DUP" },
                                {
                                    "prim": "DIP",
                                    "args":
                                        [[{
                                            "prim": "CDR",
                                            "annots":
                                                ["@%%"]
                                        },
                                        [{ "prim": "DUP" },
                                        {
                                            "prim": "CDR",
                                            "annots":
                                                ["%key"]
                                        },
                                        { "prim": "DROP" },
                                        {
                                            "prim": "CAR",
                                            "annots":
                                                ["@%%"]
                                        },
                                        {
                                            "prim": "PAIR",
                                            "annots":
                                                ["%@",
                                                    "%key"]
                                        }]]]
                                },
                                {
                                    "prim": "CAR",
                                    "annots": ["@%%"]
                                },
                                {
                                    "prim": "PAIR",
                                    "annots": ["%@", "%@"]
                                }]],
                                [[{ "prim": "UNIT" },
                                { "prim": "FAILWITH" }]]]
                        }]]]
                }],
                { "prim": "DUP" },
                [{ "prim": "CAR" }, { "prim": "CDR" }],
                {
                    "prim": "DIP",
                    "args":
                        [[{ "prim": "DUP" },
                        [{ "prim": "CDR" }, { "prim": "CDR" }]]]
                },
                {
                    "prim": "IF_NONE",
                    "args":
                        [[{
                            "prim": "IF_NONE",
                            "args":
                                [[{
                                    "prim": "NONE",
                                    "args":
                                        [{ "prim": "key_hash" }]
                                },
                                { "prim": "SET_DELEGATE" },
                                {
                                    "prim": "NIL",
                                    "args":
                                        [{ "prim": "operation" }]
                                },
                                { "prim": "SWAP" },
                                { "prim": "CONS" }],
                                [{ "prim": "DROP" },
                                {
                                    "prim": "NIL",
                                    "args":
                                        [{ "prim": "operation" }]
                                }]]
                        }],
                        [{ "prim": "SWAP" },
                        [{
                            "prim": "IF_NONE",
                            "args":
                                [[{ "prim": "DROP" },
                                {
                                    "prim": "NIL",
                                    "args":
                                        [{ "prim": "operation" }]
                                }],
                                [{
                                    "prim": "DIP",
                                    "args":
                                        [[{ "prim": "DUP" }]]
                                },
                                [{ "prim": "COMPARE" },
                                { "prim": "EQ" },
                                {
                                    "prim": "IF",
                                    "args":
                                        [[{ "prim": "SOME" },
                                        {
                                            "prim":
                                                "SET_DELEGATE"
                                        },
                                        {
                                            "prim": "NIL",
                                            "args":
                                                [{
                                                    "prim":
                                                        "operation"
                                                }]
                                        },
                                        { "prim": "SWAP" },
                                        { "prim": "CONS" }],
                                        [{ "prim": "DROP" },
                                        {
                                            "prim": "NIL",
                                            "args":
                                                [{
                                                    "prim":
                                                        "operation"
                                                }]
                                        }]]
                                }]]]
                        }]]]
                },
                { "prim": "PAIR" }]]
        }]
}

export const storage = code.code.find((x: any) => x.prim === 'storage') as any;
export const parameter = code.code.find((x: any) => x.prim === 'parameter') as any;