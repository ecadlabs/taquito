export const fa2TokenFactory = [
    {
        prim: 'parameter',
        args: [
            {
                prim: 'or',
                args: [
                    {
                        prim: 'or',
                        args: [
                            {
                                prim: 'or',
                                args: [
                                    {
                                        prim: 'or',
                                        args: [
                                            {
                                                prim: 'pair',
                                                args: [
                                                    {
                                                        prim: 'list',
                                                        args: [
                                                            {
                                                                prim: 'pair',
                                                                args: [
                                                                    { prim: 'address', annots: ['%owner'] },
                                                                    { prim: 'nat', annots: ['%token_id'] }
                                                                ]
                                                            }
                                                        ],
                                                        annots: ['%requests']
                                                    },
                                                    {
                                                        prim: 'contract',
                                                        args: [
                                                            {
                                                                prim: 'list',
                                                                args: [
                                                                    {
                                                                        prim: 'pair',
                                                                        args: [
                                                                            {
                                                                                prim: 'pair',
                                                                                args: [
                                                                                    {
                                                                                        prim: 'address',
                                                                                        annots: ['%owner']
                                                                                    },
                                                                                    {
                                                                                        prim: 'nat',
                                                                                        annots: ['%token_id']
                                                                                    }
                                                                                ],
                                                                                annots: ['%request']
                                                                            },
                                                                            { prim: 'nat', annots: ['%balance'] }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ],
                                                        annots: ['%callback']
                                                    }
                                                ],
                                                annots: ['%balance_of']
                                            },
                                            {
                                                prim: 'pair',
                                                args: [{ prim: 'nat' }, { prim: 'nat' }],
                                                annots: ['%burn_tokens']
                                            }
                                        ]
                                    },
                                    {
                                        prim: 'or',
                                        args: [
                                            {
                                                prim: 'pair',
                                                args: [
                                                    { prim: 'nat', annots: ['%order_id'] },
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            { prim: 'nat', annots: ['%token_to_buy'] },
                                                            { prim: 'nat', annots: ['%amount'] }
                                                        ]
                                                    }
                                                ],
                                                annots: ['%buy_from_exchange']
                                            },
                                            { prim: 'unit', annots: ['%buy_xtz_wrapper'] }
                                        ]
                                    }
                                ]
                            },
                            {
                                prim: 'or',
                                args: [
                                    {
                                        prim: 'or',
                                        args: [
                                            {
                                                prim: 'pair',
                                                args: [
                                                    { prim: 'nat', annots: ['%order_id'] },
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            {
                                                                prim: 'pair',
                                                                args: [{ prim: 'nat' }, { prim: 'nat' }],
                                                                annots: ['%token_ids']
                                                            },
                                                            {
                                                                prim: 'pair',
                                                                args: [
                                                                    { prim: 'bool', annots: ['%status'] },
                                                                    {
                                                                        prim: 'pair',
                                                                        args: [
                                                                            {
                                                                                prim: 'pair',
                                                                                args: [
                                                                                    {
                                                                                        prim: 'address',
                                                                                        annots: ['%owner']
                                                                                    },
                                                                                    {
                                                                                        prim: 'nat',
                                                                                        annots: ['%token_id']
                                                                                    }
                                                                                ],
                                                                                annots: ['%from_']
                                                                            },
                                                                            {
                                                                                prim: 'pair',
                                                                                args: [
                                                                                    {
                                                                                        prim: 'address',
                                                                                        annots: ['%owner']
                                                                                    },
                                                                                    {
                                                                                        prim: 'nat',
                                                                                        annots: ['%token_id']
                                                                                    }
                                                                                ],
                                                                                annots: ['%to_']
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                annots: ['%confirm_buy_from_exchange']
                                            },
                                            {
                                                prim: 'pair',
                                                args: [
                                                    { prim: 'nat', annots: ['%token_id'] },
                                                    { prim: 'nat', annots: ['%tokens_to_mint'] }
                                                ],
                                                annots: ['%mint_more_tokens']
                                            }
                                        ]
                                    },
                                    {
                                        prim: 'or',
                                        args: [
                                            {
                                                prim: 'pair',
                                                args: [
                                                    { prim: 'bytes', annots: ['%metadata'] },
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            { prim: 'nat', annots: ['%total_supply'] },
                                                            { prim: 'bool', annots: ['%can_mint_more'] }
                                                        ]
                                                    }
                                                ],
                                                annots: ['%mint_tokens']
                                            },
                                            {
                                                prim: 'pair',
                                                args: [
                                                    {
                                                        prim: 'or',
                                                        args: [
                                                            { prim: 'unit', annots: ['%buy'] },
                                                            { prim: 'unit', annots: ['%sell'] }
                                                        ],
                                                        annots: ['%order_type']
                                                    },
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            { prim: 'nat', annots: ['%token_id_to_sell'] },
                                                            {
                                                                prim: 'pair',
                                                                args: [
                                                                    {
                                                                        prim: 'nat',
                                                                        annots: ['%token_amount_to_sell']
                                                                    },
                                                                    {
                                                                        prim: 'pair',
                                                                        args: [
                                                                            {
                                                                                prim: 'nat',
                                                                                annots: ['%token_id_to_buy']
                                                                            },
                                                                            {
                                                                                prim: 'pair',
                                                                                args: [
                                                                                    {
                                                                                        prim: 'nat',
                                                                                        annots: [
                                                                                            '%token_amount_to_buy'
                                                                                        ]
                                                                                    },
                                                                                    {
                                                                                        prim: 'pair',
                                                                                        args: [
                                                                                            {
                                                                                                prim: 'nat',
                                                                                                annots: [
                                                                                                    '%total_token_amount'
                                                                                                ]
                                                                                            },
                                                                                            {
                                                                                                prim: 'address',
                                                                                                annots: ['%seller']
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                annots: ['%new_exchange_order']
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        prim: 'or',
                        args: [
                            {
                                prim: 'or',
                                args: [
                                    {
                                        prim: 'or',
                                        args: [
                                            { prim: 'nat', annots: ['%redeem_xtz_wrapper'] },
                                            {
                                                prim: 'contract',
                                                args: [{ prim: 'address' }],
                                                annots: ['%token_metadata_registry']
                                            }
                                        ]
                                    },
                                    {
                                        prim: 'or',
                                        args: [
                                            {
                                                prim: 'list',
                                                args: [
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            { prim: 'address', annots: ['%from_'] },
                                                            {
                                                                prim: 'list',
                                                                args: [
                                                                    {
                                                                        prim: 'pair',
                                                                        args: [
                                                                            { prim: 'address', annots: ['%to_'] },
                                                                            {
                                                                                prim: 'pair',
                                                                                args: [
                                                                                    {
                                                                                        prim: 'nat',
                                                                                        annots: ['%token_id']
                                                                                    },
                                                                                    {
                                                                                        prim: 'nat',
                                                                                        annots: ['%amount']
                                                                                    }
                                                                                ]
                                                                            }
                                                                        ]
                                                                    }
                                                                ],
                                                                annots: ['%txs']
                                                            }
                                                        ]
                                                    }
                                                ],
                                                annots: ['%transfer']
                                            },
                                            { prim: 'address', annots: ['%update_exchange_address'] }
                                        ]
                                    }
                                ]
                            },
                            {
                                prim: 'list',
                                args: [
                                    {
                                        prim: 'or',
                                        args: [
                                            {
                                                prim: 'pair',
                                                args: [
                                                    { prim: 'address', annots: ['%owner'] },
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            { prim: 'address', annots: ['%operator'] },
                                                            { prim: 'nat', annots: ['%token_id'] }
                                                        ]
                                                    }
                                                ],
                                                annots: ['%add_operator']
                                            },
                                            {
                                                prim: 'pair',
                                                args: [
                                                    { prim: 'address', annots: ['%owner'] },
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            { prim: 'address', annots: ['%operator'] },
                                                            { prim: 'nat', annots: ['%token_id'] }
                                                        ]
                                                    }
                                                ],
                                                annots: ['%remove_operator']
                                            }
                                        ]
                                    }
                                ],
                                annots: ['%update_operators']
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        prim: 'storage',
        args: [
            {
                prim: 'pair',
                args: [
                    {
                        prim: 'pair',
                        args: [
                            {
                                prim: 'pair',
                                args: [
                                    {
                                        prim: 'pair',
                                        args: [
                                            { prim: 'address', annots: ['%admin'] },
                                            { prim: 'address', annots: ['%exchange_address'] }
                                        ]
                                    },
                                    {
                                        prim: 'pair',
                                        args: [
                                            { prim: 'nat', annots: ['%last_token_id'] },
                                            {
                                                prim: 'big_map',
                                                args: [
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            { prim: 'address', annots: ['%owner'] },
                                                            { prim: 'nat', annots: ['%token_id'] }
                                                        ]
                                                    },
                                                    { prim: 'nat' }
                                                ],
                                                annots: ['%ledger']
                                            }
                                        ]
                                    }
                                ]
                            },
                            {
                                prim: 'pair',
                                args: [
                                    {
                                        prim: 'pair',
                                        args: [
                                            {
                                                prim: 'big_map',
                                                args: [{ prim: 'string' }, { prim: 'bytes' }],
                                                annots: ['%metadata']
                                            },
                                            {
                                                prim: 'big_map',
                                                args: [
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            { prim: 'address', annots: ['%owner'] },
                                                            {
                                                                prim: 'pair',
                                                                args: [
                                                                    { prim: 'address', annots: ['%operator'] },
                                                                    { prim: 'nat', annots: ['%token_id'] }
                                                                ]
                                                            }
                                                        ]
                                                    },
                                                    { prim: 'unit' }
                                                ],
                                                annots: ['%operators']
                                            }
                                        ]
                                    },
                                    {
                                        prim: 'pair',
                                        args: [
                                            {
                                                prim: 'big_map',
                                                args: [
                                                    { prim: 'nat' },
                                                    { prim: 'pair', args: [{ prim: 'address' }, { prim: 'bool' }] }
                                                ],
                                                annots: ['%token_admins']
                                            },
                                            {
                                                prim: 'big_map',
                                                args: [
                                                    { prim: 'nat' },
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            { prim: 'nat' },
                                                            {
                                                                prim: 'map',
                                                                args: [{ prim: 'string' }, { prim: 'bytes' }]
                                                            }
                                                        ]
                                                    }
                                                ],
                                                annots: ['%token_metadata']
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    { prim: 'big_map', args: [{ prim: 'nat' }, { prim: 'nat' }], annots: ['%token_total_supply'] }
                ]
            }
        ]
    },
    {
        prim: 'code',
        args: [
            [
                { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'FA2_TOKEN_UNDEFINED' }] },
                { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'FA2_INSUFFICIENT_BALANCE' }] },
                {
                    prim: 'LAMBDA',
                    args: [
                        {
                            prim: 'pair',
                            args: [
                                { prim: 'address' },
                                { prim: 'pair', args: [{ prim: 'address' }, { prim: 'nat' }] }
                            ]
                        },
                        {
                            prim: 'pair',
                            args: [
                                { prim: 'pair', args: [{ prim: 'address' }, { prim: 'address' }] },
                                { prim: 'nat' }
                            ]
                        },
                        [
                            { prim: 'DUP' },
                            { prim: 'CDR' },
                            { prim: 'CDR' },
                            { prim: 'SWAP' },
                            { prim: 'DUP' },
                            { prim: 'DUG', args: [{ int: '2' }] },
                            { prim: 'CAR' },
                            { prim: 'DIG', args: [{ int: '2' }] },
                            { prim: 'CDR' },
                            { prim: 'CAR' },
                            { prim: 'PAIR' },
                            { prim: 'PAIR' }
                        ]
                    ]
                },
                {
                    prim: 'LAMBDA',
                    args: [
                        {
                            prim: 'pair',
                            args: [
                                { prim: 'pair', args: [{ prim: 'address' }, { prim: 'nat' }] },
                                {
                                    prim: 'big_map',
                                    args: [
                                        { prim: 'pair', args: [{ prim: 'address' }, { prim: 'nat' }] },
                                        { prim: 'nat' }
                                    ]
                                }
                            ]
                        },
                        { prim: 'nat' },
                        [
                            { prim: 'DUP' },
                            { prim: 'CDR' },
                            { prim: 'SWAP' },
                            { prim: 'CAR' },
                            { prim: 'GET' },
                            {
                                prim: 'IF_NONE',
                                args: [[{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] }], []]
                            }
                        ]
                    ]
                },
                { prim: 'DIG', args: [{ int: '4' }] },
                { prim: 'DUP' },
                { prim: 'DUG', args: [{ int: '5' }] },
                { prim: 'CDR' },
                { prim: 'DIG', args: [{ int: '5' }] },
                { prim: 'CAR' },
                {
                    prim: 'IF_LEFT',
                    args: [
                        [
                            { prim: 'DIG', args: [{ int: '3' }] },
                            { prim: 'DROP' },
                            {
                                prim: 'IF_LEFT',
                                args: [
                                    [
                                        { prim: 'DIG', args: [{ int: '3' }] },
                                        { prim: 'DROP' },
                                        {
                                            prim: 'IF_LEFT',
                                            args: [
                                                [
                                                    {
                                                        prim: 'IF_LEFT',
                                                        args: [
                                                            [
                                                                { prim: 'DUP' },
                                                                { prim: 'CAR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'CDR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DUP' },
                                                                { prim: 'CDR' },
                                                                { prim: 'MAP', args: [[]] },
                                                                { prim: 'SWAP' },
                                                                { prim: 'CAR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DUP' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'DUP' },
                                                                { prim: 'CDR' },
                                                                {
                                                                    prim: 'MAP',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '3' }] },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'MEM' },
                                                                            { prim: 'NOT' },
                                                                            {
                                                                                prim: 'IF',
                                                                                args: [
                                                                                    [
                                                                                        { prim: 'DROP' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '4' }]
                                                                                        },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '5' }]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    [
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'PAIR' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '5' }]
                                                                                        },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '6' }]
                                                                                        },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'EXEC' },
                                                                                        { prim: 'PAIR' },
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'PAIR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'PAIR' }
                                                                                    ]
                                                                                ]
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'CAR' },
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'mutez' }, { int: '0' }]
                                                                },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'TRANSFER_TOKENS' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'CONS' },
                                                                { prim: 'PAIR' }
                                                            ],
                                                            [
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'CAR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'GET' },
                                                                {
                                                                    prim: 'IF_NONE',
                                                                    args: [
                                                                        [
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'NO_TOKEN_FOUND' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        [
                                                                            { prim: 'SENDER' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'COMPARE' },
                                                                            { prim: 'NEQ' },
                                                                            {
                                                                                prim: 'IF',
                                                                                args: [
                                                                                    [
                                                                                        { prim: 'DROP' },
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                {
                                                                                                    string:
                                                                                                        'UNAUTHORIZED_ACTION'
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    [{ prim: 'CAR' }]
                                                                                ]
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'DROP' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'SENDER' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'GET' },
                                                                {
                                                                    prim: 'IF_NONE',
                                                                    args: [
                                                                        [
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'NO_BALANCE_FOUND' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        []
                                                                    ]
                                                                },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'COMPARE' },
                                                                { prim: 'LT' },
                                                                {
                                                                    prim: 'IF',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DROP', args: [{ int: '4' }] },
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'INSUFFICIENT_BALANCE' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        [
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'SUB' },
                                                                            { prim: 'ABS' },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '4' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'SOME' },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '4' }] },
                                                                            { prim: 'SENDER' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'UPDATE' },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '4' }] },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '4' }] },
                                                                            { prim: 'GET' },
                                                                            {
                                                                                prim: 'IF_NONE',
                                                                                args: [
                                                                                    [
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                {
                                                                                                    string:
                                                                                                        'NO_TOTAL_SUPPLY_FOUND'
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    []
                                                                                ]
                                                                            },
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '3' }] },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'COMPARE' },
                                                                            { prim: 'LT' },
                                                                            {
                                                                                prim: 'IF',
                                                                                args: [
                                                                                    [
                                                                                        {
                                                                                            prim: 'DROP',
                                                                                            args: [{ int: '5' }]
                                                                                        },
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                {
                                                                                                    string:
                                                                                                        'INSUFFICIENT_TOTAL_SUPPLY'
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    [
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'SUB' },
                                                                                        { prim: 'DROP' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '4' }]
                                                                                        },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        {
                                                                                            prim: 'DIP',
                                                                                            args: [
                                                                                                [
                                                                                                    { prim: 'DUP' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'DUP' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'DUP' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CAR' }
                                                                                                ]
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'PAIR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'PAIR' },
                                                                                        { prim: 'PAIR' },
                                                                                        { prim: 'PAIR' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'SOME' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'UPDATE' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'PAIR' }
                                                                                    ]
                                                                                ]
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'PAIR' }
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                [
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'DROP' },
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'DROP' },
                                                    {
                                                        prim: 'IF_LEFT',
                                                        args: [
                                                            [
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'SENDER' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'GET' },
                                                                {
                                                                    prim: 'IF_NONE',
                                                                    args: [
                                                                        [
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'NO_BALANCE' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        [
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'COMPARE' },
                                                                            { prim: 'LT' },
                                                                            {
                                                                                prim: 'IF',
                                                                                args: [
                                                                                    [
                                                                                        { prim: 'DROP' },
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                {
                                                                                                    string:
                                                                                                        'INSUFFICIENT_BALANCE'
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    []
                                                                                ]
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                {
                                                                    prim: 'CONTRACT',
                                                                    args: [
                                                                        {
                                                                            prim: 'pair',
                                                                            args: [
                                                                                {
                                                                                    prim: 'nat',
                                                                                    annots: ['%order_id']
                                                                                },
                                                                                {
                                                                                    prim: 'pair',
                                                                                    args: [
                                                                                        {
                                                                                            prim: 'nat',
                                                                                            annots: ['%amount_to_buy']
                                                                                        },
                                                                                        {
                                                                                            prim: 'pair',
                                                                                            args: [
                                                                                                {
                                                                                                    prim: 'address',
                                                                                                    annots: ['%buyer']
                                                                                                },
                                                                                                {
                                                                                                    prim: 'nat',
                                                                                                    annots: [
                                                                                                        '%buyer_balance'
                                                                                                    ]
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ],
                                                                    annots: ['%fulfill_order']
                                                                },
                                                                {
                                                                    prim: 'IF_NONE',
                                                                    args: [
                                                                        [
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'UNKNOWN_CONTRACT' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        []
                                                                    ]
                                                                },
                                                                { prim: 'SWAP' },
                                                                { prim: 'SENDER' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'mutez' }, { int: '0' }]
                                                                },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'TRANSFER_TOKENS' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'CONS' },
                                                                { prim: 'PAIR' }
                                                            ],
                                                            [
                                                                { prim: 'DROP' },
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'nat' }, { int: '1' }]
                                                                },
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'mutez' }, { int: '0' }]
                                                                },
                                                                { prim: 'AMOUNT' },
                                                                { prim: 'COMPARE' },
                                                                { prim: 'EQ' },
                                                                {
                                                                    prim: 'IF',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DROP', args: [{ int: '2' }] },
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'NO_AMOUNT_PROVIDED' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        [
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'SENDER' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'GET' },
                                                                            {
                                                                                prim: 'IF_NONE',
                                                                                args: [
                                                                                    [
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'mutez' },
                                                                                                { int: '1' }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'AMOUNT' },
                                                                                        { prim: 'EDIV' },
                                                                                        {
                                                                                            prim: 'IF_NONE',
                                                                                            args: [
                                                                                                [
                                                                                                    {
                                                                                                        prim: 'PUSH',
                                                                                                        args: [
                                                                                                            {
                                                                                                                prim:
                                                                                                                    'string'
                                                                                                            },
                                                                                                            {
                                                                                                                string:
                                                                                                                    'DIV by 0'
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'FAILWITH' }
                                                                                                ],
                                                                                                []
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'CAR' }
                                                                                    ],
                                                                                    [
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'mutez' },
                                                                                                { int: '1' }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'AMOUNT' },
                                                                                        { prim: 'EDIV' },
                                                                                        {
                                                                                            prim: 'IF_NONE',
                                                                                            args: [
                                                                                                [
                                                                                                    {
                                                                                                        prim: 'PUSH',
                                                                                                        args: [
                                                                                                            {
                                                                                                                prim:
                                                                                                                    'string'
                                                                                                            },
                                                                                                            {
                                                                                                                string:
                                                                                                                    'DIV by 0'
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'FAILWITH' }
                                                                                                ],
                                                                                                []
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'ADD' }
                                                                                    ]
                                                                                ]
                                                                            },
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '3' }] },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '3' }] },
                                                                            { prim: 'GET' },
                                                                            {
                                                                                prim: 'IF_NONE',
                                                                                args: [
                                                                                    [
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                { string: 'NO_WTOKEN' }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    [
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'mutez' },
                                                                                                { int: '1' }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'AMOUNT' },
                                                                                        { prim: 'EDIV' },
                                                                                        {
                                                                                            prim: 'IF_NONE',
                                                                                            args: [
                                                                                                [
                                                                                                    {
                                                                                                        prim: 'PUSH',
                                                                                                        args: [
                                                                                                            {
                                                                                                                prim:
                                                                                                                    'string'
                                                                                                            },
                                                                                                            {
                                                                                                                string:
                                                                                                                    'DIV by 0'
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'FAILWITH' }
                                                                                                ],
                                                                                                []
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'ADD' }
                                                                                    ]
                                                                                ]
                                                                            },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '5' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'SOME' },
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [{ prim: 'nat' }, { int: '1' }]
                                                                            },
                                                                            { prim: 'SENDER' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'UPDATE' },
                                                                            {
                                                                                prim: 'DIP',
                                                                                args: [
                                                                                    [
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CAR' }
                                                                                    ]
                                                                                ]
                                                                            },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'SOME' },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'UPDATE' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'PAIR' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'PAIR' }
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            ]
                                        }
                                    ],
                                    [
                                        { prim: 'DIG', args: [{ int: '2' }] },
                                        { prim: 'DROP' },
                                        { prim: 'DIG', args: [{ int: '3' }] },
                                        { prim: 'DROP' },
                                        {
                                            prim: 'IF_LEFT',
                                            args: [
                                                [
                                                    {
                                                        prim: 'IF_LEFT',
                                                        args: [
                                                            [
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'SENDER' },
                                                                { prim: 'COMPARE' },
                                                                { prim: 'NEQ' },
                                                                {
                                                                    prim: 'IF',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DROP', args: [{ int: '3' }] },
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'FA2_TX_DENIED' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        [
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'bool' },
                                                                                    { prim: 'False' }
                                                                                ]
                                                                            },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'COMPARE' },
                                                                            { prim: 'EQ' },
                                                                            {
                                                                                prim: 'IF',
                                                                                args: [
                                                                                    [
                                                                                        {
                                                                                            prim: 'DROP',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                {
                                                                                                    string:
                                                                                                        'UNCONFIRMED_EXCHANGE'
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    [
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'CDR' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'PAIR' },
                                                                                        { prim: 'GET' },
                                                                                        {
                                                                                            prim: 'IF_NONE',
                                                                                            args: [
                                                                                                [
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'FAILWITH' }
                                                                                                ],
                                                                                                []
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'COMPARE' },
                                                                                        { prim: 'LT' },
                                                                                        {
                                                                                            prim: 'IF',
                                                                                            args: [
                                                                                                [
                                                                                                    {
                                                                                                        prim: 'DROP',
                                                                                                        args: [
                                                                                                            { int: '4' }
                                                                                                        ]
                                                                                                    },
                                                                                                    {
                                                                                                        prim: 'PUSH',
                                                                                                        args: [
                                                                                                            {
                                                                                                                prim:
                                                                                                                    'string'
                                                                                                            },
                                                                                                            {
                                                                                                                string:
                                                                                                                    'BUYER_INSUFFICIENT_BALANCE'
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'FAILWITH' }
                                                                                                ],
                                                                                                [
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '4' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'GET' },
                                                                                                    {
                                                                                                        prim: 'IF_NONE',
                                                                                                        args: [
                                                                                                            [
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '3'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'FAILWITH'
                                                                                                                }
                                                                                                            ],
                                                                                                            [
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '4'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DROP'
                                                                                                                }
                                                                                                            ]
                                                                                                        ]
                                                                                                    },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'COMPARE' },
                                                                                                    { prim: 'LT' },
                                                                                                    {
                                                                                                        prim: 'IF',
                                                                                                        args: [
                                                                                                            [
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DROP',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '4'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PUSH',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            prim:
                                                                                                                                'string'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            string:
                                                                                                                                'SELLER_INSUFFICIENT_BALANCE'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'FAILWITH'
                                                                                                                }
                                                                                                            ],
                                                                                                            [
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '2'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '3'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '3'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '4'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '4'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '5'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '5'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '6'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '7'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '8'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '7'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '8'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '3'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '4'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PAIR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'GET'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'IF_NONE',
                                                                                                                    args: [
                                                                                                                        [
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DIG',
                                                                                                                                args: [
                                                                                                                                    {
                                                                                                                                        int:
                                                                                                                                            '2'
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DUP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DUG',
                                                                                                                                args: [
                                                                                                                                    {
                                                                                                                                        int:
                                                                                                                                            '3'
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        [
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DIG',
                                                                                                                                args: [
                                                                                                                                    {
                                                                                                                                        int:
                                                                                                                                            '3'
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DUP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DUG',
                                                                                                                                args: [
                                                                                                                                    {
                                                                                                                                        int:
                                                                                                                                            '4'
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'ADD'
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SWAP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '2'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '7'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SUB'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'ABS'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '4'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '6'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SUB'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'ABS'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '7'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '8'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '7'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '8'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '7'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '8'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PAIR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'GET'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'IF_NONE',
                                                                                                                    args: [
                                                                                                                        [
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DIG',
                                                                                                                                args: [
                                                                                                                                    {
                                                                                                                                        int:
                                                                                                                                            '3'
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        [
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DIG',
                                                                                                                                args: [
                                                                                                                                    {
                                                                                                                                        int:
                                                                                                                                            '4'
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'ADD'
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '7'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '5'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SOME'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '8'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '9'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '7'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '8'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PAIR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'UPDATE'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '4'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SOME'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '7'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '8'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '6'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PAIR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'UPDATE'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '3'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SOME'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '5'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '6'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '5'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '6'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PAIR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'UPDATE'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '2'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SOME'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '4'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CAR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'CDR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '4'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PAIR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'UPDATE'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIP',
                                                                                                                    args: [
                                                                                                                        [
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DUP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'CDR'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'SWAP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'CAR'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DUP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'CDR'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'SWAP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'CAR'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DUP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'CAR'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'SWAP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'CDR'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'CAR'
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SWAP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PAIR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SWAP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PAIR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PAIR'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PAIR'
                                                                                                                }
                                                                                                            ]
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                ]
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'PAIR' }
                                                            ],
                                                            [
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'GET' },
                                                                {
                                                                    prim: 'IF_NONE',
                                                                    args: [
                                                                        [
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'NO_TOKEN_FOUND' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        [
                                                                            { prim: 'SENDER' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'COMPARE' },
                                                                            { prim: 'NEQ' },
                                                                            {
                                                                                prim: 'IF',
                                                                                args: [
                                                                                    [
                                                                                        { prim: 'DROP' },
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                {
                                                                                                    string:
                                                                                                        'UNAUTHORIZED_ACTION'
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    []
                                                                                ]
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'bool' }, { prim: 'False' }]
                                                                },
                                                                { prim: 'SWAP' },
                                                                { prim: 'CDR' },
                                                                { prim: 'COMPARE' },
                                                                { prim: 'EQ' },
                                                                {
                                                                    prim: 'IF',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DROP', args: [{ int: '2' }] },
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'FIXED_TOTAL_SUPPLY' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        [
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'GET' },
                                                                            {
                                                                                prim: 'IF_NONE',
                                                                                args: [
                                                                                    [
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                {
                                                                                                    string:
                                                                                                        'NO_TOKEN_FOUND'
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    [
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'ADD' }
                                                                                    ]
                                                                                ]
                                                                            },
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '3' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '3' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SENDER' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'GET' },
                                                                            {
                                                                                prim: 'IF_NONE',
                                                                                args: [
                                                                                    [
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                {
                                                                                                    string:
                                                                                                        'NO_TOKEN_FOUND'
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    [
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'ADD' }
                                                                                    ]
                                                                                ]
                                                                            },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '5' }] },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'SOME' },
                                                                            { prim: 'DIG', args: [{ int: '4' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '5' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'UPDATE' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'SOME' },
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SENDER' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'UPDATE' },
                                                                            {
                                                                                prim: 'DIP',
                                                                                args: [
                                                                                    [
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CAR' }
                                                                                    ]
                                                                                ]
                                                                            },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'PAIR' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'PAIR' }
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                [
                                                    {
                                                        prim: 'IF_LEFT',
                                                        args: [
                                                            [
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'nat' }, { int: '1' }]
                                                                },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'ADD' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'SENDER' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'SOME' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'UPDATE' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'SWAP' },
                                                                {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CAR' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'SWAP' },
                                                                { prim: 'SOME' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'UPDATE' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'CAR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                {
                                                                    prim: 'EMPTY_MAP',
                                                                    args: [{ prim: 'string' }, { prim: 'bytes' }]
                                                                },
                                                                { prim: 'DIG', args: [{ int: '4' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '5' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'SOME' },
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'string' }, { string: '' }]
                                                                },
                                                                { prim: 'UPDATE' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'SWAP' },
                                                                { prim: 'SOME' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'UPDATE' },
                                                                {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CAR' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'SENDER' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'SWAP' },
                                                                { prim: 'SOME' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'UPDATE' },
                                                                {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CDR' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CDR' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'PAIR' }
                                                            ],
                                                            [
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'SENDER' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'GET' },
                                                                {
                                                                    prim: 'IF_NONE',
                                                                    args: [
                                                                        [
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'NO_ACCOUNT' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        []
                                                                    ]
                                                                },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'COMPARE' },
                                                                { prim: 'LT' },
                                                                {
                                                                    prim: 'IF',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DROP', args: [{ int: '2' }] },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        [
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'DROP' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CDR' },
                                                                            {
                                                                                prim: 'CONTRACT',
                                                                                args: [
                                                                                    {
                                                                                        prim: 'pair',
                                                                                        args: [
                                                                                            {
                                                                                                prim: 'or',
                                                                                                args: [
                                                                                                    {
                                                                                                        prim: 'unit',
                                                                                                        annots: [
                                                                                                            '%buy'
                                                                                                        ]
                                                                                                    },
                                                                                                    {
                                                                                                        prim: 'unit',
                                                                                                        annots: [
                                                                                                            '%sell'
                                                                                                        ]
                                                                                                    }
                                                                                                ],
                                                                                                annots: [
                                                                                                    '%order_type'
                                                                                                ]
                                                                                            },
                                                                                            {
                                                                                                prim: 'pair',
                                                                                                args: [
                                                                                                    {
                                                                                                        prim: 'nat',
                                                                                                        annots: [
                                                                                                            '%token_id_to_sell'
                                                                                                        ]
                                                                                                    },
                                                                                                    {
                                                                                                        prim: 'pair',
                                                                                                        args: [
                                                                                                            {
                                                                                                                prim:
                                                                                                                    'nat',
                                                                                                                annots: [
                                                                                                                    '%token_amount_to_sell'
                                                                                                                ]
                                                                                                            },
                                                                                                            {
                                                                                                                prim:
                                                                                                                    'pair',
                                                                                                                args: [
                                                                                                                    {
                                                                                                                        prim:
                                                                                                                            'nat',
                                                                                                                        annots: [
                                                                                                                            '%token_id_to_buy'
                                                                                                                        ]
                                                                                                                    },
                                                                                                                    {
                                                                                                                        prim:
                                                                                                                            'pair',
                                                                                                                        args: [
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'nat',
                                                                                                                                annots: [
                                                                                                                                    '%token_amount_to_buy'
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'pair',
                                                                                                                                args: [
                                                                                                                                    {
                                                                                                                                        prim:
                                                                                                                                            'nat',
                                                                                                                                        annots: [
                                                                                                                                            '%total_token_amount'
                                                                                                                                        ]
                                                                                                                                    },
                                                                                                                                    {
                                                                                                                                        prim:
                                                                                                                                            'address',
                                                                                                                                        annots: [
                                                                                                                                            '%seller'
                                                                                                                                        ]
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    }
                                                                                                                ]
                                                                                                            }
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            }
                                                                                        ]
                                                                                    }
                                                                                ],
                                                                                annots: ['%create_new_order']
                                                                            },
                                                                            {
                                                                                prim: 'IF_NONE',
                                                                                args: [
                                                                                    [
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                {
                                                                                                    string:
                                                                                                        'UNKNOWN_CONTRACT'
                                                                                                }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    []
                                                                                ]
                                                                            },
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'mutez' },
                                                                                    { int: '0' }
                                                                                ]
                                                                            },
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'TRANSFER_TOKENS' },
                                                                            { prim: 'PAIR' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'DUP' },
                                                                { prim: 'CDR' },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CONS' },
                                                                { prim: 'PAIR' }
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            ]
                                        }
                                    ]
                                ]
                            }
                        ],
                        [
                            {
                                prim: 'IF_LEFT',
                                args: [
                                    [
                                        { prim: 'DIG', args: [{ int: '3' }] },
                                        { prim: 'DROP' },
                                        {
                                            prim: 'IF_LEFT',
                                            args: [
                                                [
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'DROP' },
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'DROP' },
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'DROP' },
                                                    {
                                                        prim: 'IF_LEFT',
                                                        args: [
                                                            [
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'nat' }, { int: '1' }]
                                                                },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'nat' }, { int: '1' }]
                                                                },
                                                                { prim: 'SENDER' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'GET' },
                                                                {
                                                                    prim: 'IF_NONE',
                                                                    args: [
                                                                        [
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'NO_ACCOUNT' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        [
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [{ prim: 'nat' }, { int: '0' }]
                                                                            },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'COMPARE' },
                                                                            { prim: 'EQ' },
                                                                            {
                                                                                prim: 'IF',
                                                                                args: [
                                                                                    [
                                                                                        { prim: 'DROP' },
                                                                                        {
                                                                                            prim: 'PUSH',
                                                                                            args: [
                                                                                                { prim: 'string' },
                                                                                                { string: 'NO_BALANCE' }
                                                                                            ]
                                                                                        },
                                                                                        { prim: 'FAILWITH' }
                                                                                    ],
                                                                                    [
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'COMPARE' },
                                                                                        { prim: 'LT' },
                                                                                        {
                                                                                            prim: 'IF',
                                                                                            args: [
                                                                                                [
                                                                                                    { prim: 'DROP' },
                                                                                                    {
                                                                                                        prim: 'PUSH',
                                                                                                        args: [
                                                                                                            {
                                                                                                                prim:
                                                                                                                    'string'
                                                                                                            },
                                                                                                            {
                                                                                                                string:
                                                                                                                    'INSUFFICIENT_BALANCE'
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'FAILWITH' }
                                                                                                ],
                                                                                                []
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                ]
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'SENDER' },
                                                                { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
                                                                {
                                                                    prim: 'IF_NONE',
                                                                    args: [
                                                                        [
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'CONTRACT_ERROR' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        []
                                                                    ]
                                                                },
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'mutez' }, { int: '1' }]
                                                                },
                                                                { prim: 'DIG', args: [{ int: '4' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '5' }] },
                                                                { prim: 'MUL' },
                                                                { prim: 'UNIT' },
                                                                { prim: 'TRANSFER_TOKENS' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'SUB' },
                                                                { prim: 'ABS' },
                                                                { prim: 'DIG', args: [{ int: '4' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '5' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'SOME' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'SENDER' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'UPDATE' },
                                                                { prim: 'DIG', args: [{ int: '4' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '5' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'GET' },
                                                                {
                                                                    prim: 'IF_NONE',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DIG', args: [{ int: '3' }] },
                                                                            { prim: 'DROP' },
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'NO_WTOKEN' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ],
                                                                        [
                                                                            { prim: 'DIG', args: [{ int: '4' }] },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'SUB' },
                                                                            { prim: 'ABS' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'DIG', args: [{ int: '4' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '5' }] },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CAR' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DIG', args: [{ int: '4' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'SOME' },
                                                                { prim: 'DIG', args: [{ int: '4' }] },
                                                                { prim: 'UPDATE' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'CAR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DUP' },
                                                                { prim: 'CDR' },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CONS' },
                                                                { prim: 'PAIR' }
                                                            ],
                                                            [
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'mutez' }, { int: '0' }]
                                                                },
                                                                { prim: 'SELF' },
                                                                { prim: 'ADDRESS' },
                                                                { prim: 'TRANSFER_TOKENS' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'CONS' },
                                                                { prim: 'PAIR' }
                                                            ]
                                                        ]
                                                    }
                                                ],
                                                [
                                                    {
                                                        prim: 'IF_LEFT',
                                                        args: [
                                                            [
                                                                {
                                                                    prim: 'MAP',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            {
                                                                                prim: 'MAP',
                                                                                args: [
                                                                                    [
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'CAR' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'PAIR' },
                                                                                        { prim: 'PAIR' }
                                                                                    ]
                                                                                ]
                                                                            },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'PAIR' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                {
                                                                    prim: 'LAMBDA',
                                                                    args: [
                                                                        {
                                                                            prim: 'pair',
                                                                            args: [
                                                                                {
                                                                                    prim: 'pair',
                                                                                    args: [
                                                                                        { prim: 'address' },
                                                                                        { prim: 'address' }
                                                                                    ]
                                                                                },
                                                                                {
                                                                                    prim: 'pair',
                                                                                    args: [
                                                                                        { prim: 'nat' },
                                                                                        {
                                                                                            prim: 'big_map',
                                                                                            args: [
                                                                                                {
                                                                                                    prim: 'pair',
                                                                                                    args: [
                                                                                                        {
                                                                                                            prim:
                                                                                                                'address'
                                                                                                        },
                                                                                                        {
                                                                                                            prim:
                                                                                                                'pair',
                                                                                                            args: [
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'address'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'nat'
                                                                                                                }
                                                                                                            ]
                                                                                                        }
                                                                                                    ]
                                                                                                },
                                                                                                { prim: 'unit' }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        { prim: 'unit' },
                                                                        [
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DIG', args: [{ int: '2' }] },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '3' }] },
                                                                            { prim: 'COMPARE' },
                                                                            { prim: 'EQ' },
                                                                            {
                                                                                prim: 'IF',
                                                                                args: [
                                                                                    [
                                                                                        {
                                                                                            prim: 'DROP',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'UNIT' }
                                                                                    ],
                                                                                    [
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CAR' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'PAIR' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'PAIR' },
                                                                                        { prim: 'MEM' },
                                                                                        {
                                                                                            prim: 'IF',
                                                                                            args: [
                                                                                                [{ prim: 'UNIT' }],
                                                                                                [
                                                                                                    {
                                                                                                        prim: 'PUSH',
                                                                                                        args: [
                                                                                                            {
                                                                                                                prim:
                                                                                                                    'string'
                                                                                                            },
                                                                                                            {
                                                                                                                string:
                                                                                                                    'FA2_NOT_OPERATOR'
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'FAILWITH' }
                                                                                                ]
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                ]
                                                                            }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DUP' },
                                                                { prim: 'CDR' },
                                                                { prim: 'DUP' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                {
                                                                    prim: 'ITER',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DUP' },
                                                                            { prim: 'DUG', args: [{ int: '2' }] },
                                                                            { prim: 'CDR' },
                                                                            {
                                                                                prim: 'ITER',
                                                                                args: [
                                                                                    [
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'PAIR' },
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CDR' },
                                                                                        {
                                                                                            prim: 'DIG',
                                                                                            args: [{ int: '3' }]
                                                                                        },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '4' }]
                                                                                        },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'DUP' },
                                                                                        {
                                                                                            prim: 'DUG',
                                                                                            args: [{ int: '2' }]
                                                                                        },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'MEM' },
                                                                                        { prim: 'NOT' },
                                                                                        {
                                                                                            prim: 'IF',
                                                                                            args: [
                                                                                                [
                                                                                                    {
                                                                                                        prim: 'DROP',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '6' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '7' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'FAILWITH' }
                                                                                                ],
                                                                                                [
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '4' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'SENDER' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '4' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '5' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '5' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '6' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'EXEC' },
                                                                                                    { prim: 'DROP' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CDR' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '4' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'DUP' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'PAIR' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '9' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            {
                                                                                                                int:
                                                                                                                    '10'
                                                                                                            }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'EXEC' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'SUB' },
                                                                                                    { prim: 'ISNAT' },
                                                                                                    {
                                                                                                        prim: 'IF_NONE',
                                                                                                        args: [
                                                                                                            [
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DROP',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '2'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '6'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '7'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'FAILWITH'
                                                                                                                }
                                                                                                            ],
                                                                                                            [
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'PUSH',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            prim:
                                                                                                                                'nat'
                                                                                                                        },
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '0'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SWAP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DUG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '2'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'COMPARE'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'EQ'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'IF',
                                                                                                                    args: [
                                                                                                                        [
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DROP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'NONE',
                                                                                                                                args: [
                                                                                                                                    {
                                                                                                                                        prim:
                                                                                                                                            'nat'
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'SWAP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'UPDATE'
                                                                                                                            }
                                                                                                                        ],
                                                                                                                        [
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DIG',
                                                                                                                                args: [
                                                                                                                                    {
                                                                                                                                        int:
                                                                                                                                            '2'
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'SWAP'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'SOME'
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'DIG',
                                                                                                                                args: [
                                                                                                                                    {
                                                                                                                                        int:
                                                                                                                                            '2'
                                                                                                                                    }
                                                                                                                                ]
                                                                                                                            },
                                                                                                                            {
                                                                                                                                prim:
                                                                                                                                    'UPDATE'
                                                                                                                            }
                                                                                                                        ]
                                                                                                                    ]
                                                                                                                }
                                                                                                            ]
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CDR' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'DUP' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CDR' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'PAIR' },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'PAIR' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '8' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '9' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'EXEC' },
                                                                                                    {
                                                                                                        prim: 'DIG',
                                                                                                        args: [
                                                                                                            { int: '3' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'CDR' },
                                                                                                    { prim: 'CAR' },
                                                                                                    { prim: 'ADD' },
                                                                                                    {
                                                                                                        prim: 'PUSH',
                                                                                                        args: [
                                                                                                            {
                                                                                                                prim:
                                                                                                                    'nat'
                                                                                                            },
                                                                                                            { int: '0' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'SWAP' },
                                                                                                    { prim: 'DUP' },
                                                                                                    {
                                                                                                        prim: 'DUG',
                                                                                                        args: [
                                                                                                            { int: '2' }
                                                                                                        ]
                                                                                                    },
                                                                                                    { prim: 'COMPARE' },
                                                                                                    { prim: 'EQ' },
                                                                                                    {
                                                                                                        prim: 'IF',
                                                                                                        args: [
                                                                                                            [
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DROP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'NONE',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            prim:
                                                                                                                                'nat'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SWAP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'UPDATE'
                                                                                                                }
                                                                                                            ],
                                                                                                            [
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '2'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SWAP'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'SOME'
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'DIG',
                                                                                                                    args: [
                                                                                                                        {
                                                                                                                            int:
                                                                                                                                '2'
                                                                                                                        }
                                                                                                                    ]
                                                                                                                },
                                                                                                                {
                                                                                                                    prim:
                                                                                                                        'UPDATE'
                                                                                                                }
                                                                                                            ]
                                                                                                        ]
                                                                                                    }
                                                                                                ]
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                ]
                                                                            },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'DROP' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DROP' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'DROP' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                        [
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'DUP' },
                                                                            { prim: 'CAR' },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CDR' },
                                                                            { prim: 'CAR' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'SWAP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'PAIR' }
                                                            ],
                                                            [
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DROP' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DUP' },
                                                                { prim: 'CDR' },
                                                                { prim: 'DUP' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'SENDER' },
                                                                { prim: 'COMPARE' },
                                                                { prim: 'EQ' },
                                                                {
                                                                    prim: 'IF',
                                                                    args: [
                                                                        [
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'CAR' },
                                                                            {
                                                                                prim: 'DIP',
                                                                                args: [
                                                                                    [
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'DUP' },
                                                                                        { prim: 'CDR' },
                                                                                        { prim: 'SWAP' },
                                                                                        { prim: 'CAR' },
                                                                                        { prim: 'CAR' }
                                                                                    ]
                                                                                ]
                                                                            },
                                                                            { prim: 'SWAP' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'PAIR' },
                                                                            { prim: 'PAIR' }
                                                                        ],
                                                                        [
                                                                            { prim: 'DROP', args: [{ int: '2' }] },
                                                                            {
                                                                                prim: 'PUSH',
                                                                                args: [
                                                                                    { prim: 'string' },
                                                                                    { string: 'UNAUTHORIZED_ACTION' }
                                                                                ]
                                                                            },
                                                                            { prim: 'FAILWITH' }
                                                                        ]
                                                                    ]
                                                                },
                                                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                                { prim: 'PAIR' }
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            ]
                                        }
                                    ],
                                    [
                                        { prim: 'DIG', args: [{ int: '2' }] },
                                        { prim: 'DROP' },
                                        { prim: 'DIG', args: [{ int: '3' }] },
                                        { prim: 'DROP' },
                                        { prim: 'DIG', args: [{ int: '3' }] },
                                        { prim: 'DROP' },
                                        { prim: 'SWAP' },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '2' }] },
                                        { prim: 'CAR' },
                                        { prim: 'CDR' },
                                        { prim: 'CAR' },
                                        { prim: 'CDR' },
                                        { prim: 'SWAP' },
                                        { prim: 'PAIR' },
                                        { prim: 'DUP' },
                                        { prim: 'CAR' },
                                        {
                                            prim: 'MAP',
                                            args: [
                                                [
                                                    {
                                                        prim: 'IF_LEFT',
                                                        args: [
                                                            [
                                                                {
                                                                    prim: 'LEFT',
                                                                    args: [
                                                                        {
                                                                            prim: 'pair',
                                                                            args: [
                                                                                { prim: 'address' },
                                                                                {
                                                                                    prim: 'pair',
                                                                                    args: [
                                                                                        { prim: 'address' },
                                                                                        { prim: 'nat' }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            [
                                                                {
                                                                    prim: 'RIGHT',
                                                                    args: [
                                                                        {
                                                                            prim: 'pair',
                                                                            args: [
                                                                                { prim: 'address' },
                                                                                {
                                                                                    prim: 'pair',
                                                                                    args: [
                                                                                        { prim: 'address' },
                                                                                        { prim: 'nat' }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        ]
                                                    },
                                                    {
                                                        prim: 'IF_LEFT',
                                                        args: [
                                                            [
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'SWAP' },
                                                                { prim: 'EXEC' },
                                                                {
                                                                    prim: 'LEFT',
                                                                    args: [
                                                                        {
                                                                            prim: 'pair',
                                                                            args: [
                                                                                {
                                                                                    prim: 'pair',
                                                                                    args: [
                                                                                        { prim: 'address' },
                                                                                        { prim: 'address' }
                                                                                    ]
                                                                                },
                                                                                { prim: 'nat' }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ],
                                                            [
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'SWAP' },
                                                                { prim: 'EXEC' },
                                                                {
                                                                    prim: 'RIGHT',
                                                                    args: [
                                                                        {
                                                                            prim: 'pair',
                                                                            args: [
                                                                                {
                                                                                    prim: 'pair',
                                                                                    args: [
                                                                                        { prim: 'address' },
                                                                                        { prim: 'address' }
                                                                                    ]
                                                                                },
                                                                                { prim: 'nat' }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            ]
                                        },
                                        { prim: 'DIG', args: [{ int: '3' }] },
                                        { prim: 'DROP' },
                                        { prim: 'SENDER' },
                                        { prim: 'DIG', args: [{ int: '2' }] },
                                        { prim: 'CDR' },
                                        { prim: 'DIG', args: [{ int: '2' }] },
                                        {
                                            prim: 'ITER',
                                            args: [
                                                [
                                                    { prim: 'SWAP' },
                                                    { prim: 'PAIR' },
                                                    { prim: 'DUP' },
                                                    { prim: 'CDR' },
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'DUP' },
                                                    { prim: 'DUG', args: [{ int: '3' }] },
                                                    { prim: 'SWAP' },
                                                    { prim: 'DUP' },
                                                    { prim: 'DUG', args: [{ int: '2' }] },
                                                    { prim: 'IF_LEFT', args: [[], []] },
                                                    { prim: 'CAR' },
                                                    { prim: 'CDR' },
                                                    { prim: 'COMPARE' },
                                                    { prim: 'EQ' },
                                                    {
                                                        prim: 'IF',
                                                        args: [
                                                            [{ prim: 'UNIT' }],
                                                            [
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [
                                                                        { prim: 'string' },
                                                                        { string: 'FA2_NOT_OWNER' }
                                                                    ]
                                                                },
                                                                { prim: 'FAILWITH' }
                                                            ]
                                                        ]
                                                    },
                                                    { prim: 'DROP' },
                                                    { prim: 'SWAP' },
                                                    { prim: 'CAR' },
                                                    { prim: 'SWAP' },
                                                    {
                                                        prim: 'IF_LEFT',
                                                        args: [
                                                            [
                                                                { prim: 'SWAP' },
                                                                { prim: 'UNIT' },
                                                                { prim: 'SOME' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '4' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DIG', args: [{ int: '3' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'UPDATE' }
                                                            ],
                                                            [
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '2' }] },
                                                                { prim: 'CDR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'DUP' },
                                                                { prim: 'DUG', args: [{ int: '3' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CAR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'DIG', args: [{ int: '2' }] },
                                                                { prim: 'CAR' },
                                                                { prim: 'CDR' },
                                                                { prim: 'PAIR' },
                                                                { prim: 'NONE', args: [{ prim: 'unit' }] },
                                                                { prim: 'SWAP' },
                                                                { prim: 'UPDATE' }
                                                            ]
                                                        ]
                                                    }
                                                ]
                                            ]
                                        },
                                        { prim: 'SWAP' },
                                        { prim: 'DROP' },
                                        {
                                            prim: 'DIP',
                                            args: [
                                                [
                                                    { prim: 'DUP' },
                                                    { prim: 'CDR' },
                                                    { prim: 'SWAP' },
                                                    { prim: 'CAR' },
                                                    { prim: 'DUP' },
                                                    { prim: 'CAR' },
                                                    { prim: 'SWAP' },
                                                    { prim: 'CDR' },
                                                    { prim: 'DUP' },
                                                    { prim: 'CDR' },
                                                    { prim: 'SWAP' },
                                                    { prim: 'CAR' },
                                                    { prim: 'CAR' }
                                                ]
                                            ]
                                        },
                                        { prim: 'SWAP' },
                                        { prim: 'PAIR' },
                                        { prim: 'PAIR' },
                                        { prim: 'SWAP' },
                                        { prim: 'PAIR' },
                                        { prim: 'PAIR' },
                                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                                        { prim: 'PAIR' }
                                    ]
                                ]
                            }
                        ]
                    ]
                }
            ]
        ]
    }
];
