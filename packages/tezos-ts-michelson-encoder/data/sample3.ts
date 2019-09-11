export const rpcContractResponse = {
  manager: 'tz1LBEKXaxQbd5Gtzbc1ATCwc3pppu81aWGc',
  balance: '5468344480',
  spendable: false,
  delegate: { setable: true },
  script: {
    code: [
      {
        prim: 'parameter',
        args: [
          {
            prim: 'or',
            args: [
              { prim: 'unit', annots: ['%_Liq_entry_main'] },
              {
                prim: 'or',
                args: [
                  { prim: 'nat', annots: ['%_Liq_entry_sellOut'] },
                  {
                    prim: 'or',
                    args: [
                      { prim: 'mutez', annots: ['%_Liq_entry_withdraw'] },
                      {
                        prim: 'or',
                        args: [
                          { prim: 'unit', annots: ['%_Liq_entry_deposit'] },
                          {
                            prim: 'pair',
                            args: [
                              { prim: 'mutez', annots: ['%sellP'] },
                              {
                                prim: 'pair',
                                args: [
                                  { prim: 'mutez', annots: ['%buyP'] },
                                  { prim: 'mutez', annots: ['%extraBalance'] }
                                ]
                              }
                            ],
                            annots: [':priceUpdate', '%_Liq_entry_updatePrices']
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ],
            annots: [':_entries']
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
                prim: 'map',
                args: [{ prim: 'address' }, { prim: 'nat' }],
                annots: ['%balances']
              },
              {
                prim: 'pair',
                args: [
                  { prim: 'string', annots: ['%name'] },
                  {
                    prim: 'pair',
                    args: [
                      { prim: 'string', annots: ['%symbol'] },
                      {
                        prim: 'pair',
                        args: [
                          { prim: 'nat', annots: ['%decimals'] },
                          {
                            prim: 'pair',
                            args: [
                              { prim: 'nat', annots: ['%totalSupply'] },
                              {
                                prim: 'pair',
                                args: [
                                  { prim: 'mutez', annots: ['%inBaker'] },
                                  {
                                    prim: 'pair',
                                    args: [
                                      { prim: 'address', annots: ['%owner'] },
                                      {
                                        prim: 'pair',
                                        args: [
                                          {
                                            prim: 'mutez',
                                            annots: ['%buyPrice']
                                          },
                                          {
                                            prim: 'mutez',
                                            annots: ['%sellPrice']
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
                ]
              }
            ],
            annots: [':storage']
          }
        ]
      },
      {
        prim: 'code',
        args: [
          [
            { prim: 'DUP' },
            { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
            { prim: 'CAR' },
            { prim: 'DUP', annots: ['@parameter'] },
            {
              prim: 'IF_LEFT',
              args: [
                [
                  { prim: 'RENAME', annots: ['@nop_slash_3'] },
                  [
                    {
                      prim: 'DIP',
                      args: [
                        [
                          [
                            {
                              prim: 'DIP',
                              args: [[{ prim: 'DUP', annots: ['@storage'] }]]
                            },
                            { prim: 'SWAP' }
                          ]
                        ]
                      ]
                    },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'DUP', annots: ['@state'] },
                  [
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'CAR', annots: ['%buyPrice'] }
                  ],
                  { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1000000' }] },
                  { prim: 'AMOUNT' },
                  { prim: 'MUL', annots: ['@micros'] },
                  { prim: 'EDIV' },
                  {
                    prim: 'IF_NONE',
                    args: [
                      [
                        {
                          prim: 'PUSH',
                          args: [{ prim: 'string' }, { string: 'Bad amount' }]
                        },
                        { prim: 'FAILWITH' }
                      ],
                      [
                        { prim: 'SENDER', annots: ['@addr'] },
                        { prim: 'DUP', annots: ['@addr'] },
                        { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
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
                                      'Cannot use this contract from non unit contract'
                                  }
                                ]
                              },
                              { prim: 'FAILWITH' }
                            ],
                            [
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                                annots: ['@amount']
                                              }
                                            ]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              { prim: 'CAR', annots: ['@tokens'] },
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              [
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              {
                                                                prim: 'DUP',
                                                                annots: [
                                                                  '@state'
                                                                ]
                                                              }
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ]
                                                    ]
                                                  ]
                                                },
                                                { prim: 'SWAP' }
                                              ]
                                            ]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              { prim: 'DUP' },
                              { prim: 'CAR', annots: ['%balances'] },
                              { prim: 'SWAP' },
                              { prim: 'CDR' },
                              { prim: 'DUP' },
                              { prim: 'CAR', annots: ['%name'] },
                              { prim: 'SWAP' },
                              { prim: 'CDR' },
                              { prim: 'DUP' },
                              { prim: 'CAR', annots: ['%symbol'] },
                              { prim: 'SWAP' },
                              { prim: 'CDR' },
                              { prim: 'DUP' },
                              { prim: 'CAR', annots: ['%decimals'] },
                              { prim: 'SWAP' },
                              { prim: 'CDR' },
                              { prim: 'CDR' },
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              [
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DUP',
                                                                        annots: [
                                                                          '@tokens'
                                                                        ]
                                                                      }
                                                                    ]
                                                                  ]
                                                                },
                                                                { prim: 'SWAP' }
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ]
                                                    ]
                                                  ]
                                                },
                                                { prim: 'SWAP' }
                                              ]
                                            ]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              [
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      [
                                                                        {
                                                                          prim:
                                                                            'DIP',
                                                                          args: [
                                                                            [
                                                                              [
                                                                                {
                                                                                  prim:
                                                                                    'DIP',
                                                                                  args: [
                                                                                    [
                                                                                      [
                                                                                        {
                                                                                          prim:
                                                                                            'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              [
                                                                                                {
                                                                                                  prim:
                                                                                                    'DIP',
                                                                                                  args: [
                                                                                                    [
                                                                                                      [
                                                                                                        {
                                                                                                          prim:
                                                                                                            'DIP',
                                                                                                          args: [
                                                                                                            [
                                                                                                              {
                                                                                                                prim:
                                                                                                                  'DUP',
                                                                                                                annots: [
                                                                                                                  '@state'
                                                                                                                ]
                                                                                                              }
                                                                                                            ]
                                                                                                          ]
                                                                                                        },
                                                                                                        {
                                                                                                          prim:
                                                                                                            'SWAP'
                                                                                                        }
                                                                                                      ]
                                                                                                    ]
                                                                                                  ]
                                                                                                },
                                                                                                {
                                                                                                  prim:
                                                                                                    'SWAP'
                                                                                                }
                                                                                              ]
                                                                                            ]
                                                                                          ]
                                                                                        },
                                                                                        {
                                                                                          prim:
                                                                                            'SWAP'
                                                                                        }
                                                                                      ]
                                                                                    ]
                                                                                  ]
                                                                                },
                                                                                {
                                                                                  prim:
                                                                                    'SWAP'
                                                                                }
                                                                              ]
                                                                            ]
                                                                          ]
                                                                        },
                                                                        {
                                                                          prim:
                                                                            'SWAP'
                                                                        }
                                                                      ]
                                                                    ]
                                                                  ]
                                                                },
                                                                { prim: 'SWAP' }
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ]
                                                    ]
                                                  ]
                                                },
                                                { prim: 'SWAP' }
                                              ]
                                            ]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              [
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'CAR', annots: ['%totalSupply'] }
                              ],
                              { prim: 'ADD' },
                              { prim: 'PAIR', annots: ['%totalSupply'] },
                              { prim: 'SWAP' },
                              { prim: 'PAIR', annots: ['%decimals'] },
                              { prim: 'SWAP' },
                              { prim: 'PAIR', annots: ['%symbol'] },
                              { prim: 'SWAP' },
                              { prim: 'PAIR', annots: ['%name'] },
                              { prim: 'SWAP' },
                              { prim: 'PAIR', annots: ['@s1', '%balances'] },
                              { prim: 'CDR' },
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              [
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DUP',
                                                                        annots: [
                                                                          '@state'
                                                                        ]
                                                                      }
                                                                    ]
                                                                  ]
                                                                },
                                                                { prim: 'SWAP' }
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ]
                                                    ]
                                                  ]
                                                },
                                                { prim: 'SWAP' }
                                              ]
                                            ]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              { prim: 'CAR', annots: ['%balances'] },
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              [
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      [
                                                                        {
                                                                          prim:
                                                                            'DIP',
                                                                          args: [
                                                                            [
                                                                              {
                                                                                prim:
                                                                                  'DUP',
                                                                                annots: [
                                                                                  '@state'
                                                                                ]
                                                                              }
                                                                            ]
                                                                          ]
                                                                        },
                                                                        {
                                                                          prim:
                                                                            'SWAP'
                                                                        }
                                                                      ]
                                                                    ]
                                                                  ]
                                                                },
                                                                { prim: 'SWAP' }
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ]
                                                    ]
                                                  ]
                                                },
                                                { prim: 'SWAP' }
                                              ]
                                            ]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              { prim: 'CAR', annots: ['%balances'] },
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              [
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DUP',
                                                                        annots: [
                                                                          '@addr'
                                                                        ]
                                                                      }
                                                                    ]
                                                                  ]
                                                                },
                                                                { prim: 'SWAP' }
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ]
                                                    ]
                                                  ]
                                                },
                                                { prim: 'SWAP' }
                                              ]
                                            ]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              { prim: 'GET' },
                              {
                                prim: 'IF_NONE',
                                args: [
                                  [
                                    {
                                      prim: 'PUSH',
                                      args: [{ prim: 'nat' }, { int: '0' }]
                                    }
                                  ],
                                  []
                                ]
                              },
                              { prim: 'RENAME', annots: ['@have'] },
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              [
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      {
                                                        prim: 'DUP',
                                                        annots: ['@tokens']
                                                      }
                                                    ]
                                                  ]
                                                },
                                                { prim: 'SWAP' }
                                              ]
                                            ]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              { prim: 'ADD' },
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              [
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DUP',
                                                                        annots: [
                                                                          '@addr'
                                                                        ]
                                                                      }
                                                                    ]
                                                                  ]
                                                                },
                                                                { prim: 'SWAP' }
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ]
                                                    ]
                                                  ]
                                                },
                                                { prim: 'SWAP' }
                                              ]
                                            ]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              { prim: 'DIP', args: [[{ prim: 'SOME' }]] },
                              {
                                prim: 'DIP',
                                args: [
                                  [
                                    {
                                      prim: 'DIP',
                                      args: [
                                        [
                                          {
                                            prim: 'DIP',
                                            args: [
                                              [
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      { prim: 'DROP' },
                                                      { prim: 'DROP' }
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
                              { prim: 'UPDATE' },
                              { prim: 'PAIR', annots: ['@s2', '%balances'] },
                              { prim: 'NIL', args: [{ prim: 'operation' }] },
                              { prim: 'PAIR' }
                            ]
                          ]
                        },
                        {
                          prim: 'DIP',
                          args: [[{ prim: 'DROP' }, { prim: 'DROP' }]]
                        }
                      ]
                    ]
                  },
                  { prim: 'DIP', args: [[{ prim: 'DROP' }, { prim: 'DROP' }]] }
                ],
                [
                  {
                    prim: 'IF_LEFT',
                    args: [
                      [
                        { prim: 'RENAME', annots: ['@amount_slash_14'] },
                        [
                          {
                            prim: 'DIP',
                            args: [
                              [
                                [
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [{ prim: 'DUP', annots: ['@storage'] }]
                                    ]
                                  },
                                  { prim: 'SWAP' }
                                ]
                              ]
                            ]
                          },
                          { prim: 'SWAP' }
                        ],
                        {
                          prim: 'PUSH',
                          args: [{ prim: 'mutez' }, { int: '1000000000000' }]
                        },
                        {
                          prim: 'PUSH',
                          args: [{ prim: 'mutez' }, { int: '1000000' }]
                        },
                        [
                          {
                            prim: 'DIP',
                            args: [
                              [
                                [
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        [
                                          {
                                            prim: 'DIP',
                                            args: [
                                              [
                                                {
                                                  prim: 'DUP',
                                                  annots: ['@amount']
                                                }
                                              ]
                                            ]
                                          },
                                          { prim: 'SWAP' }
                                        ]
                                      ]
                                    ]
                                  },
                                  { prim: 'SWAP' }
                                ]
                              ]
                            ]
                          },
                          { prim: 'SWAP' }
                        ],
                        { prim: 'MUL', annots: ['@zamt'] },
                        { prim: 'EDIV' },
                        {
                          prim: 'IF_NONE',
                          args: [
                            [
                              {
                                prim: 'PUSH',
                                args: [
                                  { prim: 'string' },
                                  { string: 'bad amount' }
                                ]
                              },
                              { prim: 'FAILWITH' }
                            ],
                            [
                              { prim: 'SENDER', annots: ['@addr'] },
                              {
                                prim: 'PUSH',
                                args: [{ prim: 'mutez' }, { int: '0' }]
                              },
                              { prim: 'AMOUNT', annots: ['@txAmount'] },
                              { prim: 'COMPARE' },
                              { prim: 'NEQ' },
                              {
                                prim: 'IF',
                                args: [
                                  [
                                    {
                                      prim: 'PUSH',
                                      args: [
                                        { prim: 'string' },
                                        {
                                          string:
                                            'cannot buy and sell in same transaction'
                                        }
                                      ]
                                    },
                                    { prim: 'FAILWITH' }
                                  ],
                                  [
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                      annots: ['@state']
                                                    }
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    { prim: 'CAR', annots: ['%balances'] },
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [{ prim: 'DUP', annots: ['@addr'] }]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    { prim: 'GET' },
                                    {
                                      prim: 'IF_NONE',
                                      args: [
                                        [
                                          {
                                            prim: 'PUSH',
                                            args: [
                                              { prim: 'nat' },
                                              { int: '0' }
                                            ]
                                          }
                                        ],
                                        []
                                      ]
                                    },
                                    { prim: 'RENAME', annots: ['@have'] },
                                    { prim: 'DUP', annots: ['@have'] },
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    [
                                                      {
                                                        prim: 'DIP',
                                                        args: [
                                                          [
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            {
                                                                              prim:
                                                                                'DUP',
                                                                              annots: [
                                                                                '@amount'
                                                                              ]
                                                                            }
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ]
                                                          ]
                                                        ]
                                                      },
                                                      { prim: 'SWAP' }
                                                    ]
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    { prim: 'COMPARE' },
                                    { prim: 'GT' },
                                    {
                                      prim: 'IF',
                                      args: [
                                        [
                                          {
                                            prim: 'PUSH',
                                            args: [
                                              { prim: 'string' },
                                              {
                                                string:
                                                  'The address does not have that much stored'
                                              }
                                            ]
                                          },
                                          { prim: 'FAILWITH' }
                                        ],
                                        [
                                          [
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  {
                                                    prim: 'DUP',
                                                    annots: ['@addr']
                                                  }
                                                ]
                                              ]
                                            },
                                            { prim: 'SWAP' }
                                          ],
                                          {
                                            prim: 'CONTRACT',
                                            args: [{ prim: 'unit' }]
                                          },
                                          {
                                            prim: 'IF_NONE',
                                            args: [
                                              [
                                                [
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        {
                                                          prim: 'DUP',
                                                          annots: ['@addr']
                                                        }
                                                      ]
                                                    ]
                                                  },
                                                  { prim: 'SWAP' }
                                                ],
                                                {
                                                  prim: 'PUSH',
                                                  args: [
                                                    { prim: 'string' },
                                                    {
                                                      string:
                                                        'Cannot recover bool contract from:'
                                                    }
                                                  ]
                                                },
                                                { prim: 'PAIR' },
                                                { prim: 'FAILWITH' }
                                              ],
                                              [
                                                [
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        [
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                [
                                                                  {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                      [
                                                                        [
                                                                          {
                                                                            prim:
                                                                              'DIP',
                                                                            args: [
                                                                              [
                                                                                [
                                                                                  {
                                                                                    prim:
                                                                                      'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim:
                                                                                            'DUP',
                                                                                          annots: [
                                                                                            '@amount'
                                                                                          ]
                                                                                        }
                                                                                      ]
                                                                                    ]
                                                                                  },
                                                                                  {
                                                                                    prim:
                                                                                      'SWAP'
                                                                                  }
                                                                                ]
                                                                              ]
                                                                            ]
                                                                          },
                                                                          {
                                                                            prim:
                                                                              'SWAP'
                                                                          }
                                                                        ]
                                                                      ]
                                                                    ]
                                                                  },
                                                                  {
                                                                    prim: 'SWAP'
                                                                  }
                                                                ]
                                                              ]
                                                            ]
                                                          },
                                                          { prim: 'SWAP' }
                                                        ]
                                                      ]
                                                    ]
                                                  },
                                                  { prim: 'SWAP' }
                                                ],
                                                [
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        [
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                [
                                                                  {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                      [
                                                                        [
                                                                          {
                                                                            prim:
                                                                              'DIP',
                                                                            args: [
                                                                              [
                                                                                [
                                                                                  {
                                                                                    prim:
                                                                                      'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim:
                                                                                            'DUP',
                                                                                          annots: [
                                                                                            '@state'
                                                                                          ]
                                                                                        }
                                                                                      ]
                                                                                    ]
                                                                                  },
                                                                                  {
                                                                                    prim:
                                                                                      'SWAP'
                                                                                  }
                                                                                ]
                                                                              ]
                                                                            ]
                                                                          },
                                                                          {
                                                                            prim:
                                                                              'SWAP'
                                                                          }
                                                                        ]
                                                                      ]
                                                                    ]
                                                                  },
                                                                  {
                                                                    prim: 'SWAP'
                                                                  }
                                                                ]
                                                              ]
                                                            ]
                                                          },
                                                          { prim: 'SWAP' }
                                                        ]
                                                      ]
                                                    ]
                                                  },
                                                  { prim: 'SWAP' }
                                                ],
                                                [
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  {
                                                    prim: 'CAR',
                                                    annots: ['%totalSupply']
                                                  }
                                                ],
                                                { prim: 'SUB' },
                                                { prim: 'DUP' },
                                                { prim: 'ABS' },
                                                { prim: 'SWAP' },
                                                { prim: 'GE' },
                                                {
                                                  prim: 'IF',
                                                  args: [
                                                    [
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              {
                                                                prim: 'DUP',
                                                                annots: ['@dst']
                                                              }
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ],
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      [
                                                                        {
                                                                          prim:
                                                                            'DIP',
                                                                          args: [
                                                                            [
                                                                              [
                                                                                {
                                                                                  prim:
                                                                                    'DIP',
                                                                                  args: [
                                                                                    [
                                                                                      [
                                                                                        {
                                                                                          prim:
                                                                                            'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              [
                                                                                                {
                                                                                                  prim:
                                                                                                    'DIP',
                                                                                                  args: [
                                                                                                    [
                                                                                                      {
                                                                                                        prim:
                                                                                                          'DUP',
                                                                                                        annots: [
                                                                                                          '@state'
                                                                                                        ]
                                                                                                      }
                                                                                                    ]
                                                                                                  ]
                                                                                                },
                                                                                                {
                                                                                                  prim:
                                                                                                    'SWAP'
                                                                                                }
                                                                                              ]
                                                                                            ]
                                                                                          ]
                                                                                        },
                                                                                        {
                                                                                          prim:
                                                                                            'SWAP'
                                                                                        }
                                                                                      ]
                                                                                    ]
                                                                                  ]
                                                                                },
                                                                                {
                                                                                  prim:
                                                                                    'SWAP'
                                                                                }
                                                                              ]
                                                                            ]
                                                                          ]
                                                                        },
                                                                        {
                                                                          prim:
                                                                            'SWAP'
                                                                        }
                                                                      ]
                                                                    ]
                                                                  ]
                                                                },
                                                                { prim: 'SWAP' }
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ],
                                                      [
                                                        { prim: 'CDR' },
                                                        { prim: 'CDR' },
                                                        { prim: 'CDR' },
                                                        { prim: 'CDR' },
                                                        { prim: 'CDR' },
                                                        { prim: 'CDR' },
                                                        { prim: 'CDR' },
                                                        {
                                                          prim: 'CDR',
                                                          annots: ['%sellPrice']
                                                        }
                                                      ],
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      [
                                                                        {
                                                                          prim:
                                                                            'DIP',
                                                                          args: [
                                                                            [
                                                                              [
                                                                                {
                                                                                  prim:
                                                                                    'DIP',
                                                                                  args: [
                                                                                    [
                                                                                      [
                                                                                        {
                                                                                          prim:
                                                                                            'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              [
                                                                                                {
                                                                                                  prim:
                                                                                                    'DIP',
                                                                                                  args: [
                                                                                                    [
                                                                                                      {
                                                                                                        prim:
                                                                                                          'DUP'
                                                                                                      }
                                                                                                    ]
                                                                                                  ]
                                                                                                },
                                                                                                {
                                                                                                  prim:
                                                                                                    'SWAP'
                                                                                                }
                                                                                              ]
                                                                                            ]
                                                                                          ]
                                                                                        },
                                                                                        {
                                                                                          prim:
                                                                                            'SWAP'
                                                                                        }
                                                                                      ]
                                                                                    ]
                                                                                  ]
                                                                                },
                                                                                {
                                                                                  prim:
                                                                                    'SWAP'
                                                                                }
                                                                              ]
                                                                            ]
                                                                          ]
                                                                        },
                                                                        {
                                                                          prim:
                                                                            'SWAP'
                                                                        }
                                                                      ]
                                                                    ]
                                                                  ]
                                                                },
                                                                { prim: 'SWAP' }
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ],
                                                      {
                                                        prim: 'CAR',
                                                        annots: ['@nonMicros']
                                                      },
                                                      {
                                                        prim: 'MUL',
                                                        annots: ['@toSend']
                                                      },
                                                      { prim: 'UNIT' },
                                                      {
                                                        prim: 'TRANSFER_TOKENS',
                                                        annots: ['@op']
                                                      },
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      [
                                                                        {
                                                                          prim:
                                                                            'DIP',
                                                                          args: [
                                                                            [
                                                                              [
                                                                                {
                                                                                  prim:
                                                                                    'DIP',
                                                                                  args: [
                                                                                    [
                                                                                      [
                                                                                        {
                                                                                          prim:
                                                                                            'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              [
                                                                                                {
                                                                                                  prim:
                                                                                                    'DIP',
                                                                                                  args: [
                                                                                                    [
                                                                                                      [
                                                                                                        {
                                                                                                          prim:
                                                                                                            'DIP',
                                                                                                          args: [
                                                                                                            [
                                                                                                              {
                                                                                                                prim:
                                                                                                                  'DUP',
                                                                                                                annots: [
                                                                                                                  '@amount'
                                                                                                                ]
                                                                                                              }
                                                                                                            ]
                                                                                                          ]
                                                                                                        },
                                                                                                        {
                                                                                                          prim:
                                                                                                            'SWAP'
                                                                                                        }
                                                                                                      ]
                                                                                                    ]
                                                                                                  ]
                                                                                                },
                                                                                                {
                                                                                                  prim:
                                                                                                    'SWAP'
                                                                                                }
                                                                                              ]
                                                                                            ]
                                                                                          ]
                                                                                        },
                                                                                        {
                                                                                          prim:
                                                                                            'SWAP'
                                                                                        }
                                                                                      ]
                                                                                    ]
                                                                                  ]
                                                                                },
                                                                                {
                                                                                  prim:
                                                                                    'SWAP'
                                                                                }
                                                                              ]
                                                                            ]
                                                                          ]
                                                                        },
                                                                        {
                                                                          prim:
                                                                            'SWAP'
                                                                        }
                                                                      ]
                                                                    ]
                                                                  ]
                                                                },
                                                                { prim: 'SWAP' }
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ],
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      [
                                                                        {
                                                                          prim:
                                                                            'DIP',
                                                                          args: [
                                                                            [
                                                                              [
                                                                                {
                                                                                  prim:
                                                                                    'DIP',
                                                                                  args: [
                                                                                    [
                                                                                      {
                                                                                        prim:
                                                                                          'DUP',
                                                                                        annots: [
                                                                                          '@have'
                                                                                        ]
                                                                                      }
                                                                                    ]
                                                                                  ]
                                                                                },
                                                                                {
                                                                                  prim:
                                                                                    'SWAP'
                                                                                }
                                                                              ]
                                                                            ]
                                                                          ]
                                                                        },
                                                                        {
                                                                          prim:
                                                                            'SWAP'
                                                                        }
                                                                      ]
                                                                    ]
                                                                  ]
                                                                },
                                                                { prim: 'SWAP' }
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ],
                                                      { prim: 'SUB' },
                                                      { prim: 'DUP' },
                                                      { prim: 'ABS' },
                                                      { prim: 'SWAP' },
                                                      { prim: 'GE' },
                                                      {
                                                        prim: 'IF',
                                                        args: [
                                                          [
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            [
                                                                              {
                                                                                prim:
                                                                                  'DIP',
                                                                                args: [
                                                                                  [
                                                                                    [
                                                                                      {
                                                                                        prim:
                                                                                          'DIP',
                                                                                        args: [
                                                                                          [
                                                                                            [
                                                                                              {
                                                                                                prim:
                                                                                                  'DIP',
                                                                                                args: [
                                                                                                  [
                                                                                                    [
                                                                                                      {
                                                                                                        prim:
                                                                                                          'DIP',
                                                                                                        args: [
                                                                                                          [
                                                                                                            [
                                                                                                              {
                                                                                                                prim:
                                                                                                                  'DIP',
                                                                                                                args: [
                                                                                                                  [
                                                                                                                    {
                                                                                                                      prim:
                                                                                                                        'DUP',
                                                                                                                      annots: [
                                                                                                                        '@state'
                                                                                                                      ]
                                                                                                                    }
                                                                                                                  ]
                                                                                                                ]
                                                                                                              },
                                                                                                              {
                                                                                                                prim:
                                                                                                                  'SWAP'
                                                                                                              }
                                                                                                            ]
                                                                                                          ]
                                                                                                        ]
                                                                                                      },
                                                                                                      {
                                                                                                        prim:
                                                                                                          'SWAP'
                                                                                                      }
                                                                                                    ]
                                                                                                  ]
                                                                                                ]
                                                                                              },
                                                                                              {
                                                                                                prim:
                                                                                                  'SWAP'
                                                                                              }
                                                                                            ]
                                                                                          ]
                                                                                        ]
                                                                                      },
                                                                                      {
                                                                                        prim:
                                                                                          'SWAP'
                                                                                      }
                                                                                    ]
                                                                                  ]
                                                                                ]
                                                                              },
                                                                              {
                                                                                prim:
                                                                                  'SWAP'
                                                                              }
                                                                            ]
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ],
                                                            { prim: 'DUP' },
                                                            {
                                                              prim: 'CAR',
                                                              annots: [
                                                                '%balances'
                                                              ]
                                                            },
                                                            { prim: 'SWAP' },
                                                            { prim: 'CDR' },
                                                            { prim: 'DUP' },
                                                            {
                                                              prim: 'CAR',
                                                              annots: ['%name']
                                                            },
                                                            { prim: 'SWAP' },
                                                            { prim: 'CDR' },
                                                            { prim: 'DUP' },
                                                            {
                                                              prim: 'CAR',
                                                              annots: [
                                                                '%symbol'
                                                              ]
                                                            },
                                                            { prim: 'SWAP' },
                                                            { prim: 'CDR' },
                                                            { prim: 'DUP' },
                                                            {
                                                              prim: 'CAR',
                                                              annots: [
                                                                '%decimals'
                                                              ]
                                                            },
                                                            { prim: 'SWAP' },
                                                            { prim: 'CDR' },
                                                            { prim: 'CDR' },
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            [
                                                                              {
                                                                                prim:
                                                                                  'DIP',
                                                                                args: [
                                                                                  [
                                                                                    [
                                                                                      {
                                                                                        prim:
                                                                                          'DIP',
                                                                                        args: [
                                                                                          [
                                                                                            [
                                                                                              {
                                                                                                prim:
                                                                                                  'DIP',
                                                                                                args: [
                                                                                                  [
                                                                                                    [
                                                                                                      {
                                                                                                        prim:
                                                                                                          'DIP',
                                                                                                        args: [
                                                                                                          [
                                                                                                            [
                                                                                                              {
                                                                                                                prim:
                                                                                                                  'DIP',
                                                                                                                args: [
                                                                                                                  [
                                                                                                                    {
                                                                                                                      prim:
                                                                                                                        'DUP',
                                                                                                                      annots: [
                                                                                                                        '@newSupply'
                                                                                                                      ]
                                                                                                                    }
                                                                                                                  ]
                                                                                                                ]
                                                                                                              },
                                                                                                              {
                                                                                                                prim:
                                                                                                                  'SWAP'
                                                                                                              }
                                                                                                            ]
                                                                                                          ]
                                                                                                        ]
                                                                                                      },
                                                                                                      {
                                                                                                        prim:
                                                                                                          'SWAP'
                                                                                                      }
                                                                                                    ]
                                                                                                  ]
                                                                                                ]
                                                                                              },
                                                                                              {
                                                                                                prim:
                                                                                                  'SWAP'
                                                                                              }
                                                                                            ]
                                                                                          ]
                                                                                        ]
                                                                                      },
                                                                                      {
                                                                                        prim:
                                                                                          'SWAP'
                                                                                      }
                                                                                    ]
                                                                                  ]
                                                                                ]
                                                                              },
                                                                              {
                                                                                prim:
                                                                                  'SWAP'
                                                                              }
                                                                            ]
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ],
                                                            {
                                                              prim: 'PAIR',
                                                              annots: [
                                                                '%totalSupply'
                                                              ]
                                                            },
                                                            { prim: 'SWAP' },
                                                            {
                                                              prim: 'PAIR',
                                                              annots: [
                                                                '%decimals'
                                                              ]
                                                            },
                                                            { prim: 'SWAP' },
                                                            {
                                                              prim: 'PAIR',
                                                              annots: [
                                                                '%symbol'
                                                              ]
                                                            },
                                                            { prim: 'SWAP' },
                                                            {
                                                              prim: 'PAIR',
                                                              annots: ['%name']
                                                            },
                                                            { prim: 'SWAP' },
                                                            {
                                                              prim: 'PAIR',
                                                              annots: [
                                                                '@s1',
                                                                '%balances'
                                                              ]
                                                            },
                                                            { prim: 'CDR' },
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            [
                                                                              {
                                                                                prim:
                                                                                  'DIP',
                                                                                args: [
                                                                                  [
                                                                                    [
                                                                                      {
                                                                                        prim:
                                                                                          'DIP',
                                                                                        args: [
                                                                                          [
                                                                                            [
                                                                                              {
                                                                                                prim:
                                                                                                  'DIP',
                                                                                                args: [
                                                                                                  [
                                                                                                    [
                                                                                                      {
                                                                                                        prim:
                                                                                                          'DIP',
                                                                                                        args: [
                                                                                                          [
                                                                                                            [
                                                                                                              {
                                                                                                                prim:
                                                                                                                  'DIP',
                                                                                                                args: [
                                                                                                                  [
                                                                                                                    [
                                                                                                                      {
                                                                                                                        prim:
                                                                                                                          'DIP',
                                                                                                                        args: [
                                                                                                                          [
                                                                                                                            {
                                                                                                                              prim:
                                                                                                                                'DUP',
                                                                                                                              annots: [
                                                                                                                                '@state'
                                                                                                                              ]
                                                                                                                            }
                                                                                                                          ]
                                                                                                                        ]
                                                                                                                      },
                                                                                                                      {
                                                                                                                        prim:
                                                                                                                          'SWAP'
                                                                                                                      }
                                                                                                                    ]
                                                                                                                  ]
                                                                                                                ]
                                                                                                              },
                                                                                                              {
                                                                                                                prim:
                                                                                                                  'SWAP'
                                                                                                              }
                                                                                                            ]
                                                                                                          ]
                                                                                                        ]
                                                                                                      },
                                                                                                      {
                                                                                                        prim:
                                                                                                          'SWAP'
                                                                                                      }
                                                                                                    ]
                                                                                                  ]
                                                                                                ]
                                                                                              },
                                                                                              {
                                                                                                prim:
                                                                                                  'SWAP'
                                                                                              }
                                                                                            ]
                                                                                          ]
                                                                                        ]
                                                                                      },
                                                                                      {
                                                                                        prim:
                                                                                          'SWAP'
                                                                                      }
                                                                                    ]
                                                                                  ]
                                                                                ]
                                                                              },
                                                                              {
                                                                                prim:
                                                                                  'SWAP'
                                                                              }
                                                                            ]
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ],
                                                            {
                                                              prim: 'CAR',
                                                              annots: [
                                                                '%balances'
                                                              ]
                                                            },
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            {
                                                                              prim:
                                                                                'DUP',
                                                                              annots: [
                                                                                '@newBalance'
                                                                              ]
                                                                            }
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ],
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            [
                                                                              {
                                                                                prim:
                                                                                  'DIP',
                                                                                args: [
                                                                                  [
                                                                                    [
                                                                                      {
                                                                                        prim:
                                                                                          'DIP',
                                                                                        args: [
                                                                                          [
                                                                                            [
                                                                                              {
                                                                                                prim:
                                                                                                  'DIP',
                                                                                                args: [
                                                                                                  [
                                                                                                    [
                                                                                                      {
                                                                                                        prim:
                                                                                                          'DIP',
                                                                                                        args: [
                                                                                                          [
                                                                                                            [
                                                                                                              {
                                                                                                                prim:
                                                                                                                  'DIP',
                                                                                                                args: [
                                                                                                                  [
                                                                                                                    [
                                                                                                                      {
                                                                                                                        prim:
                                                                                                                          'DIP',
                                                                                                                        args: [
                                                                                                                          [
                                                                                                                            {
                                                                                                                              prim:
                                                                                                                                'DUP',
                                                                                                                              annots: [
                                                                                                                                '@addr'
                                                                                                                              ]
                                                                                                                            }
                                                                                                                          ]
                                                                                                                        ]
                                                                                                                      },
                                                                                                                      {
                                                                                                                        prim:
                                                                                                                          'SWAP'
                                                                                                                      }
                                                                                                                    ]
                                                                                                                  ]
                                                                                                                ]
                                                                                                              },
                                                                                                              {
                                                                                                                prim:
                                                                                                                  'SWAP'
                                                                                                              }
                                                                                                            ]
                                                                                                          ]
                                                                                                        ]
                                                                                                      },
                                                                                                      {
                                                                                                        prim:
                                                                                                          'SWAP'
                                                                                                      }
                                                                                                    ]
                                                                                                  ]
                                                                                                ]
                                                                                              },
                                                                                              {
                                                                                                prim:
                                                                                                  'SWAP'
                                                                                              }
                                                                                            ]
                                                                                          ]
                                                                                        ]
                                                                                      },
                                                                                      {
                                                                                        prim:
                                                                                          'SWAP'
                                                                                      }
                                                                                    ]
                                                                                  ]
                                                                                ]
                                                                              },
                                                                              {
                                                                                prim:
                                                                                  'SWAP'
                                                                              }
                                                                            ]
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ],
                                                            {
                                                              prim: 'DIP',
                                                              args: [
                                                                [
                                                                  {
                                                                    prim: 'SOME'
                                                                  }
                                                                ]
                                                              ]
                                                            },
                                                            {
                                                              prim: 'DIP',
                                                              args: [
                                                                [
                                                                  {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                      [
                                                                        {
                                                                          prim:
                                                                            'DIP',
                                                                          args: [
                                                                            [
                                                                              {
                                                                                prim:
                                                                                  'DIP',
                                                                                args: [
                                                                                  [
                                                                                    {
                                                                                      prim:
                                                                                        'DROP'
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
                                                            { prim: 'UPDATE' },
                                                            {
                                                              prim: 'PAIR',
                                                              annots: [
                                                                '@s2',
                                                                '%balances'
                                                              ]
                                                            },
                                                            {
                                                              prim: 'NIL',
                                                              args: [
                                                                {
                                                                  prim:
                                                                    'operation'
                                                                }
                                                              ]
                                                            },
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            {
                                                                              prim:
                                                                                'DUP'
                                                                            }
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ],
                                                            { prim: 'CONS' },
                                                            { prim: 'PAIR' }
                                                          ],
                                                          [
                                                            {
                                                              prim: 'PUSH',
                                                              args: [
                                                                {
                                                                  prim: 'string'
                                                                },
                                                                {
                                                                  string:
                                                                    'bad amount'
                                                                }
                                                              ]
                                                            },
                                                            { prim: 'FAILWITH' }
                                                          ]
                                                        ]
                                                      },
                                                      {
                                                        prim: 'DIP',
                                                        args: [
                                                          [
                                                            { prim: 'DROP' },
                                                            { prim: 'DROP' }
                                                          ]
                                                        ]
                                                      }
                                                    ],
                                                    [
                                                      {
                                                        prim: 'PUSH',
                                                        args: [
                                                          { prim: 'string' },
                                                          {
                                                            string: 'bad amount'
                                                          }
                                                        ]
                                                      },
                                                      { prim: 'FAILWITH' }
                                                    ]
                                                  ]
                                                },
                                                {
                                                  prim: 'DIP',
                                                  args: [[{ prim: 'DROP' }]]
                                                }
                                              ]
                                            ]
                                          }
                                        ]
                                      ]
                                    },
                                    { prim: 'DIP', args: [[{ prim: 'DROP' }]] }
                                  ]
                                ]
                              },
                              {
                                prim: 'DIP',
                                args: [[{ prim: 'DROP' }, { prim: 'DROP' }]]
                              }
                            ]
                          ]
                        },
                        {
                          prim: 'DIP',
                          args: [[{ prim: 'DROP' }, { prim: 'DROP' }]]
                        }
                      ],
                      [
                        {
                          prim: 'IF_LEFT',
                          args: [
                            [
                              { prim: 'RENAME', annots: ['@amt_slash_33'] },
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                                annots: ['@storage']
                                              }
                                            ]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              {
                                prim: 'PUSH',
                                args: [
                                  {
                                    prim: 'contract',
                                    args: [{ prim: 'unit' }],
                                    annots: [':UnitContract']
                                  },
                                  {
                                    string:
                                      'tz1LBEKXaxQbd5Gtzbc1ATCwc3pppu81aWGc'
                                  }
                                ],
                                annots: ['@dest']
                              },
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [{ prim: 'DUP', annots: ['@amt'] }]
                                          ]
                                        },
                                        { prim: 'SWAP' }
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              { prim: 'UNIT' },
                              { prim: 'TRANSFER_TOKENS', annots: ['@op'] },
                              [
                                {
                                  prim: 'DIP',
                                  args: [[{ prim: 'DUP', annots: ['@state'] }]]
                                },
                                { prim: 'SWAP' }
                              ],
                              [
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'CAR', annots: ['%owner'] }
                              ],
                              { prim: 'SOURCE', annots: ['@addr'] },
                              { prim: 'COMPARE' },
                              { prim: 'NEQ' },
                              {
                                prim: 'IF',
                                args: [
                                  [
                                    {
                                      prim: 'PUSH',
                                      args: [
                                        { prim: 'string' },
                                        { string: 'Only owner can withdraw' }
                                      ]
                                    },
                                    { prim: 'FAILWITH' }
                                  ],
                                  [
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [{ prim: 'DUP', annots: ['@state'] }]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%balances'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%name'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%symbol'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%decimals'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%totalSupply'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'CDR' },
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    [
                                                      {
                                                        prim: 'DIP',
                                                        args: [
                                                          [
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            [
                                                                              {
                                                                                prim:
                                                                                  'DIP',
                                                                                args: [
                                                                                  [
                                                                                    [
                                                                                      {
                                                                                        prim:
                                                                                          'DIP',
                                                                                        args: [
                                                                                          [
                                                                                            [
                                                                                              {
                                                                                                prim:
                                                                                                  'DIP',
                                                                                                args: [
                                                                                                  [
                                                                                                    {
                                                                                                      prim:
                                                                                                        'DUP',
                                                                                                      annots: [
                                                                                                        '@amt'
                                                                                                      ]
                                                                                                    }
                                                                                                  ]
                                                                                                ]
                                                                                              },
                                                                                              {
                                                                                                prim:
                                                                                                  'SWAP'
                                                                                              }
                                                                                            ]
                                                                                          ]
                                                                                        ]
                                                                                      },
                                                                                      {
                                                                                        prim:
                                                                                          'SWAP'
                                                                                      }
                                                                                    ]
                                                                                  ]
                                                                                ]
                                                                              },
                                                                              {
                                                                                prim:
                                                                                  'SWAP'
                                                                              }
                                                                            ]
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ]
                                                          ]
                                                        ]
                                                      },
                                                      { prim: 'SWAP' }
                                                    ]
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    [
                                                      {
                                                        prim: 'DIP',
                                                        args: [
                                                          [
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            [
                                                                              {
                                                                                prim:
                                                                                  'DIP',
                                                                                args: [
                                                                                  [
                                                                                    [
                                                                                      {
                                                                                        prim:
                                                                                          'DIP',
                                                                                        args: [
                                                                                          [
                                                                                            [
                                                                                              {
                                                                                                prim:
                                                                                                  'DIP',
                                                                                                args: [
                                                                                                  [
                                                                                                    {
                                                                                                      prim:
                                                                                                        'DUP',
                                                                                                      annots: [
                                                                                                        '@state'
                                                                                                      ]
                                                                                                    }
                                                                                                  ]
                                                                                                ]
                                                                                              },
                                                                                              {
                                                                                                prim:
                                                                                                  'SWAP'
                                                                                              }
                                                                                            ]
                                                                                          ]
                                                                                        ]
                                                                                      },
                                                                                      {
                                                                                        prim:
                                                                                          'SWAP'
                                                                                      }
                                                                                    ]
                                                                                  ]
                                                                                ]
                                                                              },
                                                                              {
                                                                                prim:
                                                                                  'SWAP'
                                                                              }
                                                                            ]
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ]
                                                          ]
                                                        ]
                                                      },
                                                      { prim: 'SWAP' }
                                                    ]
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    [
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CAR', annots: ['%inBaker'] }
                                    ],
                                    { prim: 'ADD' },
                                    { prim: 'PAIR', annots: ['%inBaker'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%totalSupply'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%decimals'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%symbol'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%name'] },
                                    { prim: 'SWAP' },
                                    {
                                      prim: 'PAIR',
                                      annots: ['@s1', '%balances']
                                    },
                                    {
                                      prim: 'NIL',
                                      args: [{ prim: 'operation' }]
                                    },
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                      annots: ['@op']
                                                    }
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    { prim: 'CONS' },
                                    { prim: 'PAIR' }
                                  ]
                                ]
                              },
                              {
                                prim: 'DIP',
                                args: [
                                  [
                                    { prim: 'DROP' },
                                    { prim: 'DROP' },
                                    { prim: 'DROP' }
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
                                      prim: 'RENAME',
                                      annots: ['@nop_slash_39']
                                    },
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                      annots: ['@storage']
                                                    }
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    { prim: 'DUP', annots: ['@state'] },
                                    [
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CAR', annots: ['%owner'] }
                                    ],
                                    { prim: 'SOURCE', annots: ['@addr'] },
                                    { prim: 'COMPARE' },
                                    { prim: 'NEQ' },
                                    {
                                      prim: 'IF',
                                      args: [
                                        [
                                          {
                                            prim: 'PUSH',
                                            args: [
                                              { prim: 'string' },
                                              {
                                                string: 'Only owner can deposit'
                                              }
                                            ]
                                          },
                                          { prim: 'FAILWITH' }
                                        ],
                                        [
                                          { prim: 'DUP', annots: ['@state'] },
                                          { prim: 'DUP' },
                                          {
                                            prim: 'CAR',
                                            annots: ['%balances']
                                          },
                                          { prim: 'SWAP' },
                                          { prim: 'CDR' },
                                          { prim: 'DUP' },
                                          { prim: 'CAR', annots: ['%name'] },
                                          { prim: 'SWAP' },
                                          { prim: 'CDR' },
                                          { prim: 'DUP' },
                                          { prim: 'CAR', annots: ['%symbol'] },
                                          { prim: 'SWAP' },
                                          { prim: 'CDR' },
                                          { prim: 'DUP' },
                                          {
                                            prim: 'CAR',
                                            annots: ['%decimals']
                                          },
                                          { prim: 'SWAP' },
                                          { prim: 'CDR' },
                                          { prim: 'DUP' },
                                          {
                                            prim: 'CAR',
                                            annots: ['%totalSupply']
                                          },
                                          { prim: 'SWAP' },
                                          { prim: 'CDR' },
                                          { prim: 'CDR' },
                                          {
                                            prim: 'AMOUNT',
                                            annots: ['@amount']
                                          },
                                          [
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  [
                                                    {
                                                      prim: 'DIP',
                                                      args: [
                                                        [
                                                          [
                                                            {
                                                              prim: 'DIP',
                                                              args: [
                                                                [
                                                                  [
                                                                    {
                                                                      prim:
                                                                        'DIP',
                                                                      args: [
                                                                        [
                                                                          [
                                                                            {
                                                                              prim:
                                                                                'DIP',
                                                                              args: [
                                                                                [
                                                                                  [
                                                                                    {
                                                                                      prim:
                                                                                        'DIP',
                                                                                      args: [
                                                                                        [
                                                                                          [
                                                                                            {
                                                                                              prim:
                                                                                                'DIP',
                                                                                              args: [
                                                                                                [
                                                                                                  {
                                                                                                    prim:
                                                                                                      'DUP',
                                                                                                    annots: [
                                                                                                      '@state'
                                                                                                    ]
                                                                                                  }
                                                                                                ]
                                                                                              ]
                                                                                            },
                                                                                            {
                                                                                              prim:
                                                                                                'SWAP'
                                                                                            }
                                                                                          ]
                                                                                        ]
                                                                                      ]
                                                                                    },
                                                                                    {
                                                                                      prim:
                                                                                        'SWAP'
                                                                                    }
                                                                                  ]
                                                                                ]
                                                                              ]
                                                                            },
                                                                            {
                                                                              prim:
                                                                                'SWAP'
                                                                            }
                                                                          ]
                                                                        ]
                                                                      ]
                                                                    },
                                                                    {
                                                                      prim:
                                                                        'SWAP'
                                                                    }
                                                                  ]
                                                                ]
                                                              ]
                                                            },
                                                            { prim: 'SWAP' }
                                                          ]
                                                        ]
                                                      ]
                                                    },
                                                    { prim: 'SWAP' }
                                                  ]
                                                ]
                                              ]
                                            },
                                            { prim: 'SWAP' }
                                          ],
                                          [
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            {
                                              prim: 'CAR',
                                              annots: ['%inBaker']
                                            }
                                          ],
                                          { prim: 'SUB' },
                                          {
                                            prim: 'PAIR',
                                            annots: ['%inBaker']
                                          },
                                          { prim: 'SWAP' },
                                          {
                                            prim: 'PAIR',
                                            annots: ['%totalSupply']
                                          },
                                          { prim: 'SWAP' },
                                          {
                                            prim: 'PAIR',
                                            annots: ['%decimals']
                                          },
                                          { prim: 'SWAP' },
                                          { prim: 'PAIR', annots: ['%symbol'] },
                                          { prim: 'SWAP' },
                                          { prim: 'PAIR', annots: ['%name'] },
                                          { prim: 'SWAP' },
                                          {
                                            prim: 'PAIR',
                                            annots: ['@s1', '%balances']
                                          },
                                          {
                                            prim: 'NIL',
                                            args: [{ prim: 'operation' }]
                                          },
                                          { prim: 'PAIR' }
                                        ]
                                      ]
                                    },
                                    {
                                      prim: 'DIP',
                                      args: [
                                        [{ prim: 'DROP' }, { prim: 'DROP' }]
                                      ]
                                    }
                                  ],
                                  [
                                    {
                                      prim: 'RENAME',
                                      annots: ['@info_slash_44']
                                    },
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                      annots: ['@storage']
                                                    }
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    { prim: 'DUP', annots: ['@state'] },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%balances'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%name'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%symbol'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%decimals'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%totalSupply'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%inBaker'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%owner'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'CAR', annots: ['%buyPrice'] },
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    [
                                                      {
                                                        prim: 'DIP',
                                                        args: [
                                                          [
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            [
                                                                              {
                                                                                prim:
                                                                                  'DIP',
                                                                                args: [
                                                                                  [
                                                                                    [
                                                                                      {
                                                                                        prim:
                                                                                          'DIP',
                                                                                        args: [
                                                                                          [
                                                                                            [
                                                                                              {
                                                                                                prim:
                                                                                                  'DIP',
                                                                                                args: [
                                                                                                  [
                                                                                                    [
                                                                                                      {
                                                                                                        prim:
                                                                                                          'DIP',
                                                                                                        args: [
                                                                                                          [
                                                                                                            {
                                                                                                              prim:
                                                                                                                'DUP',
                                                                                                              annots: [
                                                                                                                '@info'
                                                                                                              ]
                                                                                                            }
                                                                                                          ]
                                                                                                        ]
                                                                                                      },
                                                                                                      {
                                                                                                        prim:
                                                                                                          'SWAP'
                                                                                                      }
                                                                                                    ]
                                                                                                  ]
                                                                                                ]
                                                                                              },
                                                                                              {
                                                                                                prim:
                                                                                                  'SWAP'
                                                                                              }
                                                                                            ]
                                                                                          ]
                                                                                        ]
                                                                                      },
                                                                                      {
                                                                                        prim:
                                                                                          'SWAP'
                                                                                      }
                                                                                    ]
                                                                                  ]
                                                                                ]
                                                                              },
                                                                              {
                                                                                prim:
                                                                                  'SWAP'
                                                                              }
                                                                            ]
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ]
                                                          ]
                                                        ]
                                                      },
                                                      { prim: 'SWAP' }
                                                    ]
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    { prim: 'CAR', annots: ['%sellP'] },
                                    { prim: 'SWAP' },
                                    {
                                      prim: 'PAIR',
                                      annots: ['%buyPrice', '%sellPrice']
                                    },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%owner'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%inBaker'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%totalSupply'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%decimals'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%symbol'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%name'] },
                                    { prim: 'SWAP' },
                                    {
                                      prim: 'PAIR',
                                      annots: ['@s1', '%balances']
                                    },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%balances'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%name'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%symbol'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%decimals'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%totalSupply'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%inBaker'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'DUP' },
                                    { prim: 'CAR', annots: ['%owner'] },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' },
                                    { prim: 'CDR', annots: ['%sellPrice'] },
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    [
                                                      {
                                                        prim: 'DIP',
                                                        args: [
                                                          [
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    [
                                                                      {
                                                                        prim:
                                                                          'DIP',
                                                                        args: [
                                                                          [
                                                                            [
                                                                              {
                                                                                prim:
                                                                                  'DIP',
                                                                                args: [
                                                                                  [
                                                                                    [
                                                                                      {
                                                                                        prim:
                                                                                          'DIP',
                                                                                        args: [
                                                                                          [
                                                                                            [
                                                                                              {
                                                                                                prim:
                                                                                                  'DIP',
                                                                                                args: [
                                                                                                  [
                                                                                                    [
                                                                                                      {
                                                                                                        prim:
                                                                                                          'DIP',
                                                                                                        args: [
                                                                                                          [
                                                                                                            {
                                                                                                              prim:
                                                                                                                'DUP',
                                                                                                              annots: [
                                                                                                                '@info'
                                                                                                              ]
                                                                                                            }
                                                                                                          ]
                                                                                                        ]
                                                                                                      },
                                                                                                      {
                                                                                                        prim:
                                                                                                          'SWAP'
                                                                                                      }
                                                                                                    ]
                                                                                                  ]
                                                                                                ]
                                                                                              },
                                                                                              {
                                                                                                prim:
                                                                                                  'SWAP'
                                                                                              }
                                                                                            ]
                                                                                          ]
                                                                                        ]
                                                                                      },
                                                                                      {
                                                                                        prim:
                                                                                          'SWAP'
                                                                                      }
                                                                                    ]
                                                                                  ]
                                                                                ]
                                                                              },
                                                                              {
                                                                                prim:
                                                                                  'SWAP'
                                                                              }
                                                                            ]
                                                                          ]
                                                                        ]
                                                                      },
                                                                      {
                                                                        prim:
                                                                          'SWAP'
                                                                      }
                                                                    ]
                                                                  ]
                                                                ]
                                                              },
                                                              { prim: 'SWAP' }
                                                            ]
                                                          ]
                                                        ]
                                                      },
                                                      { prim: 'SWAP' }
                                                    ]
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    [
                                      { prim: 'CDR' },
                                      { prim: 'CAR', annots: ['%buyP'] }
                                    ],
                                    {
                                      prim: 'PAIR',
                                      annots: ['%buyPrice', '%sellPrice']
                                    },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%owner'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%inBaker'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%totalSupply'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%decimals'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%symbol'] },
                                    { prim: 'SWAP' },
                                    { prim: 'PAIR', annots: ['%name'] },
                                    { prim: 'SWAP' },
                                    {
                                      prim: 'PAIR',
                                      annots: ['@s2', '%balances']
                                    },
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                      annots: ['@info']
                                                    }
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    { prim: 'CAR', annots: ['%sellP'] },
                                    [
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            [
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    [
                                                      {
                                                        prim: 'DIP',
                                                        args: [
                                                          [
                                                            {
                                                              prim: 'DUP',
                                                              annots: ['@info']
                                                            }
                                                          ]
                                                        ]
                                                      },
                                                      { prim: 'SWAP' }
                                                    ]
                                                  ]
                                                ]
                                              },
                                              { prim: 'SWAP' }
                                            ]
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    [
                                      { prim: 'CDR' },
                                      { prim: 'CAR', annots: ['%buyP'] }
                                    ],
                                    { prim: 'COMPARE' },
                                    { prim: 'LT' },
                                    {
                                      prim: 'IF',
                                      args: [
                                        [
                                          {
                                            prim: 'PUSH',
                                            args: [
                                              { prim: 'string' },
                                              {
                                                string:
                                                  'invalid price, enables arbitrage'
                                              }
                                            ]
                                          },
                                          { prim: 'FAILWITH' }
                                        ],
                                        [
                                          [
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  {
                                                    prim: 'DUP',
                                                    annots: ['@state']
                                                  }
                                                ]
                                              ]
                                            },
                                            { prim: 'SWAP' }
                                          ],
                                          [
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            { prim: 'CAR', annots: ['%owner'] }
                                          ],
                                          { prim: 'SOURCE', annots: ['@addr'] },
                                          { prim: 'COMPARE' },
                                          { prim: 'NEQ' },
                                          {
                                            prim: 'IF',
                                            args: [
                                              [
                                                {
                                                  prim: 'PUSH',
                                                  args: [
                                                    { prim: 'string' },
                                                    {
                                                      string:
                                                        'Only owner can set price'
                                                    }
                                                  ]
                                                },
                                                { prim: 'FAILWITH' }
                                              ],
                                              [
                                                {
                                                  prim: 'DUP',
                                                  annots: ['@s2']
                                                },
                                                { prim: 'DUP' },
                                                {
                                                  prim: 'CAR',
                                                  annots: ['%balances']
                                                },
                                                { prim: 'SWAP' },
                                                { prim: 'CDR' },
                                                { prim: 'DUP' },
                                                {
                                                  prim: 'CAR',
                                                  annots: ['%name']
                                                },
                                                { prim: 'SWAP' },
                                                { prim: 'CDR' },
                                                { prim: 'DUP' },
                                                {
                                                  prim: 'CAR',
                                                  annots: ['%symbol']
                                                },
                                                { prim: 'SWAP' },
                                                { prim: 'CDR' },
                                                { prim: 'DUP' },
                                                {
                                                  prim: 'CAR',
                                                  annots: ['%decimals']
                                                },
                                                { prim: 'SWAP' },
                                                { prim: 'CDR' },
                                                { prim: 'DUP' },
                                                {
                                                  prim: 'CAR',
                                                  annots: ['%totalSupply']
                                                },
                                                { prim: 'SWAP' },
                                                { prim: 'CDR' },
                                                { prim: 'CDR' },
                                                [
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        [
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                [
                                                                  {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                      [
                                                                        [
                                                                          {
                                                                            prim:
                                                                              'DIP',
                                                                            args: [
                                                                              [
                                                                                [
                                                                                  {
                                                                                    prim:
                                                                                      'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        [
                                                                                          {
                                                                                            prim:
                                                                                              'DIP',
                                                                                            args: [
                                                                                              [
                                                                                                [
                                                                                                  {
                                                                                                    prim:
                                                                                                      'DIP',
                                                                                                    args: [
                                                                                                      [
                                                                                                        [
                                                                                                          {
                                                                                                            prim:
                                                                                                              'DIP',
                                                                                                            args: [
                                                                                                              [
                                                                                                                {
                                                                                                                  prim:
                                                                                                                    'DUP',
                                                                                                                  annots: [
                                                                                                                    '@info'
                                                                                                                  ]
                                                                                                                }
                                                                                                              ]
                                                                                                            ]
                                                                                                          },
                                                                                                          {
                                                                                                            prim:
                                                                                                              'SWAP'
                                                                                                          }
                                                                                                        ]
                                                                                                      ]
                                                                                                    ]
                                                                                                  },
                                                                                                  {
                                                                                                    prim:
                                                                                                      'SWAP'
                                                                                                  }
                                                                                                ]
                                                                                              ]
                                                                                            ]
                                                                                          },
                                                                                          {
                                                                                            prim:
                                                                                              'SWAP'
                                                                                          }
                                                                                        ]
                                                                                      ]
                                                                                    ]
                                                                                  },
                                                                                  {
                                                                                    prim:
                                                                                      'SWAP'
                                                                                  }
                                                                                ]
                                                                              ]
                                                                            ]
                                                                          },
                                                                          {
                                                                            prim:
                                                                              'SWAP'
                                                                          }
                                                                        ]
                                                                      ]
                                                                    ]
                                                                  },
                                                                  {
                                                                    prim: 'SWAP'
                                                                  }
                                                                ]
                                                              ]
                                                            ]
                                                          },
                                                          { prim: 'SWAP' }
                                                        ]
                                                      ]
                                                    ]
                                                  },
                                                  { prim: 'SWAP' }
                                                ],
                                                [
                                                  { prim: 'CDR' },
                                                  {
                                                    prim: 'CDR',
                                                    annots: ['%extraBalance']
                                                  }
                                                ],
                                                [
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        [
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                [
                                                                  {
                                                                    prim: 'DIP',
                                                                    args: [
                                                                      [
                                                                        [
                                                                          {
                                                                            prim:
                                                                              'DIP',
                                                                            args: [
                                                                              [
                                                                                [
                                                                                  {
                                                                                    prim:
                                                                                      'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        [
                                                                                          {
                                                                                            prim:
                                                                                              'DIP',
                                                                                            args: [
                                                                                              [
                                                                                                [
                                                                                                  {
                                                                                                    prim:
                                                                                                      'DIP',
                                                                                                    args: [
                                                                                                      [
                                                                                                        {
                                                                                                          prim:
                                                                                                            'DUP',
                                                                                                          annots: [
                                                                                                            '@s2'
                                                                                                          ]
                                                                                                        }
                                                                                                      ]
                                                                                                    ]
                                                                                                  },
                                                                                                  {
                                                                                                    prim:
                                                                                                      'SWAP'
                                                                                                  }
                                                                                                ]
                                                                                              ]
                                                                                            ]
                                                                                          },
                                                                                          {
                                                                                            prim:
                                                                                              'SWAP'
                                                                                          }
                                                                                        ]
                                                                                      ]
                                                                                    ]
                                                                                  },
                                                                                  {
                                                                                    prim:
                                                                                      'SWAP'
                                                                                  }
                                                                                ]
                                                                              ]
                                                                            ]
                                                                          },
                                                                          {
                                                                            prim:
                                                                              'SWAP'
                                                                          }
                                                                        ]
                                                                      ]
                                                                    ]
                                                                  },
                                                                  {
                                                                    prim: 'SWAP'
                                                                  }
                                                                ]
                                                              ]
                                                            ]
                                                          },
                                                          { prim: 'SWAP' }
                                                        ]
                                                      ]
                                                    ]
                                                  },
                                                  { prim: 'SWAP' }
                                                ],
                                                [
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  {
                                                    prim: 'CAR',
                                                    annots: ['%inBaker']
                                                  }
                                                ],
                                                { prim: 'ADD' },
                                                {
                                                  prim: 'PAIR',
                                                  annots: ['%inBaker']
                                                },
                                                { prim: 'SWAP' },
                                                {
                                                  prim: 'PAIR',
                                                  annots: ['%totalSupply']
                                                },
                                                { prim: 'SWAP' },
                                                {
                                                  prim: 'PAIR',
                                                  annots: ['%decimals']
                                                },
                                                { prim: 'SWAP' },
                                                {
                                                  prim: 'PAIR',
                                                  annots: ['%symbol']
                                                },
                                                { prim: 'SWAP' },
                                                {
                                                  prim: 'PAIR',
                                                  annots: ['%name']
                                                },
                                                { prim: 'SWAP' },
                                                {
                                                  prim: 'PAIR',
                                                  annots: ['@s3', '%balances']
                                                },
                                                {
                                                  prim: 'NIL',
                                                  args: [{ prim: 'operation' }]
                                                },
                                                { prim: 'PAIR' }
                                              ]
                                            ]
                                          }
                                        ]
                                      ]
                                    },
                                    {
                                      prim: 'DIP',
                                      args: [
                                        [
                                          { prim: 'DROP' },
                                          { prim: 'DROP' },
                                          { prim: 'DROP' }
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
                  }
                ]
              ]
            },
            { prim: 'DIP', args: [[{ prim: 'DROP' }, { prim: 'DROP' }]] }
          ]
        ]
      }
    ],
    storage: {
      prim: 'Pair',
      args: [
        [
          {
            prim: 'Elt',
            args: [
              { string: 'tz1LBAWdvnHjqxNNyYJhy9eBcaj3mE3cjhNQ' },
              { int: '700000000' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1LWXJ1rZKCBeQzqtPriNiFpKU5gWo2u8zT' },
              { int: '11220754689' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1NNf9KDcPa6iSi64gy1na5msfjcv3XWJs2' },
              { int: '37742509148' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1QXuUweuLrxC3LmDMoPxmpT19ijhPTc1bt' },
              { int: '9967227' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1R6ZvSYDHYCqeK3NckyjN9z1H5rHVc1xr9' },
              { int: '20856441766' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1S6yEw9hZKcNkWnoVnyjQ5Qfakt3kdYLE9' },
              { int: '0' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1TowqAmCuYzkeZ98xyacN2SnKnzJM6ssVE' },
              { int: '26757313041' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1VLcYgQsvarbcWCPfUw1Fcz27jVrB2zYBr' },
              { int: '995650005' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1WTcM46fg6fN5fdbhz1LgX2GbqyKTczzR7' },
              { int: '1043871972' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1WzAsDfPhpTA75h37pCbN2jC9JPYyhUuc2' },
              { int: '21165644772' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1amzJBBjgMaUfpEoX4npYQuXqdb4fvuBpr' },
              { int: '14268243108' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1b22ii76LksTJm7JTi6wtCYEXFa82FdwaH' },
              { int: '4193732' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1bPGEnW2wGjpyceJdUSpDHFShGddPysAHE' },
              { int: '49644981635' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1bxHfbJyEFaHzeiCfpmtwUoGtLE6VT94HC' },
              { int: '5581647542' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1cf4tBruBKA7keMHiHqivsz4oDcBBGSVDm' },
              { int: '1902576' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1cxjPRxvdYoLCUzfcJthAkdnTAunA2Dm5U' },
              { int: '8417961239' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1d8x5yMzMQRVjpuSZUUBgJtqRGMzbunvQP' },
              { int: '17437358995' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1eDP1gCVMZkukT4dxetSJMZJHmkTMBY2mL' },
              { int: '2498000000' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1eSmgHg4Xoy2RJy2owdjGsYzj5eKxaoKYr' },
              { int: '35524185304' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1ee26q3xzbsZF4AMkzysR8CxK8eZiLRzKF' },
              { int: '48718359' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'tz1i8p76UJXw2WJt2o2puAbrt2c36DohjuzW' },
              { int: '123799839' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT18oQnGxZNPST7GndCN1w5o3RjCKMPRuQYb' },
              { int: '0' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1BPE6waJrv3CagjRYwtfF3ZbE4nKxCa35Q' },
              { int: '79540178' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1BgkG1u8oQ5x1nySJq9TSExZYZvuUHxG4d' },
              { int: '94738111' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1CDEg2oY3VfMa1neB7hK5LoVMButvivKYv' },
              { int: '972668' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1CSecsvPEUbnjQ58UAStVvanN2CghEuDNr' },
              { int: '850791' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1ETj1iC48XWpa7fGhD9AAArZgLkgNrk35W' },
              { int: '6694159084' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1F7Gn9YupQLwU4qM8u9CgcRzBa3gDRd1e5' },
              { int: '2244700000' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1GtaRfTTHXTYVNGZFsZjoB9T2yn3bToZEs' },
              { int: '67923763011' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1GvYJfGNqrLtUCPc4JithuXco72sxa9Ewh' },
              { int: '6067881716' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1J7u8E5XDz5LWQTr1ZKY7coDYNMh2vwvwX' },
              { int: '702521' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1KRzRDQxbGZDobSCdyWCnB6nShX3MvFLAW' },
              { int: '47371547783' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1LuVQUALxtVMnNTa36SDVwtDmpNbosZEh8' },
              { int: '50694800896' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1NkYSVn7FqXGqyi9ruiqHS7mjUzDyv6fmc' },
              { int: '5938869113' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1QB4Tib11b8gYrC77Xs9bXU8TGJTXPAK7J' },
              { int: '60414680184' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1QX5woZXV5N6iqFFHkrgZrwH9uhh7Ma6qz' },
              { int: '3977008911' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1RJ2HjvmGcrDqpPoFwy6uVDk9uf71iv7dF' },
              { int: '11416957072' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1SE8DxcSsfA7upZtdpcZGGRRP3guqSk4nM' },
              { int: '2155481887' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1SGQmwvK5s49ovZLXxLbW8RzNB1vSbtE5b' },
              { int: '3902114120' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1VqoJ5jEAY1UEugRFiSTXhTVXAsj65tsUv' },
              { int: '8992531001' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1Vqq4nD2Mgwz4bYZVFbjKUESAmxrVFfRAr' },
              { int: '99496052' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1VvGrrdJmVTwRER39btAXC64b56sLqbXkY' },
              { int: '9879704715' }
            ]
          },
          {
            prim: 'Elt',
            args: [
              { string: 'KT1XBbG1xtdsSWDsy5dwqXpUQEEgLPm6RGRb' },
              { int: '482601406' }
            ]
          }
        ],
        {
          prim: 'Pair',
          args: [
            { string: 'Tez-Baking Token' },
            {
              prim: 'Pair',
              args: [
                { string: 'BAKER' },
                {
                  prim: 'Pair',
                  args: [
                    { int: '6' },
                    {
                      prim: 'Pair',
                      args: [
                        { int: '542476246169' },
                        {
                          prim: 'Pair',
                          args: [
                            { int: '570674096663' },
                            {
                              prim: 'Pair',
                              args: [
                                {
                                  string: 'tz1LBEKXaxQbd5Gtzbc1ATCwc3pppu81aWGc'
                                },
                                {
                                  prim: 'Pair',
                                  args: [{ int: '1062727' }, { int: '1062060' }]
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
      ]
    }
  },
  counter: '0'
};

export const storage = rpcContractResponse.script.code.find(
  x => x.prim === 'storage'
)!.args[0] as any;

export const params = rpcContractResponse.script.code.find(
  x => x.prim === 'parameter'
)!.args[0];