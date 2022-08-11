/* eslint-disable @typescript-eslint/no-non-null-assertion */
export const rpcContractResponse = {
  manager: 'tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD',
  balance: '0',
  spendable: false,
  delegate: { setable: false },
  script: {
    code: [
      {
        prim: 'parameter',
        args: [
          {
            prim: 'or',
            args: [
              {
                prim: 'pair',
                args: [{ prim: 'address' }, { prim: 'nat' }],
                annots: ['%_Liq_entry_transfer']
              },
              {
                prim: 'or',
                args: [
                  {
                    prim: 'pair',
                    args: [{ prim: 'address' }, { prim: 'nat' }],
                    annots: ['%_Liq_entry_approve']
                  },
                  {
                    prim: 'or',
                    args: [
                      {
                        prim: 'pair',
                        args: [
                          { prim: 'address' },
                          {
                            prim: 'pair',
                            args: [{ prim: 'address' }, { prim: 'nat' }]
                          }
                        ],
                        annots: ['%_Liq_entry_transferFrom']
                      },
                      {
                        prim: 'or',
                        args: [
                          {
                            prim: 'pair',
                            args: [
                              { prim: 'address' },
                              {
                                prim: 'contract',
                                args: [{ prim: 'nat' }],
                                annots: [':NatContract']
                              }
                            ],
                            annots: ['%_Liq_entry_balanceOf']
                          },
                          {
                            prim: 'or',
                            args: [
                              {
                                prim: 'pair',
                                args: [
                                  { prim: 'address' },
                                  {
                                    prim: 'pair',
                                    args: [
                                      { prim: 'address' },
                                      {
                                        prim: 'contract',
                                        args: [
                                          {
                                            prim: 'pair',
                                            args: [
                                              { prim: 'nat' },
                                              { prim: 'nat' }
                                            ]
                                          }
                                        ],
                                        annots: [':NatNatContract']
                                      }
                                    ]
                                  }
                                ],
                                annots: ['%_Liq_entry_allowance']
                              },
                              {
                                prim: 'or',
                                args: [
                                  {
                                    prim: 'pair',
                                    args: [
                                      { prim: 'address' },
                                      { prim: 'nat' }
                                    ],
                                    annots: ['%_Liq_entry_createAccount']
                                  },
                                  {
                                    prim: 'list',
                                    args: [
                                      {
                                        prim: 'pair',
                                        args: [
                                          { prim: 'address' },
                                          { prim: 'nat' }
                                        ]
                                      }
                                    ],
                                    annots: ['%_Liq_entry_createAccounts']
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
                prim: 'big_map',
                args: [
                  { prim: 'address' },
                  {
                    prim: 'pair',
                    args: [
                      { prim: 'nat', annots: ['%balance'] },
                      {
                        prim: 'map',
                        args: [{ prim: 'address' }, { prim: 'nat' }],
                        annots: ['%allowances']
                      }
                    ],
                    annots: [':account']
                  }
                ],
                annots: [':accounts']
              },
              {
                prim: 'pair',
                args: [
                  { prim: 'nat', annots: ['%version'] },
                  {
                    prim: 'pair',
                    args: [
                      { prim: 'nat', annots: ['%totalSupply'] },
                      {
                        prim: 'pair',
                        args: [
                          { prim: 'string', annots: ['%name'] },
                          {
                            prim: 'pair',
                            args: [
                              { prim: 'string', annots: ['%symbol'] },
                              { prim: 'address', annots: ['%owner'] }
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
            {
              prim: 'DIP',
              args: [[{ prim: 'CDR', annots: ['@storage_slash_1'] }]]
            },
            { prim: 'CAR', annots: ['@parameter_slash_2'] },
            {
              prim: 'LAMBDA',
              args: [
                {
                  prim: 'pair',
                  args: [
                    { prim: 'address' },
                    {
                      prim: 'big_map',
                      args: [
                        { prim: 'address' },
                        {
                          prim: 'pair',
                          args: [
                            { prim: 'nat', annots: ['%balance'] },
                            {
                              prim: 'map',
                              args: [{ prim: 'address' }, { prim: 'nat' }],
                              annots: ['%allowances']
                            }
                          ],
                          annots: [':account']
                        }
                      ]
                    }
                  ]
                },
                {
                  prim: 'pair',
                  args: [
                    { prim: 'nat', annots: ['%balance'] },
                    {
                      prim: 'map',
                      args: [{ prim: 'address' }, { prim: 'nat' }],
                      annots: ['%allowances']
                    }
                  ],
                  annots: [':account']
                },
                [
                  { prim: 'RENAME', annots: ['@_a_accounts_slash_3'] },
                  { prim: 'DUP' },
                  { prim: 'CDR', annots: ['@accounts'] },
                  [
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'CAR', annots: ['@a'] },
                  { prim: 'GET' },
                  {
                    prim: 'IF_NONE',
                    args: [
                      [
                        {
                          prim: 'PUSH',
                          args: [
                            {
                              prim: 'map',
                              args: [{ prim: 'address' }, { prim: 'nat' }]
                            },
                            []
                          ]
                        },
                        { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
                        { prim: 'PAIR', annots: ['%balance', '%allowances'] }
                      ],
                      []
                    ]
                  },
                  { prim: 'DIP', args: [[{ prim: 'DROP' }]] }
                ]
              ],
              annots: ['@get_account']
            },
            { prim: 'DUP', annots: ['@get_account'] },
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
                        {
                          prim: 'pair',
                          args: [
                            { prim: 'address' },
                            {
                              prim: 'pair',
                              args: [
                                { prim: 'nat' },
                                {
                                  prim: 'pair',
                                  args: [
                                    {
                                      prim: 'big_map',
                                      args: [
                                        { prim: 'address' },
                                        {
                                          prim: 'pair',
                                          args: [
                                            {
                                              prim: 'nat',
                                              annots: ['%balance']
                                            },
                                            {
                                              prim: 'map',
                                              args: [
                                                { prim: 'address' },
                                                { prim: 'nat' }
                                              ],
                                              annots: ['%allowances']
                                            }
                                          ],
                                          annots: [':account']
                                        }
                                      ],
                                      annots: [':accounts']
                                    },
                                    {
                                      prim: 'pair',
                                      args: [
                                        { prim: 'nat', annots: ['%version'] },
                                        {
                                          prim: 'pair',
                                          args: [
                                            {
                                              prim: 'nat',
                                              annots: ['%totalSupply']
                                            },
                                            {
                                              prim: 'pair',
                                              args: [
                                                {
                                                  prim: 'string',
                                                  annots: ['%name']
                                                },
                                                {
                                                  prim: 'pair',
                                                  args: [
                                                    {
                                                      prim: 'string',
                                                      annots: ['%symbol']
                                                    },
                                                    {
                                                      prim: 'address',
                                                      annots: ['%owner']
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
                            }
                          ]
                        }
                      ]
                    },
                    {
                      prim: 'lambda',
                      args: [
                        {
                          prim: 'pair',
                          args: [
                            { prim: 'address' },
                            {
                              prim: 'big_map',
                              args: [
                                { prim: 'address' },
                                {
                                  prim: 'pair',
                                  args: [
                                    { prim: 'nat', annots: ['%balance'] },
                                    {
                                      prim: 'map',
                                      args: [
                                        { prim: 'address' },
                                        { prim: 'nat' }
                                      ],
                                      annots: ['%allowances']
                                    }
                                  ],
                                  annots: [':account']
                                }
                              ]
                            }
                          ]
                        },
                        {
                          prim: 'pair',
                          args: [
                            { prim: 'nat', annots: ['%balance'] },
                            {
                              prim: 'map',
                              args: [{ prim: 'address' }, { prim: 'nat' }],
                              annots: ['%allowances']
                            }
                          ],
                          annots: [':account']
                        }
                      ]
                    }
                  ]
                },
                {
                  prim: 'pair',
                  args: [
                    { prim: 'list', args: [{ prim: 'operation' }] },
                    {
                      prim: 'pair',
                      args: [
                        {
                          prim: 'big_map',
                          args: [
                            { prim: 'address' },
                            {
                              prim: 'pair',
                              args: [
                                { prim: 'nat', annots: ['%balance'] },
                                {
                                  prim: 'map',
                                  args: [{ prim: 'address' }, { prim: 'nat' }],
                                  annots: ['%allowances']
                                }
                              ],
                              annots: [':account']
                            }
                          ],
                          annots: [':accounts']
                        },
                        {
                          prim: 'pair',
                          args: [
                            { prim: 'nat', annots: ['%version'] },
                            {
                              prim: 'pair',
                              args: [
                                { prim: 'nat', annots: ['%totalSupply'] },
                                {
                                  prim: 'pair',
                                  args: [
                                    { prim: 'string', annots: ['%name'] },
                                    {
                                      prim: 'pair',
                                      args: [
                                        { prim: 'string', annots: ['%symbol'] },
                                        { prim: 'address', annots: ['%owner'] }
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
                [
                  {
                    prim: 'RENAME',
                    annots: ['@_from_dest_tokens_storage__get_account_slash_8']
                  },
                  { prim: 'DUP' },
                  { prim: 'CAR' },
                  { prim: 'CAR', annots: ['@from'] },
                  [
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'CAR' },
                  [{ prim: 'CDR' }, { prim: 'CAR', annots: ['@dest'] }],
                  [
                    {
                      prim: 'DIP',
                      args: [
                        [
                          [
                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                            { prim: 'SWAP' }
                          ]
                        ]
                      ]
                    },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'CAR' },
                  [
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'CAR', annots: ['@tokens'] }
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
                                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
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
                  { prim: 'CAR' },
                  [
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'CDR', annots: ['@storage'] }
                  ],
                  { prim: 'DUP', annots: ['@storage'] },
                  { prim: 'CAR', annots: ['@accounts', '%accounts'] },
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
                                                      args: [[{ prim: 'DUP' }]]
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
                  { prim: 'CDR', annots: ['@get_account_slash_7'] },
                  [
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DUP', annots: ['@accounts'] }]]
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
                                                              prim: 'DIP',
                                                              args: [
                                                                [
                                                                  {
                                                                    prim: 'DUP',
                                                                    annots: [
                                                                      '@from'
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
                          ]
                        ]
                      ]
                    },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'PAIR' },
                  { prim: 'EXEC', annots: ['@account_sender'] },
                  [
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DUP', annots: ['@accounts'] }]]
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
                                [{ prim: 'DUP', annots: ['@account_sender'] }]
                              ]
                            },
                            { prim: 'SWAP' }
                          ]
                        ]
                      ]
                    },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'CAR', annots: ['%balance'] },
                  { prim: 'SUB' },
                  { prim: 'ISNAT' },
                  {
                    prim: 'IF_NONE',
                    args: [
                      [
                        [
                          {
                            prim: 'DIP',
                            args: [
                              [{ prim: 'DUP', annots: ['@account_sender'] }]
                            ]
                          },
                          { prim: 'SWAP' }
                        ],
                        { prim: 'CAR', annots: ['%balance'] },
                        {
                          prim: 'PUSH',
                          args: [
                            { prim: 'string' },
                            { string: 'Not enough tokens for transfer' }
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
                                        {
                                          prim: 'DUP',
                                          annots: ['@account_sender']
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
                        { prim: 'CDR', annots: ['%allowances'] },
                        { prim: 'SWAP' },
                        { prim: 'PAIR', annots: ['%balance', '%allowances'] }
                      ]
                    ]
                  },
                  { prim: 'RENAME', annots: ['@new_account_sender'] },
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
                                                                              '@from'
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
                          ]
                        ]
                      ]
                    },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'DIP', args: [[{ prim: 'SOME' }]] },
                  { prim: 'UPDATE', annots: ['@accounts'] },
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
                  { prim: 'CDR', annots: ['@get_account_slash_7'] },
                  [
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DUP', annots: ['@accounts'] }]]
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
                                                                              '@dest'
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
                          ]
                        ]
                      ]
                    },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'PAIR' },
                  { prim: 'EXEC', annots: ['@account_dest'] },
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
                  { prim: 'CDR' },
                  [
                    {
                      prim: 'DIP',
                      args: [
                        [
                          [
                            {
                              prim: 'DIP',
                              args: [[{ prim: 'DUP', annots: ['@accounts'] }]]
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
                                [{ prim: 'DUP', annots: ['@account_dest'] }]
                              ]
                            },
                            { prim: 'SWAP' }
                          ]
                        ]
                      ]
                    },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'CDR', annots: ['%allowances'] },
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
                                                                                      '@tokens'
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
                                                  {
                                                    prim: 'DUP',
                                                    annots: ['@account_dest']
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
                  { prim: 'CAR', annots: ['%balance'] },
                  { prim: 'ADD' },
                  {
                    prim: 'PAIR',
                    annots: ['@new_account_dest', '%balance', '%allowances']
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
                                                                                          {
                                                                                            prim:
                                                                                              'DUP',
                                                                                            annots: [
                                                                                              '@dest'
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
                                          { prim: 'DROP' },
                                          { prim: 'DROP' },
                                          { prim: 'DROP' },
                                          { prim: 'DROP' },
                                          { prim: 'DROP' },
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
                  },
                  { prim: 'UPDATE', annots: ['@accounts'] },
                  { prim: 'PAIR', annots: ['%accounts'] },
                  { prim: 'NIL', args: [{ prim: 'operation' }] },
                  { prim: 'PAIR' }
                ]
              ]
            },
            { prim: 'PAIR', annots: ['@perform_transfer__2_'] },
            [
              {
                prim: 'DIP',
                args: [
                  [
                    [
                      {
                        prim: 'DIP',
                        args: [[{ prim: 'DUP', annots: ['@parameter'] }]]
                      },
                      { prim: 'SWAP' }
                    ]
                  ]
                ]
              },
              { prim: 'SWAP' }
            ],
            {
              prim: 'IF_LEFT',
              args: [
                [
                  { prim: 'RENAME', annots: ['@_dest_tokens_slash_23'] },
                  [
                    {
                      prim: 'DIP',
                      args: [
                        [{ prim: 'DUP', annots: ['@perform_transfer__2_'] }]
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
                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                            { prim: 'SWAP' }
                          ]
                        ]
                      ]
                    },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'CDR', annots: ['@tokens'] },
                  { prim: 'PAIR' },
                  [
                    {
                      prim: 'DIP',
                      args: [
                        [
                          [
                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                            { prim: 'SWAP' }
                          ]
                        ]
                      ]
                    },
                    { prim: 'SWAP' }
                  ],
                  { prim: 'CAR', annots: ['@dest'] },
                  { prim: 'PAIR' },
                  { prim: 'SENDER' },
                  { prim: 'PAIR' },
                  {
                    prim: 'DIP',
                    args: [
                      [
                        { prim: 'DUP' },
                        { prim: 'CAR' },
                        { prim: 'SWAP' },
                        { prim: 'CDR' }
                      ]
                    ]
                  },
                  {
                    prim: 'DIP',
                    args: [
                      [
                        {
                          prim: 'DIP',
                          args: [[{ prim: 'DIP', args: [[{ prim: 'DROP' }]] }]]
                        }
                      ]
                    ]
                  },
                  { prim: 'PAIR' },
                  { prim: 'EXEC' }
                ],
                [
                  {
                    prim: 'IF_LEFT',
                    args: [
                      [
                        {
                          prim: 'RENAME',
                          annots: ['@_spender_tokens_slash_27']
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
                          { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                          { prim: 'SWAP' }
                        ],
                        { prim: 'CAR', annots: ['@spender'] },
                        [
                          {
                            prim: 'DIP',
                            args: [
                              [
                                [
                                  { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                  { prim: 'SWAP' }
                                ]
                              ]
                            ]
                          },
                          { prim: 'SWAP' }
                        ],
                        { prim: 'CDR', annots: ['@tokens'] },
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
                                                                  prim: 'DUP',
                                                                  annots: [
                                                                    '@get_account'
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
                                ]
                              ]
                            ]
                          },
                          { prim: 'SWAP' }
                        ],
                        { prim: 'CAR', annots: ['%accounts'] },
                        { prim: 'SENDER' },
                        { prim: 'PAIR' },
                        { prim: 'EXEC', annots: ['@account_sender'] },
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
                                ]
                              ]
                            ]
                          },
                          { prim: 'SWAP' }
                        ],
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
                        { prim: 'CAR', annots: ['%accounts'] },
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
                                          annots: ['@account_sender']
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
                        { prim: 'CAR', annots: ['%balance'] },
                        { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
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
                                                                  prim: 'DUP',
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
                        { prim: 'COMPARE' },
                        { prim: 'EQ' },
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
                                                          '@account_sender'
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
                              ],
                              { prim: 'CDR', annots: ['%allowances'] },
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
                                                                                  '@spender'
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
                              {
                                prim: 'DIP',
                                args: [
                                  [{ prim: 'NONE', args: [{ prim: 'nat' }] }]
                                ]
                              },
                              { prim: 'UPDATE' }
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
                                                      {
                                                        prim: 'DUP',
                                                        annots: [
                                                          '@account_sender'
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
                              ],
                              { prim: 'CDR', annots: ['%allowances'] },
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
                                                                                      {
                                                                                        prim:
                                                                                          'DUP',
                                                                                        annots: [
                                                                                          '@spender'
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
                              { prim: 'UPDATE' }
                            ]
                          ]
                        },
                        { prim: 'SWAP' },
                        {
                          prim: 'PAIR',
                          annots: ['@account_sender', '%balance', '%allowances']
                        },
                        { prim: 'SENDER' },
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
                                                { prim: 'DROP' },
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
                        },
                        { prim: 'UPDATE' },
                        { prim: 'PAIR', annots: ['@storage', '%accounts'] },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'PAIR' }
                      ],
                      [
                        {
                          prim: 'IF_LEFT',
                          args: [
                            [
                              {
                                prim: 'RENAME',
                                annots: ['@_from_dest_tokens_slash_34']
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
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              {
                                                                prim: 'DUP',
                                                                annots: [
                                                                  '@storage'
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
                              [
                                { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                { prim: 'SWAP' }
                              ],
                              { prim: 'CAR', annots: ['@from'] },
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [[{ prim: 'DUP' }]]
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
                                { prim: 'CDR', annots: ['@tokens'] }
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
                                                                      {
                                                                        prim:
                                                                          'DUP',
                                                                        annots: [
                                                                          '@get_account'
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
                                      ]
                                    ]
                                  ]
                                },
                                { prim: 'SWAP' }
                              ],
                              { prim: 'CAR', annots: ['%accounts'] },
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
                                                        annots: ['@from']
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
                              { prim: 'PAIR' },
                              { prim: 'EXEC', annots: ['@account_from'] },
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
                                                                          '@perform_transfer__2_'
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
                                                              {
                                                                prim: 'DUP',
                                                                annots: [
                                                                  '@storage'
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
                                                                          '@storage'
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
                              { prim: 'CAR', annots: ['%accounts'] },
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
                                                          '@account_from'
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
                              ],
                              { prim: 'CAR', annots: ['%balance'] },
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
                                                                  '@account_from'
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
                              { prim: 'CDR', annots: ['%allowances'] },
                              { prim: 'SENDER' },
                              { prim: 'GET' },
                              {
                                prim: 'IF_NONE',
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
                                                                                    {
                                                                                      prim:
                                                                                        'DUP',
                                                                                      annots: [
                                                                                        '@from'
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
                                      prim: 'PUSH',
                                      args: [
                                        { prim: 'string' },
                                        { string: 'Not allowed to spend from' }
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
                                                                                        '@tokens'
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
                                            {
                                              prim: 'DUP',
                                              annots: ['@allowed']
                                            }
                                          ]
                                        ]
                                      },
                                      { prim: 'SWAP' }
                                    ],
                                    { prim: 'SUB' },
                                    { prim: 'ISNAT' },
                                    {
                                      prim: 'IF_NONE',
                                      args: [
                                        [
                                          { prim: 'DUP', annots: ['@allowed'] },
                                          {
                                            prim: 'PUSH',
                                            args: [
                                              { prim: 'string' },
                                              {
                                                string:
                                                  'Not enough allowance for transfer'
                                              }
                                            ]
                                          },
                                          { prim: 'PAIR' },
                                          { prim: 'FAILWITH' }
                                        ],
                                        [
                                          {
                                            prim: 'PUSH',
                                            args: [
                                              { prim: 'nat' },
                                              { int: '0' }
                                            ]
                                          },
                                          [
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  {
                                                    prim: 'DUP',
                                                    annots: ['@allowed']
                                                  }
                                                ]
                                              ]
                                            },
                                            { prim: 'SWAP' }
                                          ],
                                          { prim: 'COMPARE' },
                                          { prim: 'EQ' },
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
                                                                                                {
                                                                                                  prim:
                                                                                                    'DUP',
                                                                                                  annots: [
                                                                                                    '@account_from'
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
                                                {
                                                  prim: 'CDR',
                                                  annots: ['%allowances']
                                                },
                                                { prim: 'SENDER' },
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      {
                                                        prim: 'NONE',
                                                        args: [{ prim: 'nat' }]
                                                      }
                                                    ]
                                                  ]
                                                },
                                                { prim: 'UPDATE' }
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
                                                                                                    '@account_from'
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
                                                {
                                                  prim: 'CDR',
                                                  annots: ['%allowances']
                                                },
                                                [
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        {
                                                          prim: 'DUP',
                                                          annots: ['@allowed']
                                                        }
                                                      ]
                                                    ]
                                                  },
                                                  { prim: 'SWAP' }
                                                ],
                                                { prim: 'SENDER' },
                                                {
                                                  prim: 'DIP',
                                                  args: [[{ prim: 'SOME' }]]
                                                },
                                                { prim: 'UPDATE' }
                                              ]
                                            ]
                                          },
                                          {
                                            prim: 'DIP',
                                            args: [[{ prim: 'DROP' }]]
                                          }
                                        ]
                                      ]
                                    },
                                    { prim: 'DIP', args: [[{ prim: 'DROP' }]] }
                                  ]
                                ]
                              },
                              {
                                prim: 'RENAME',
                                annots: ['@new_allowances_from']
                              },
                              { prim: 'SWAP' },
                              {
                                prim: 'PAIR',
                                annots: [
                                  '@account_from',
                                  '%balance',
                                  '%allowances'
                                ]
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
                                                                                  '@from'
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
                              { prim: 'DIP', args: [[{ prim: 'SOME' }]] },
                              { prim: 'UPDATE' },
                              {
                                prim: 'PAIR',
                                annots: ['@storage', '%accounts']
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
                              { prim: 'PAIR' },
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
                                { prim: 'CAR', annots: ['@dest'] }
                              ],
                              { prim: 'PAIR' },
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
                                                                  '@from'
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
                              { prim: 'PAIR' },
                              {
                                prim: 'DIP',
                                args: [
                                  [
                                    { prim: 'DUP' },
                                    { prim: 'CAR' },
                                    { prim: 'SWAP' },
                                    { prim: 'CDR' }
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
                                            prim: 'DIP',
                                            args: [
                                              [
                                                { prim: 'DROP' },
                                                { prim: 'DROP' },
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
                              },
                              { prim: 'PAIR' },
                              { prim: 'EXEC' }
                            ],
                            [
                              {
                                prim: 'IF_LEFT',
                                args: [
                                  [
                                    {
                                      prim: 'RENAME',
                                      annots: ['@_spender_forward_slash_45']
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
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    {
                                                                      prim:
                                                                        'DUP',
                                                                      annots: [
                                                                        '@storage'
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
                                    { prim: 'DUP', annots: ['@storage'] },
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
                                                    [
                                                      {
                                                        prim: 'DIP',
                                                        args: [
                                                          [{ prim: 'DUP' }]
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
                                    { prim: 'CDR', annots: ['@forward'] },
                                    {
                                      prim: 'PUSH',
                                      args: [{ prim: 'mutez' }, { int: '0' }]
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
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    {
                                                                      prim:
                                                                        'DUP',
                                                                      annots: [
                                                                        '@storage'
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
                                    { prim: 'CAR', annots: ['%accounts'] },
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
                                    { prim: 'CAR', annots: ['@spender'] },
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
                                        [{ prim: 'CAR', annots: ['%balance'] }]
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
                                                                    prim: 'DROP'
                                                                  },
                                                                  {
                                                                    prim: 'DROP'
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
                                          }
                                        ]
                                      ]
                                    },
                                    {
                                      prim: 'RENAME',
                                      annots: ['@spender_balance']
                                    },
                                    { prim: 'TRANSFER_TOKENS' },
                                    { prim: 'CONS' },
                                    { prim: 'PAIR' }
                                  ],
                                  [
                                    {
                                      prim: 'IF_LEFT',
                                      args: [
                                        [
                                          {
                                            prim: 'RENAME',
                                            annots: [
                                              '@_from_spender_forward_slash_51'
                                            ]
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
                                                                          {
                                                                            prim:
                                                                              'DUP',
                                                                            annots: [
                                                                              '@storage'
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
                                          ],
                                          { prim: 'DUP', annots: ['@storage'] },
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
                                                          [
                                                            {
                                                              prim: 'DIP',
                                                              args: [
                                                                [
                                                                  {
                                                                    prim: 'DUP'
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
                                            {
                                              prim: 'CDR',
                                              annots: ['@forward']
                                            }
                                          ],
                                          {
                                            prim: 'PUSH',
                                            args: [
                                              { prim: 'mutez' },
                                              { int: '0' }
                                            ]
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
                                                                          {
                                                                            prim:
                                                                              'DUP',
                                                                            annots: [
                                                                              '@storage'
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
                                          ],
                                          {
                                            prim: 'CAR',
                                            annots: ['%accounts']
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
                                          { prim: 'CAR', annots: ['@from'] },
                                          { prim: 'GET' },
                                          {
                                            prim: 'IF_NONE',
                                            args: [
                                              [
                                                {
                                                  prim: 'PUSH',
                                                  args: [
                                                    {
                                                      prim: 'pair',
                                                      args: [
                                                        { prim: 'nat' },
                                                        { prim: 'nat' }
                                                      ]
                                                    },
                                                    {
                                                      prim: 'Pair',
                                                      args: [
                                                        { int: '0' },
                                                        { int: '0' }
                                                      ]
                                                    }
                                                  ]
                                                }
                                              ],
                                              [
                                                {
                                                  prim: 'DUP',
                                                  annots: ['@account']
                                                },
                                                {
                                                  prim: 'CDR',
                                                  annots: ['%allowances']
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
                                                    prim: 'CAR',
                                                    annots: ['@spender']
                                                  }
                                                ],
                                                { prim: 'GET' },
                                                {
                                                  prim: 'IF_NONE',
                                                  args: [
                                                    [
                                                      {
                                                        prim: 'DUP',
                                                        annots: ['@account']
                                                      },
                                                      {
                                                        prim: 'CAR',
                                                        annots: ['%balance']
                                                      },
                                                      {
                                                        prim: 'PUSH',
                                                        args: [
                                                          { prim: 'nat' },
                                                          { int: '0' }
                                                        ]
                                                      },
                                                      { prim: 'PAIR' }
                                                    ],
                                                    [
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              {
                                                                prim: 'DUP',
                                                                annots: [
                                                                  '@account'
                                                                ]
                                                              }
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ],
                                                      {
                                                        prim: 'CAR',
                                                        annots: ['%balance']
                                                      },
                                                      { prim: 'SWAP' },
                                                      { prim: 'PAIR' }
                                                    ]
                                                  ]
                                                },
                                                {
                                                  prim: 'DIP',
                                                  args: [[{ prim: 'DROP' }]]
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
                                                                          prim:
                                                                            'DROP'
                                                                        },
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
                                                }
                                              ]
                                            ]
                                          },
                                          {
                                            prim: 'RENAME',
                                            annots: ['@spender_allowance']
                                          },
                                          { prim: 'TRANSFER_TOKENS' },
                                          { prim: 'CONS' },
                                          { prim: 'PAIR' }
                                        ],
                                        [
                                          {
                                            prim: 'IF_LEFT',
                                            args: [
                                              [
                                                {
                                                  prim: 'RENAME',
                                                  annots: [
                                                    '@_dest_tokens_slash_59'
                                                  ]
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
                                                                                {
                                                                                  prim:
                                                                                    'DUP',
                                                                                  annots: [
                                                                                    '@storage'
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
                                                {
                                                  prim: 'DUP',
                                                  annots: ['@storage']
                                                },
                                                [
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  {
                                                    prim: 'CDR',
                                                    annots: ['%owner']
                                                  }
                                                ],
                                                { prim: 'SENDER' },
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
                                                              'Only owner can create accounts'
                                                          }
                                                        ]
                                                      },
                                                      { prim: 'FAILWITH' }
                                                    ],
                                                    [{ prim: 'UNIT' }]
                                                  ]
                                                },
                                                { prim: 'DROP' },
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
                                                                    '@perform_transfer__2_'
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
                                                ],
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
                                                                        {
                                                                          prim:
                                                                            'DUP'
                                                                        }
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
                                                {
                                                  prim: 'CDR',
                                                  annots: ['@tokens']
                                                },
                                                { prim: 'PAIR' },
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
                                                                            'DUP'
                                                                        }
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
                                                {
                                                  prim: 'CAR',
                                                  annots: ['@dest']
                                                },
                                                { prim: 'PAIR' },
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
                                                                    '@storage'
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
                                                ],
                                                [
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  {
                                                    prim: 'CDR',
                                                    annots: ['%owner']
                                                  }
                                                ],
                                                { prim: 'PAIR' },
                                                {
                                                  prim: 'DIP',
                                                  args: [
                                                    [
                                                      { prim: 'DUP' },
                                                      { prim: 'CAR' },
                                                      { prim: 'SWAP' },
                                                      { prim: 'CDR' }
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
                                                              prim: 'DIP',
                                                              args: [
                                                                [
                                                                  {
                                                                    prim: 'DROP'
                                                                  },
                                                                  {
                                                                    prim: 'DROP'
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
                                                { prim: 'PAIR' },
                                                { prim: 'EXEC' }
                                              ],
                                              [
                                                {
                                                  prim: 'RENAME',
                                                  annots: [
                                                    '@new_accounts_slash_63'
                                                  ]
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
                                                                                {
                                                                                  prim:
                                                                                    'DUP',
                                                                                  annots: [
                                                                                    '@storage'
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
                                                {
                                                  prim: 'DUP',
                                                  annots: ['@storage']
                                                },
                                                [
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  {
                                                    prim: 'CDR',
                                                    annots: ['%owner']
                                                  }
                                                ],
                                                { prim: 'SENDER' },
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
                                                              'Only owner can create accounts'
                                                          }
                                                        ]
                                                      },
                                                      { prim: 'FAILWITH' }
                                                    ],
                                                    [{ prim: 'UNIT' }]
                                                  ]
                                                },
                                                { prim: 'DROP' },
                                                {
                                                  prim: 'DUP',
                                                  annots: ['@storage']
                                                },
                                                {
                                                  prim: 'NIL',
                                                  args: [{ prim: 'operation' }]
                                                },
                                                { prim: 'PAIR' },
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
                                                                    '@new_accounts'
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
                                                ],
                                                {
                                                  prim: 'ITER',
                                                  args: [
                                                    [
                                                      {
                                                        prim: 'RENAME',
                                                        annots: [
                                                          '@_dest_tokens__ops_storage_slash_65'
                                                        ]
                                                      },
                                                      {
                                                        prim: 'DIP',
                                                        args: [
                                                          [{ prim: 'DUP' }]
                                                        ]
                                                      },
                                                      { prim: 'PAIR' },
                                                      { prim: 'DUP' },
                                                      { prim: 'CDR' },
                                                      {
                                                        prim: 'CDR',
                                                        annots: ['@storage']
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
                                                                                              {
                                                                                                prim:
                                                                                                  'DUP',
                                                                                                annots: [
                                                                                                  '@perform_transfer__2_'
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
                                                              {
                                                                prim: 'DUP',
                                                                annots: [
                                                                  '@storage'
                                                                ]
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
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ],
                                                      { prim: 'CAR' },
                                                      {
                                                        prim: 'CDR',
                                                        annots: ['@tokens']
                                                      },
                                                      { prim: 'PAIR' },
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
                                                              ]
                                                            ]
                                                          ]
                                                        },
                                                        { prim: 'SWAP' }
                                                      ],
                                                      { prim: 'CAR' },
                                                      {
                                                        prim: 'CAR',
                                                        annots: ['@dest']
                                                      },
                                                      { prim: 'PAIR' },
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
                                                                          '@storage'
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
                                                      ],
                                                      [
                                                        { prim: 'CDR' },
                                                        { prim: 'CDR' },
                                                        { prim: 'CDR' },
                                                        { prim: 'CDR' },
                                                        {
                                                          prim: 'CDR',
                                                          annots: ['%owner']
                                                        }
                                                      ],
                                                      { prim: 'PAIR' },
                                                      {
                                                        prim: 'DIP',
                                                        args: [
                                                          [
                                                            { prim: 'DUP' },
                                                            { prim: 'CAR' },
                                                            { prim: 'SWAP' },
                                                            { prim: 'CDR' }
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
                                                                    prim: 'DIP',
                                                                    args: [
                                                                      [
                                                                        {
                                                                          prim:
                                                                            'DROP'
                                                                        },
                                                                        {
                                                                          prim:
                                                                            'DROP'
                                                                        },
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
                                                      },
                                                      { prim: 'PAIR' },
                                                      { prim: 'EXEC' }
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
                  { prim: 'DROP' },
                  { prim: 'DROP' }
                ]
              ]
            }
          ]
        ]
      }
    ],
    storage: {
      prim: 'Pair',
      args: [
        [],
        {
          prim: 'Pair',
          args: [
            { int: '1' },
            {
              prim: 'Pair',
              args: [
                { int: '1000' },
                {
                  prim: 'Pair',
                  args: [
                    { string: 'Token B' },
                    {
                      prim: 'Pair',
                      args: [
                        { string: 'B' },
                        { string: 'tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS' }
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

export const parameter = {
  prim: 'Right',
  args: [
    {
      prim: 'Left',
      args: [
        {
          prim: 'Pair',
          args: [
            { string: 'tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD' },
            { int: '60' }
          ]
        }
      ]
    }
  ]
};
export const storage = rpcContractResponse.script.code.find(
  x => x.prim === 'storage'
)!.args[0] as any;

export const bigMapDiff = [
  {
    key_hash: 'expruBGgmdtDn1qJCVYrfyAoyXboENZqaysqPQmYmSEcEaAu8Zd2R9',
    key: { bytes: '000041145574571df6030acad578fdc8d41c4979f0df' },
    value: {
      prim: 'Pair',
      args: [
        { int: '200' },
        [
          {
            prim: 'Elt',
            args: [
              { bytes: '0000d8aebdc7e7d86e00d26b5f9c038dd87b01631ba6' },
              { int: '60' }
            ]
          }
        ]
      ]
    }
  }
];

export const params = rpcContractResponse.script.code.find(
  x => x.prim === 'parameter'
)!.args[0] as any;

export const txParams = {
  prim: 'Right',
  args: [
    {
      prim: 'Left',
      args: [
        {
          prim: 'Pair',
          args: [
            { string: 'tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD' },
            { int: '60' }
          ]
        }
      ]
    }
  ]
};
