export const scriptNoMetadata = {
    code: [
        {
            prim: "parameter",
            args: [
                {
                    prim: "nat"
                }
            ]
        },
        {
            prim: "storage",
            args: [
                {
                    prim: "map",
                    args: [
                        {
                            prim: "nat"
                        },
                        {
                            prim: "pair",
                            args: [
                                {
                                    prim: "nat",
                                    annots: [
                                        "%current_stock"
                                    ]
                                },
                                {
                                    prim: "mutez",
                                    annots: [
                                        "%max_price"
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            prim: "code",
            args: [
                [
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "CAR"
                    },
                    {
                        prim: "DIG",
                        args: [
                            {
                                int: "1"
                            }
                        ]
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "DUG",
                        args: [
                            {
                                int: "2"
                            }
                        ]
                    },
                    {
                        prim: "CDR"
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "DIG",
                        args: [
                            {
                                int: "2"
                            }
                        ]
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "DUG",
                        args: [
                            {
                                int: "3"
                            }
                        ]
                    },
                    {
                        prim: "GET"
                    },
                    {
                        prim: "IF_NONE",
                        args: [
                            [
                                {
                                    prim: "PUSH",
                                    args: [
                                        {
                                            prim: "string"
                                        },
                                        {
                                            string: "Unknown kind of taco."
                                        }
                                    ]
                                },
                                {
                                    prim: "FAILWITH"
                                }
                            ],
                            [
                                {
                                    prim: "DUP"
                                },
                                {
                                    prim: "DIP",
                                    args: [
                                        [
                                            {
                                                prim: "DROP"
                                            }
                                        ]
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "CAR"
                    },
                    {
                        prim: "DIG",
                        args: [
                            {
                                int: "1"
                            }
                        ]
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "DUG",
                        args: [
                            {
                                int: "2"
                            }
                        ]
                    },
                    {
                        prim: "CDR"
                    },
                    {
                        prim: "EDIV"
                    },
                    {
                        prim: "IF_NONE",
                        args: [
                            [
                                {
                                    prim: "PUSH",
                                    args: [
                                        {
                                            prim: "string"
                                        },
                                        {
                                            string: "DIV by 0"
                                        }
                                    ]
                                },
                                {
                                    prim: "FAILWITH"
                                }
                            ],
                            []
                        ]
                    },
                    {
                        prim: "CAR"
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "AMOUNT"
                    },
                    {
                        prim: "COMPARE"
                    },
                    {
                        prim: "NEQ"
                    },
                    {
                        prim: "IF",
                        args: [
                            [
                                {
                                    prim: "PUSH",
                                    args: [
                                        {
                                            prim: "string"
                                        },
                                        {
                                            string: "Sorry, the taco you are trying to purchase has a different price"
                                        }
                                    ]
                                },
                                {
                                    prim: "FAILWITH"
                                }
                            ],
                            [
                                {
                                    prim: "PUSH",
                                    args: [
                                        {
                                            prim: "unit"
                                        },
                                        {
                                            prim: "Unit"
                                        }
                                    ]
                                }
                            ]
                        ]
                    },
                    {
                        prim: "DIG",
                        args: [
                            {
                                int: "2"
                            }
                        ]
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "DUG",
                        args: [
                            {
                                int: "3"
                            }
                        ]
                    },
                    {
                        prim: "PUSH",
                        args: [
                            {
                                prim: "nat"
                            },
                            {
                                int: "1"
                            }
                        ]
                    },
                    {
                        prim: "DIG",
                        args: [
                            {
                                int: "4"
                            }
                        ]
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "DUG",
                        args: [
                            {
                                int: "5"
                            }
                        ]
                    },
                    {
                        prim: "CAR"
                    },
                    {
                        prim: "SUB"
                    },
                    {
                        prim: "ABS"
                    },
                    {
                        prim: "SWAP"
                    },
                    {
                        prim: "CDR"
                    },
                    {
                        prim: "SWAP"
                    },
                    {
                        prim: "PAIR"
                    },
                    {
                        prim: "DIG",
                        args: [
                            {
                                int: "4"
                            }
                        ]
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "DUG",
                        args: [
                            {
                                int: "5"
                            }
                        ]
                    },
                    {
                        prim: "DIG",
                        args: [
                            {
                                int: "1"
                            }
                        ]
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "DUG",
                        args: [
                            {
                                int: "2"
                            }
                        ]
                    },
                    {
                        prim: "DIG",
                        args: [
                            {
                                int: "7"
                            }
                        ]
                    },
                    {
                        prim: "DUP"
                    },
                    {
                        prim: "DUG",
                        args: [
                            {
                                int: "8"
                            }
                        ]
                    },
                    {
                        prim: "SWAP"
                    },
                    {
                        prim: "SOME"
                    },
                    {
                        prim: "SWAP"
                    },
                    {
                        prim: "UPDATE"
                    },
                    {
                        prim: "NIL",
                        args: [
                            {
                                prim: "operation"
                            }
                        ]
                    },
                    {
                        prim: "PAIR"
                    },
                    {
                        prim: "DIP",
                        args: [
                            [
                                {
                                    prim: "DROP",
                                    args: [
                                        {
                                            int: "7"
                                        }
                                    ]
                                }
                            ]
                        ]
                    }
                ]
            ]
        }
    ],
    storage: [
        {
            prim: "Elt",
            args: [
                {
                    int: "1"
                },
                {
                    prim: "Pair",
                    args: [
                        {
                            int: "9983"
                        },
                        {
                            int: "50"
                        }
                    ]
                }
            ]
        },
        {
            prim: "Elt",
            args: [
                {
                    int: "2"
                },
                {
                    prim: "Pair",
                    args: [
                        {
                            int: "120"
                        },
                        {
                            int: "20"
                        }
                    ]
                }
            ]
        },
        {
            prim: "Elt",
            args: [
                {
                    int: "3"
                },
                {
                    prim: "Pair",
                    args: [
                        {
                            int: "50"
                        },
                        {
                            int: "60"
                        }
                    ]
                }
            ]
        }
    ]
}