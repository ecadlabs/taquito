export const saplingContract = [
    {
        prim: 'parameter',
        args: [
            {
                prim: 'or',
                args: [
                    {
                        prim: 'list',
                        args: [
                            {
                                prim: 'pair',
                                args: [
                                    {
                                        prim: 'sapling_transaction',
                                        args: [{ int: '8' }],
                                        annots: ['%transaction']
                                    },
                                    { prim: 'option', args: [{ prim: 'key_hash' }], annots: ['%key'] }
                                ]
                            }
                        ],
                        annots: ['%__entry_00__']
                    },
                    {
                        prim: 'list',
                        args: [
                            {
                                prim: 'pair',
                                args: [
                                    {
                                        prim: 'sapling_transaction',
                                        args: [{ int: '8' }],
                                        annots: ['%transaction']
                                    },
                                    { prim: 'option', args: [{ prim: 'key_hash' }], annots: ['%key'] }
                                ]
                            }
                        ],
                        annots: ['%__entry_01__']
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
                    { prim: 'mutez', annots: ['%balance'] },
                    { prim: 'sapling_state', args: [{ int: '8' }], annots: ['%ledger1'] },
                    { prim: 'sapling_state', args: [{ int: '8' }], annots: ['%ledger2'] }
                ]
            }
        ]
    },
    {
        prim: 'code',
        args: [
            [
                { prim: 'DUP' },
                { prim: 'CDR' },
                { prim: 'SWAP' },
                { prim: 'CAR' },
                {
                    prim: 'IF_LEFT',
                    args: [
                        [
                            { prim: 'DUP' },
                            { prim: 'NIL', args: [{ prim: 'operation' }] },
                            { prim: 'SWAP' },
                            {
                                prim: 'ITER',
                                args: [
                                    [
                                        { prim: 'DIG', args: [{ int: '3' }] },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '4' }] },
                                        { prim: 'CDR' },
                                        { prim: 'CAR' },
                                        { prim: 'SWAP' },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '2' }] },
                                        { prim: 'CAR' },
                                        { prim: 'SAPLING_VERIFY_UPDATE' },
                                        {
                                            prim: 'IF_NONE',
                                            args: [
                                                [
                                                    { prim: 'PUSH', args: [{ prim: 'int' }, { int: '12' }] },
                                                    { prim: 'FAILWITH' }
                                                ],
                                                []
                                            ]
                                        },
                                        { prim: 'DIG', args: [{ int: '4' }] },
                                        { prim: 'DUP' },
                                        { prim: 'CAR' },
                                        { prim: 'SWAP' },
                                        { prim: 'CDR' },
                                        { prim: 'CDR' },
                                        { prim: 'DIG', args: [{ int: '2' }] },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '3' }] },
                                        { prim: 'CDR' },
                                        { prim: 'PAIR' },
                                        { prim: 'SWAP' },
                                        { prim: 'PAIR' },
                                        { prim: 'DUG', args: [{ int: '4' }] },
                                        { prim: 'DUP' },
                                        { prim: 'CAR' },
                                        { prim: 'DUP' },
                                        { prim: 'ABS' },
                                        { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '1' }] },
                                        { prim: 'MUL' },
                                        { prim: 'DIG', args: [{ int: '6' }] },
                                        { prim: 'CDR' },
                                        { prim: 'SWAP' },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '2' }] },
                                        { prim: 'PAIR' },
                                        { prim: 'DUG', args: [{ int: '6' }] },
                                        { prim: 'PUSH', args: [{ prim: 'int' }, { int: '0' }] },
                                        { prim: 'DIG', args: [{ int: '2' }] },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '3' }] },
                                        { prim: 'COMPARE' },
                                        { prim: 'GT' },
                                        {
                                            prim: 'IF',
                                            args: [
                                                [
                                                    { prim: 'SWAP' },
                                                    { prim: 'DROP' },
                                                    { prim: 'SWAP' },
                                                    { prim: 'DROP' },
                                                    { prim: 'DUG', args: [{ int: '2' }] },
                                                    { prim: 'CDR' },
                                                    {
                                                        prim: 'IF_NONE',
                                                        args: [
                                                            [
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'int' }, { int: '18' }]
                                                                },
                                                                { prim: 'FAILWITH' }
                                                            ],
                                                            []
                                                        ]
                                                    },
                                                    { prim: 'IMPLICIT_ACCOUNT' },
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'UNIT' },
                                                    { prim: 'TRANSFER_TOKENS' },
                                                    { prim: 'CONS' }
                                                ],
                                                [
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'DROP' },
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'CDR' },
                                                    {
                                                        prim: 'IF_NONE',
                                                        args: [
                                                            [{ prim: 'SWAP' }, { prim: 'DROP' }],
                                                            [
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [
                                                                        { prim: 'string' },
                                                                        {
                                                                            string:
                                                                                'WrongCondition: ~ operation.key.is_some()'
                                                                        }
                                                                    ]
                                                                },
                                                                { prim: 'FAILWITH' }
                                                            ]
                                                        ]
                                                    },
                                                    { prim: 'AMOUNT' },
                                                    { prim: 'COMPARE' },
                                                    { prim: 'EQ' },
                                                    {
                                                        prim: 'IF',
                                                        args: [
                                                            [],
                                                            [
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [
                                                                        { prim: 'string' },
                                                                        {
                                                                            string:
                                                                                'WrongCondition: sp.amount == amount_tez.value'
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
                            { prim: 'SWAP' },
                            { prim: 'DROP' }
                        ],
                        [
                            { prim: 'DUP' },
                            { prim: 'NIL', args: [{ prim: 'operation' }] },
                            { prim: 'SWAP' },
                            {
                                prim: 'ITER',
                                args: [
                                    [
                                        { prim: 'DIG', args: [{ int: '3' }] },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '4' }] },
                                        { prim: 'CDR' },
                                        { prim: 'CDR' },
                                        { prim: 'SWAP' },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '2' }] },
                                        { prim: 'CAR' },
                                        { prim: 'SAPLING_VERIFY_UPDATE' },
                                        {
                                            prim: 'IF_NONE',
                                            args: [
                                                [
                                                    { prim: 'PUSH', args: [{ prim: 'int' }, { int: '28' }] },
                                                    { prim: 'FAILWITH' }
                                                ],
                                                []
                                            ]
                                        },
                                        { prim: 'DIG', args: [{ int: '4' }] },
                                        { prim: 'DUP' },
                                        { prim: 'CAR' },
                                        { prim: 'SWAP' },
                                        { prim: 'CDR' },
                                        { prim: 'CAR' },
                                        { prim: 'DIG', args: [{ int: '2' }] },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '3' }] },
                                        { prim: 'CDR' },
                                        { prim: 'SWAP' },
                                        { prim: 'PAIR' },
                                        { prim: 'SWAP' },
                                        { prim: 'PAIR' },
                                        { prim: 'DUG', args: [{ int: '4' }] },
                                        { prim: 'DUP' },
                                        { prim: 'CAR' },
                                        { prim: 'DUP' },
                                        { prim: 'ABS' },
                                        { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '1' }] },
                                        { prim: 'MUL' },
                                        { prim: 'DIG', args: [{ int: '6' }] },
                                        { prim: 'CDR' },
                                        { prim: 'SWAP' },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '2' }] },
                                        { prim: 'PAIR' },
                                        { prim: 'DUG', args: [{ int: '6' }] },
                                        { prim: 'PUSH', args: [{ prim: 'int' }, { int: '0' }] },
                                        { prim: 'DIG', args: [{ int: '2' }] },
                                        { prim: 'DUP' },
                                        { prim: 'DUG', args: [{ int: '3' }] },
                                        { prim: 'COMPARE' },
                                        { prim: 'GT' },
                                        {
                                            prim: 'IF',
                                            args: [
                                                [
                                                    { prim: 'SWAP' },
                                                    { prim: 'DROP' },
                                                    { prim: 'SWAP' },
                                                    { prim: 'DROP' },
                                                    { prim: 'DUG', args: [{ int: '2' }] },
                                                    { prim: 'CDR' },
                                                    {
                                                        prim: 'IF_NONE',
                                                        args: [
                                                            [
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [{ prim: 'int' }, { int: '34' }]
                                                                },
                                                                { prim: 'FAILWITH' }
                                                            ],
                                                            []
                                                        ]
                                                    },
                                                    { prim: 'IMPLICIT_ACCOUNT' },
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'UNIT' },
                                                    { prim: 'TRANSFER_TOKENS' },
                                                    { prim: 'CONS' }
                                                ],
                                                [
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'DROP' },
                                                    { prim: 'DIG', args: [{ int: '2' }] },
                                                    { prim: 'CDR' },
                                                    {
                                                        prim: 'IF_NONE',
                                                        args: [
                                                            [{ prim: 'SWAP' }, { prim: 'DROP' }],
                                                            [
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [
                                                                        { prim: 'string' },
                                                                        {
                                                                            string:
                                                                                'WrongCondition: ~ operation.key.is_some()'
                                                                        }
                                                                    ]
                                                                },
                                                                { prim: 'FAILWITH' }
                                                            ]
                                                        ]
                                                    },
                                                    { prim: 'AMOUNT' },
                                                    { prim: 'COMPARE' },
                                                    { prim: 'EQ' },
                                                    {
                                                        prim: 'IF',
                                                        args: [
                                                            [],
                                                            [
                                                                {
                                                                    prim: 'PUSH',
                                                                    args: [
                                                                        { prim: 'string' },
                                                                        {
                                                                            string:
                                                                                'WrongCondition: sp.amount == amount_tez.value'
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
                            { prim: 'SWAP' },
                            { prim: 'DROP' }
                        ]
                    ]
                },
                { prim: 'NIL', args: [{ prim: 'operation' }] },
                { prim: 'SWAP' },
                { prim: 'ITER', args: [[{ prim: 'CONS' }]] },
                { prim: 'PAIR' }
            ]
        ]
    }
]