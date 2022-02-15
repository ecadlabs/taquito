export const voteSampleGlobalConstants = [{
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
                [{ "prim": 'constant', "args": [{ "string": 'expruv45XuhGc4fdRzTwwXpmp2ZyqwmUYeMmnKbxkCn5Q8uCtwkhM6' }] }, 
                { "prim": 'constant', "args": [{ "string": 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }] }]
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