import { MichelsonType, MichelsonData } from "../src/michelson-types";
import { assertDataValid } from "../src/michelson-typecheck";

const typedef: MichelsonType = {
    "prim": "pair",
    "args": [
        {
            "prim": "pair",
            "args": [
                {
                    "prim": "pair",
                    "args": [
                        {
                            "prim": "int",
                            "annots": [
                                "%capitalAmount"
                            ]
                        },
                        {
                            "prim": "nat",
                            "annots": [
                                "%couponRate_inPerc"
                            ]
                        }
                    ]
                },
                {
                    "prim": "pair",
                    "args": [
                        {
                            "prim": "map",
                            "args": [
                                {
                                    "prim": "address"
                                },
                                {
                                    "prim": "pair",
                                    "args": [
                                        {
                                            "prim": "pair",
                                            "args": [
                                                {
                                                    "prim": "pair",
                                                    "args": [
                                                        {
                                                            "prim": "nat",
                                                            "annots": [
                                                                "%creditAmount"
                                                            ]
                                                        },
                                                        {
                                                            "prim": "timestamp",
                                                            "annots": [
                                                                "%initialTime"
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    "prim": "pair",
                                                    "args": [
                                                        {
                                                            "prim": "bool",
                                                            "annots": [
                                                                "%is_final"
                                                            ]
                                                        },
                                                        {
                                                            "prim": "timestamp",
                                                            "annots": [
                                                                "%maturityTime"
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "prim": "nat",
                                            "annots": [
                                                "%paybackAmount"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "annots": [
                                "%creditorsMap"
                            ]
                        },
                        {
                            "prim": "address",
                            "annots": [
                                "%debtor"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "prim": "int",
            "annots": [
                "%totalCredit"
            ]
        }
    ]
};

const data: MichelsonData<typeof typedef> = {
    "prim": "Pair",
    "args": [
        {
            "prim": "Pair",
            "args": [
                {
                    "prim": "Pair",
                    "args": [
                        {
                            "int": "1000"
                        },
                        {
                            "int": "9"
                        }
                    ]
                },
                {
                    "prim": "Pair",
                    "args": [
                        [
                            {
                                "prim": "Elt",
                                "args": [
                                    {
                                        "string": "tz1VmUWL8DxseZnPTdhHQkkuk6nK55NVdKCG"
                                    },
                                    {
                                        "prim": "Pair",
                                        "args": [
                                            {
                                                "prim": "Pair",
                                                "args": [
                                                    {
                                                        "prim": "Pair",
                                                        "args": [
                                                            {
                                                                "int": "50000000"
                                                            },
                                                            {
                                                                "string": "2020-06-21T00:39:07Z"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "prim": "Pair",
                                                        "args": [
                                                            {
                                                                "prim": "True"
                                                            },
                                                            {
                                                                "string": "2020-06-25T03:05:48Z"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "int": "50001694"
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                "prim": "Elt",
                                "args": [
                                    {
                                        "string": "tz1g4Kw2qhYELxeeHc2yiuLtPdovVckYNc6G"
                                    },
                                    {
                                        "prim": "Pair",
                                        "args": [
                                            {
                                                "prim": "Pair",
                                                "args": [
                                                    {
                                                        "prim": "Pair",
                                                        "args": [
                                                            {
                                                                "int": "50000000"
                                                            },
                                                            {
                                                                "string": "2020-06-21T03:05:48Z"
                                                            }
                                                        ]
                                                    },
                                                    {
                                                        "prim": "Pair",
                                                        "args": [
                                                            {
                                                                "prim": "False"
                                                            },
                                                            {
                                                                "string": "2020-06-21T00:39:07Z"
                                                            }
                                                        ]
                                                    }
                                                ]
                                            },
                                            {
                                                "int": "106"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ],
                        {
                            "string": "tz1NBWgCxEGy8U6UA4hRmemt3YmMXbPPe1YH"
                        }
                    ]
                }
            ]
        },
        {
            "int": "50000000"
        }
    ]
};

it('assertDataValid', () => {
    assertDataValid(typedef, data);
});