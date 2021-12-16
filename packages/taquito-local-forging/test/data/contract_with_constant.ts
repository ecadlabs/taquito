export const storageContractWithConstant =  {
    "int": "2"
};
export const codeContractWithConstant = [
    {
        "prim": "parameter",
        "args": [
            {
                "prim": "or",
                "args": [
                    {
                        "prim": "or",
                        "args": [
                            {
                                "prim": "int",
                                "annots": [
                                    "%decrement"
                                ]
                            },
                            {
                                "prim": "int",
                                "annots": [
                                    "%increment"
                                ]
                            }
                        ]
                    },
                    {
                        "prim": "unit",
                        "annots": [
                            "%reset"
                        ]
                    }
                ]
            }
        ]
    },
    {
        "prim": "storage",
        "args": [
            {
                "prim": "constant",
                "args": [
                    {
                        "string": "expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre"
                    }
                ]
            }
        ]
    },
    {
        "prim": "code",
        "args": [
            [
                {
                    "prim": "UNPAIR"
                },
                {
                    "prim": "constant",
                    "args": [
                        {
                            "string": "expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe"
                        }
                    ]
                },
                {
                    "prim": "NIL",
                    "args": [
                        {
                            "prim": "operation"
                        }
                    ]
                },
                {
                    "prim": "PAIR"
                }
            ]
        ]
    }
]