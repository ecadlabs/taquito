export const blockResponse = {
  protocol: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
  chain_id: 'NetXi2ZagzEsXbZ',
  hash: 'BM6NRnbjdWqknmErSjMmkh49NjaVqq64TNmKTsdQRaWke5iqHpz',
  header: {},
  metadata: {},
  operations: [
    [],
    [],
    [],
    [
      {
        protocol: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
        chain_id: 'NetXi2ZagzEsXbZ',
        hash: 'oot9JqetdfF5KtZS7VoepGvB18aQENcQVzJ3G7WsQnCfQo3wmms',
        branch: 'BKjC4cpfpHQhtMPRSzPcuNqshaHi3CouizZnNjDS4ei9cGFuwUj',
        contents: [
          {
            kind: 'reveal',
            source: 'tz29SSCBkTYXK4stSPosByHC4h26WDB3N11o',
            fee: '374',
            counter: '118358',
            gas_limit: '1100',
            storage_limit: '0',
            public_key: 'sppk7c5ZPpRTeMmf1XCZeZH8KezkqiYozouxjbk4c9ebYjkM4R5tki2',
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz29SSCBkTYXK4stSPosByHC4h26WDB3N11o',
                  change: '-374',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '374',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                consumed_milligas: '1000000',
              },
            },
          },
          {
            kind: 'origination',
            source: 'tz29SSCBkTYXK4stSPosByHC4h26WDB3N11o',
            fee: '5943',
            counter: '118359',
            gas_limit: '3156',
            storage_limit: '5591',
            balance: '1000000',
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
                          args: [
                            {
                              prim: 'address',
                              annots: [':from'],
                            },
                            {
                              prim: 'pair',
                              args: [
                                {
                                  prim: 'address',
                                  annots: [':to'],
                                },
                                {
                                  prim: 'nat',
                                  annots: [':value'],
                                },
                              ],
                            },
                          ],
                          annots: ['%transfer'],
                        },
                        {
                          prim: 'or',
                          args: [
                            {
                              prim: 'pair',
                              args: [
                                {
                                  prim: 'address',
                                  annots: [':spender'],
                                },
                                {
                                  prim: 'nat',
                                  annots: [':value'],
                                },
                              ],
                              annots: ['%approve'],
                            },
                            {
                              prim: 'or',
                              args: [
                                {
                                  prim: 'pair',
                                  args: [
                                    {
                                      prim: 'pair',
                                      args: [
                                        {
                                          prim: 'address',
                                          annots: [':owner'],
                                        },
                                        {
                                          prim: 'address',
                                          annots: [':spender'],
                                        },
                                      ],
                                    },
                                    {
                                      prim: 'contract',
                                      args: [
                                        {
                                          prim: 'nat',
                                          annots: [':remaining'],
                                        },
                                      ],
                                    },
                                  ],
                                  annots: ['%getAllowance'],
                                },
                                {
                                  prim: 'or',
                                  args: [
                                    {
                                      prim: 'pair',
                                      args: [
                                        {
                                          prim: 'address',
                                          annots: [':owner'],
                                        },
                                        {
                                          prim: 'contract',
                                          args: [
                                            {
                                              prim: 'nat',
                                              annots: [':balance'],
                                            },
                                          ],
                                        },
                                      ],
                                      annots: ['%getBalance'],
                                    },
                                    {
                                      prim: 'or',
                                      args: [
                                        {
                                          prim: 'pair',
                                          args: [
                                            {
                                              prim: 'unit',
                                            },
                                            {
                                              prim: 'contract',
                                              args: [
                                                {
                                                  prim: 'nat',
                                                  annots: [':totalSupply'],
                                                },
                                              ],
                                            },
                                          ],
                                          annots: ['%getTotalSupply'],
                                        },
                                        {
                                          prim: 'or',
                                          args: [
                                            {
                                              prim: 'bool',
                                              annots: ['%setPause'],
                                            },
                                            {
                                              prim: 'or',
                                              args: [
                                                {
                                                  prim: 'address',
                                                  annots: ['%setAdministrator'],
                                                },
                                                {
                                                  prim: 'or',
                                                  args: [
                                                    {
                                                      prim: 'pair',
                                                      args: [
                                                        {
                                                          prim: 'unit',
                                                        },
                                                        {
                                                          prim: 'contract',
                                                          args: [
                                                            {
                                                              prim: 'address',
                                                              annots: [':administrator'],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                      annots: ['%getAdministrator'],
                                                    },
                                                    {
                                                      prim: 'or',
                                                      args: [
                                                        {
                                                          prim: 'pair',
                                                          args: [
                                                            {
                                                              prim: 'address',
                                                              annots: [':to'],
                                                            },
                                                            {
                                                              prim: 'nat',
                                                              annots: [':value'],
                                                            },
                                                          ],
                                                          annots: ['%mint'],
                                                        },
                                                        {
                                                          prim: 'pair',
                                                          args: [
                                                            {
                                                              prim: 'address',
                                                              annots: [':from'],
                                                            },
                                                            {
                                                              prim: 'nat',
                                                              annots: [':value'],
                                                            },
                                                          ],
                                                          annots: ['%burn'],
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
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
                            {
                              prim: 'address',
                            },
                            {
                              prim: 'pair',
                              args: [
                                {
                                  prim: 'nat',
                                },
                                {
                                  prim: 'map',
                                  args: [
                                    {
                                      prim: 'address',
                                    },
                                    {
                                      prim: 'nat',
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                        {
                          prim: 'pair',
                          args: [
                            {
                              prim: 'address',
                            },
                            {
                              prim: 'pair',
                              args: [
                                {
                                  prim: 'bool',
                                },
                                {
                                  prim: 'nat',
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
                {
                  prim: 'code',
                  args: [
                    [
                      {
                        prim: 'DUP',
                      },
                      {
                        prim: 'CAR',
                      },
                      {
                        prim: 'DIP',
                        args: [
                          [
                            {
                              prim: 'CDR',
                            },
                          ],
                        ],
                      },
                      {
                        prim: 'IF_LEFT',
                        args: [
                          [
                            {
                              prim: 'DIP',
                              args: [
                                [
                                  {
                                    prim: 'DUP',
                                  },
                                  {
                                    prim: 'CDR',
                                  },
                                  {
                                    prim: 'CDR',
                                  },
                                  {
                                    prim: 'CAR',
                                  },
                                  {
                                    prim: 'IF',
                                    args: [
                                      [
                                        {
                                          prim: 'PUSH',
                                          args: [
                                            {
                                              prim: 'pair',
                                              args: [
                                                {
                                                  prim: 'string',
                                                },
                                                {
                                                  prim: 'unit',
                                                },
                                              ],
                                            },
                                            {
                                              prim: 'Pair',
                                              args: [
                                                {
                                                  string: 'OperationsArePaused',
                                                },
                                                {
                                                  prim: 'Unit',
                                                },
                                              ],
                                            },
                                          ],
                                        },
                                        {
                                          prim: 'FAILWITH',
                                        },
                                      ],
                                      [],
                                    ],
                                  },
                                ],
                              ],
                            },
                            {
                              prim: 'DUP',
                            },
                            {
                              prim: 'CDR',
                            },
                            {
                              prim: 'CAR',
                            },
                            {
                              prim: 'DIP',
                              args: [
                                [
                                  {
                                    prim: 'DUP',
                                  },
                                  {
                                    prim: 'CAR',
                                  },
                                ],
                              ],
                            },
                            {
                              prim: 'CAST',
                              args: [
                                {
                                  prim: 'address',
                                },
                              ],
                            },
                            {
                              prim: 'COMPARE',
                            },
                            {
                              prim: 'EQ',
                            },
                            {
                              prim: 'IF',
                              args: [
                                [
                                  {
                                    prim: 'DROP',
                                  },
                                ],
                                [
                                  {
                                    prim: 'DUP',
                                  },
                                  {
                                    prim: 'CAR',
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
                                                prim: 'DUP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SENDER',
                                  },
                                  {
                                    prim: 'COMPARE',
                                  },
                                  {
                                    prim: 'EQ',
                                  },
                                  {
                                    prim: 'IF',
                                    args: [
                                      [
                                        {
                                          prim: 'DROP',
                                        },
                                        {
                                          prim: 'PUSH',
                                          args: [
                                            {
                                              prim: 'bool',
                                            },
                                            {
                                              prim: 'False',
                                            },
                                          ],
                                        },
                                      ],
                                      [
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CAR',
                                        },
                                        {
                                          prim: 'SENDER',
                                        },
                                        {
                                          prim: 'COMPARE',
                                        },
                                        {
                                          prim: 'NEQ',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'IF',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
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
                                                            prim: 'DUP',
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                    {
                                                      prim: 'SENDER',
                                                    },
                                                    {
                                                      prim: 'PAIR',
                                                    },
                                                    {
                                                      prim: 'DUP',
                                                    },
                                                    {
                                                      prim: 'DIP',
                                                      args: [
                                                        [
                                                          {
                                                            prim: 'CDR',
                                                          },
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'CAR',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'GET',
                                                          },
                                                          {
                                                            prim: 'IF_NONE',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'EMPTY_MAP',
                                                                  args: [
                                                                    {
                                                                      prim: 'address',
                                                                    },
                                                                    {
                                                                      prim: 'nat',
                                                                    },
                                                                  ],
                                                                },
                                                              ],
                                                              [
                                                                {
                                                                  prim: 'CDR',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                    {
                                                      prim: 'GET',
                                                    },
                                                    {
                                                      prim: 'IF_NONE',
                                                      args: [
                                                        [
                                                          {
                                                            prim: 'PUSH',
                                                            args: [
                                                              {
                                                                prim: 'nat',
                                                              },
                                                              {
                                                                int: '0',
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                        [],
                                                      ],
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CAR',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'SENDER',
                                                    },
                                                    {
                                                      prim: 'DIP',
                                                      args: [
                                                        [
                                                          {
                                                            prim: 'DUP',
                                                          },
                                                          {
                                                            prim: 'CDR',
                                                          },
                                                          {
                                                            prim: 'CDR',
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
                                                                        prim: 'DUP',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'SWAP',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'SWAP',
                                                          },
                                                          {
                                                            prim: 'SUB',
                                                          },
                                                          {
                                                            prim: 'ISNAT',
                                                          },
                                                          {
                                                            prim: 'IF_NONE',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'DUP',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'SWAP',
                                                                },
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'DUP',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'SWAP',
                                                                },
                                                                {
                                                                  prim: 'CDR',
                                                                },
                                                                {
                                                                  prim: 'CDR',
                                                                },
                                                                {
                                                                  prim: 'PAIR',
                                                                },
                                                                {
                                                                  prim: 'PUSH',
                                                                  args: [
                                                                    {
                                                                      prim: 'string',
                                                                    },
                                                                    {
                                                                      string: 'NotEnoughAllowance',
                                                                    },
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'PAIR',
                                                                },
                                                                {
                                                                  prim: 'FAILWITH',
                                                                },
                                                              ],
                                                              [],
                                                            ],
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'PAIR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'PAIR',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DROP',
                                                    },
                                                    {
                                                      prim: 'DROP',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                    },
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'SWAP',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                    },
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'SWAP',
                                              },
                                              {
                                                prim: 'GET',
                                              },
                                              {
                                                prim: 'IF_NONE',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'PUSH',
                                                      args: [
                                                        {
                                                          prim: 'nat',
                                                        },
                                                        {
                                                          int: '0',
                                                        },
                                                      ],
                                                    },
                                                    {
                                                      prim: 'DIP',
                                                      args: [
                                                        [
                                                          {
                                                            prim: 'EMPTY_MAP',
                                                            args: [
                                                              {
                                                                prim: 'address',
                                                              },
                                                              {
                                                                prim: 'nat',
                                                              },
                                                            ],
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'PAIR',
                                                    },
                                                    {
                                                      prim: 'EMPTY_MAP',
                                                      args: [
                                                        {
                                                          prim: 'address',
                                                        },
                                                        {
                                                          prim: 'nat',
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                    },
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                  ],
                                                ],
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
                                                            prim: 'DUP',
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'SWAP',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'SWAP',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'INT',
                                              },
                                              {
                                                prim: 'EQ',
                                              },
                                              {
                                                prim: 'IF',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DROP',
                                                    },
                                                    {
                                                      prim: 'NONE',
                                                      args: [
                                                        {
                                                          prim: 'nat',
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                  [
                                                    {
                                                      prim: 'SOME',
                                                    },
                                                  ],
                                                ],
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
                                                                  prim: 'DUP',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'SWAP',
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'SWAP',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'SWAP',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                              {
                                                prim: 'CAR',
                                              },
                                              {
                                                prim: 'UPDATE',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                    },
                                                    {
                                                      prim: 'DIP',
                                                      args: [
                                                        [
                                                          {
                                                            prim: 'CAR',
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DROP',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'SWAP',
                                              },
                                              {
                                                prim: 'PAIR',
                                              },
                                              {
                                                prim: 'SOME',
                                              },
                                              {
                                                prim: 'SWAP',
                                              },
                                              {
                                                prim: 'CAR',
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
                                                            prim: 'DUP',
                                                          },
                                                          {
                                                            prim: 'CAR',
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'UPDATE',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                    },
                                                    {
                                                      prim: 'DIP',
                                                      args: [
                                                        [
                                                          {
                                                            prim: 'CDR',
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DROP',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'PAIR',
                                              },
                                            ],
                                          ],
                                        },
                                      ],
                                      [],
                                    ],
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'CAR',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'CDR',
                                  },
                                  {
                                    prim: 'CAR',
                                  },
                                  {
                                    prim: 'GET',
                                  },
                                  {
                                    prim: 'IF_NONE',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'INT',
                                        },
                                        {
                                          prim: 'EQ',
                                        },
                                        {
                                          prim: 'IF',
                                          args: [
                                            [
                                              {
                                                prim: 'NONE',
                                                args: [
                                                  {
                                                    prim: 'pair',
                                                    args: [
                                                      {
                                                        prim: 'nat',
                                                      },
                                                      {
                                                        prim: 'map',
                                                        args: [
                                                          {
                                                            prim: 'address',
                                                          },
                                                          {
                                                            prim: 'nat',
                                                          },
                                                        ],
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                            ],
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'EMPTY_MAP',
                                                      args: [
                                                        {
                                                          prim: 'address',
                                                        },
                                                        {
                                                          prim: 'nat',
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'PAIR',
                                              },
                                              {
                                                prim: 'SOME',
                                              },
                                            ],
                                          ],
                                        },
                                      ],
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CAR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'ADD',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'CAR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DROP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'SOME',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
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
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CAR',
                                              },
                                            ],
                                          ],
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'DUP',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CAR',
                                        },
                                        {
                                          prim: 'UPDATE',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'CAR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DROP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'DUP',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'INT',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'ADD',
                                        },
                                        {
                                          prim: 'ISNAT',
                                        },
                                        {
                                          prim: 'IF_NONE',
                                          args: [
                                            [
                                              {
                                                prim: 'PUSH',
                                                args: [
                                                  {
                                                    prim: 'string',
                                                  },
                                                  {
                                                    string:
                                                      'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger.hs:313:27 in lorentz-contracts-0.2.0.1-HpDIkWsKofu3zAjntLgs8J:Lorentz.Contracts.ManagedLedger',
                                                  },
                                                ],
                                              },
                                              {
                                                prim: 'FAILWITH',
                                              },
                                            ],
                                            [],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DROP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DROP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'CAR',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'CAR',
                                  },
                                  {
                                    prim: 'GET',
                                  },
                                  {
                                    prim: 'IF_NONE',
                                    args: [
                                      [
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'PUSH',
                                          args: [
                                            {
                                              prim: 'nat',
                                            },
                                            {
                                              int: '0',
                                            },
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'PUSH',
                                          args: [
                                            {
                                              prim: 'string',
                                            },
                                            {
                                              string: 'NotEnoughBalance',
                                            },
                                          ],
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'FAILWITH',
                                        },
                                      ],
                                      [],
                                    ],
                                  },
                                  {
                                    prim: 'DUP',
                                  },
                                  {
                                    prim: 'CAR',
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
                                                prim: 'DUP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'CDR',
                                  },
                                  {
                                    prim: 'CDR',
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'SUB',
                                  },
                                  {
                                    prim: 'ISNAT',
                                  },
                                  {
                                    prim: 'IF_NONE',
                                    args: [
                                      [
                                        {
                                          prim: 'CAR',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'PUSH',
                                          args: [
                                            {
                                              prim: 'string',
                                            },
                                            {
                                              string: 'NotEnoughBalance',
                                            },
                                          ],
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'FAILWITH',
                                        },
                                      ],
                                      [],
                                    ],
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'CAR',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DROP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'PAIR',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'CAR',
                                        },
                                        {
                                          prim: 'INT',
                                        },
                                        {
                                          prim: 'EQ',
                                        },
                                        {
                                          prim: 'IF',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                              {
                                                prim: 'SIZE',
                                              },
                                              {
                                                prim: 'INT',
                                              },
                                              {
                                                prim: 'EQ',
                                              },
                                              {
                                                prim: 'IF',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DROP',
                                                    },
                                                    {
                                                      prim: 'NONE',
                                                      args: [
                                                        {
                                                          prim: 'pair',
                                                          args: [
                                                            {
                                                              prim: 'nat',
                                                            },
                                                            {
                                                              prim: 'map',
                                                              args: [
                                                                {
                                                                  prim: 'address',
                                                                },
                                                                {
                                                                  prim: 'nat',
                                                                },
                                                              ],
                                                            },
                                                          ],
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                  [
                                                    {
                                                      prim: 'SOME',
                                                    },
                                                  ],
                                                ],
                                              },
                                            ],
                                            [
                                              {
                                                prim: 'SOME',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'CAR',
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
                                                      prim: 'DUP',
                                                    },
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'UPDATE',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'CAR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DROP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'DUP',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'NEG',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'ADD',
                                        },
                                        {
                                          prim: 'ISNAT',
                                        },
                                        {
                                          prim: 'IF_NONE',
                                          args: [
                                            [
                                              {
                                                prim: 'PUSH',
                                                args: [
                                                  {
                                                    prim: 'string',
                                                  },
                                                  {
                                                    string:
                                                      'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger.hs:313:27 in lorentz-contracts-0.2.0.1-HpDIkWsKofu3zAjntLgs8J:Lorentz.Contracts.ManagedLedger',
                                                  },
                                                ],
                                              },
                                              {
                                                prim: 'FAILWITH',
                                              },
                                            ],
                                            [],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DROP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DROP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'DROP',
                                  },
                                ],
                              ],
                            },
                            {
                              prim: 'NIL',
                              args: [
                                {
                                  prim: 'operation',
                                },
                              ],
                            },
                            {
                              prim: 'PAIR',
                            },
                          ],
                          [
                            {
                              prim: 'IF_LEFT',
                              args: [
                                [
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CAR',
                                        },
                                        {
                                          prim: 'IF',
                                          args: [
                                            [
                                              {
                                                prim: 'PUSH',
                                                args: [
                                                  {
                                                    prim: 'pair',
                                                    args: [
                                                      {
                                                        prim: 'string',
                                                      },
                                                      {
                                                        prim: 'unit',
                                                      },
                                                    ],
                                                  },
                                                  {
                                                    prim: 'Pair',
                                                    args: [
                                                      {
                                                        string: 'OperationsArePaused',
                                                      },
                                                      {
                                                        prim: 'Unit',
                                                      },
                                                    ],
                                                  },
                                                ],
                                              },
                                              {
                                                prim: 'FAILWITH',
                                              },
                                            ],
                                            [],
                                          ],
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SENDER',
                                  },
                                  {
                                    prim: 'PAIR',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'DUP',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'CAR',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'CAR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'GET',
                                        },
                                        {
                                          prim: 'IF_NONE',
                                          args: [
                                            [
                                              {
                                                prim: 'EMPTY_MAP',
                                                args: [
                                                  {
                                                    prim: 'address',
                                                  },
                                                  {
                                                    prim: 'nat',
                                                  },
                                                ],
                                              },
                                            ],
                                            [
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'CDR',
                                  },
                                  {
                                    prim: 'CAR',
                                  },
                                  {
                                    prim: 'GET',
                                  },
                                  {
                                    prim: 'IF_NONE',
                                    args: [
                                      [
                                        {
                                          prim: 'PUSH',
                                          args: [
                                            {
                                              prim: 'nat',
                                            },
                                            {
                                              int: '0',
                                            },
                                          ],
                                        },
                                      ],
                                      [],
                                    ],
                                  },
                                  {
                                    prim: 'DUP',
                                  },
                                  {
                                    prim: 'INT',
                                  },
                                  {
                                    prim: 'EQ',
                                  },
                                  {
                                    prim: 'IF',
                                    args: [
                                      [
                                        {
                                          prim: 'DROP',
                                        },
                                      ],
                                      [
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'INT',
                                        },
                                        {
                                          prim: 'EQ',
                                        },
                                        {
                                          prim: 'IF',
                                          args: [
                                            [
                                              {
                                                prim: 'DROP',
                                              },
                                            ],
                                            [
                                              {
                                                prim: 'PUSH',
                                                args: [
                                                  {
                                                    prim: 'string',
                                                  },
                                                  {
                                                    string: 'UnsafeAllowanceChange',
                                                  },
                                                ],
                                              },
                                              {
                                                prim: 'PAIR',
                                              },
                                              {
                                                prim: 'FAILWITH',
                                              },
                                            ],
                                          ],
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'CAR',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'CAR',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'GET',
                                  },
                                  {
                                    prim: 'IF_NONE',
                                    args: [
                                      [
                                        {
                                          prim: 'PUSH',
                                          args: [
                                            {
                                              prim: 'nat',
                                            },
                                            {
                                              int: '0',
                                            },
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'EMPTY_MAP',
                                                args: [
                                                  {
                                                    prim: 'address',
                                                  },
                                                  {
                                                    prim: 'nat',
                                                  },
                                                ],
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'EMPTY_MAP',
                                          args: [
                                            {
                                              prim: 'address',
                                            },
                                            {
                                              prim: 'nat',
                                            },
                                          ],
                                        },
                                      ],
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                      ],
                                    ],
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
                                                prim: 'DUP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'CDR',
                                  },
                                  {
                                    prim: 'CDR',
                                  },
                                  {
                                    prim: 'DUP',
                                  },
                                  {
                                    prim: 'INT',
                                  },
                                  {
                                    prim: 'EQ',
                                  },
                                  {
                                    prim: 'IF',
                                    args: [
                                      [
                                        {
                                          prim: 'DROP',
                                        },
                                        {
                                          prim: 'NONE',
                                          args: [
                                            {
                                              prim: 'nat',
                                            },
                                          ],
                                        },
                                      ],
                                      [
                                        {
                                          prim: 'SOME',
                                        },
                                      ],
                                    ],
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
                                                      prim: 'DUP',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'SWAP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'CDR',
                                  },
                                  {
                                    prim: 'CAR',
                                  },
                                  {
                                    prim: 'UPDATE',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'CAR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DROP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'PAIR',
                                  },
                                  {
                                    prim: 'SOME',
                                  },
                                  {
                                    prim: 'SWAP',
                                  },
                                  {
                                    prim: 'CAR',
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
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CAR',
                                              },
                                            ],
                                          ],
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'UPDATE',
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'CAR',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        {
                                          prim: 'DROP',
                                        },
                                      ],
                                    ],
                                  },
                                  {
                                    prim: 'PAIR',
                                  },
                                  {
                                    prim: 'NIL',
                                    args: [
                                      {
                                        prim: 'operation',
                                      },
                                    ],
                                  },
                                  {
                                    prim: 'PAIR',
                                  },
                                ],
                                [
                                  {
                                    prim: 'IF_LEFT',
                                    args: [
                                      [
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'CAR',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
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
                                                      prim: 'DUP',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'SWAP',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'CAR',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'CDR',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'DUP',
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'CAR',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'GET',
                                              },
                                              {
                                                prim: 'IF_NONE',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'EMPTY_MAP',
                                                      args: [
                                                        {
                                                          prim: 'address',
                                                        },
                                                        {
                                                          prim: 'nat',
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                  [
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                  ],
                                                ],
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'CDR',
                                        },
                                        {
                                          prim: 'GET',
                                        },
                                        {
                                          prim: 'IF_NONE',
                                          args: [
                                            [
                                              {
                                                prim: 'PUSH',
                                                args: [
                                                  {
                                                    prim: 'nat',
                                                  },
                                                  {
                                                    int: '0',
                                                  },
                                                ],
                                              },
                                            ],
                                            [],
                                          ],
                                        },
                                        {
                                          prim: 'DIP',
                                          args: [
                                            [
                                              {
                                                prim: 'AMOUNT',
                                              },
                                            ],
                                          ],
                                        },
                                        {
                                          prim: 'TRANSFER_TOKENS',
                                        },
                                        {
                                          prim: 'NIL',
                                          args: [
                                            {
                                              prim: 'operation',
                                            },
                                          ],
                                        },
                                        {
                                          prim: 'SWAP',
                                        },
                                        {
                                          prim: 'CONS',
                                        },
                                        {
                                          prim: 'PAIR',
                                        },
                                      ],
                                      [
                                        {
                                          prim: 'IF_LEFT',
                                          args: [
                                            [
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CAR',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                  ],
                                                ],
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
                                                            prim: 'DUP',
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'SWAP',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'PAIR',
                                              },
                                              {
                                                prim: 'DUP',
                                              },
                                              {
                                                prim: 'CAR',
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'GET',
                                              },
                                              {
                                                prim: 'IF_NONE',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'PUSH',
                                                      args: [
                                                        {
                                                          prim: 'nat',
                                                        },
                                                        {
                                                          int: '0',
                                                        },
                                                      ],
                                                    },
                                                  ],
                                                  [
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'DIP',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'AMOUNT',
                                                    },
                                                  ],
                                                ],
                                              },
                                              {
                                                prim: 'TRANSFER_TOKENS',
                                              },
                                              {
                                                prim: 'NIL',
                                                args: [
                                                  {
                                                    prim: 'operation',
                                                  },
                                                ],
                                              },
                                              {
                                                prim: 'SWAP',
                                              },
                                              {
                                                prim: 'CONS',
                                              },
                                              {
                                                prim: 'PAIR',
                                              },
                                            ],
                                            [
                                              {
                                                prim: 'IF_LEFT',
                                                args: [
                                                  [
                                                    {
                                                      prim: 'DUP',
                                                    },
                                                    {
                                                      prim: 'CAR',
                                                    },
                                                    {
                                                      prim: 'DIP',
                                                      args: [
                                                        [
                                                          {
                                                            prim: 'CDR',
                                                          },
                                                        ],
                                                      ],
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
                                                                  prim: 'DUP',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'SWAP',
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'PAIR',
                                                    },
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                    {
                                                      prim: 'CDR',
                                                    },
                                                    {
                                                      prim: 'DIP',
                                                      args: [
                                                        [
                                                          {
                                                            prim: 'AMOUNT',
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                    {
                                                      prim: 'TRANSFER_TOKENS',
                                                    },
                                                    {
                                                      prim: 'NIL',
                                                      args: [
                                                        {
                                                          prim: 'operation',
                                                        },
                                                      ],
                                                    },
                                                    {
                                                      prim: 'SWAP',
                                                    },
                                                    {
                                                      prim: 'CONS',
                                                    },
                                                    {
                                                      prim: 'PAIR',
                                                    },
                                                  ],
                                                  [
                                                    {
                                                      prim: 'IF_LEFT',
                                                      args: [
                                                        [
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'DUP',
                                                                },
                                                                {
                                                                  prim: 'CDR',
                                                                },
                                                                {
                                                                  prim: 'CAR',
                                                                },
                                                                {
                                                                  prim: 'SENDER',
                                                                },
                                                                {
                                                                  prim: 'COMPARE',
                                                                },
                                                                {
                                                                  prim: 'EQ',
                                                                },
                                                                {
                                                                  prim: 'IF',
                                                                  args: [
                                                                    [],
                                                                    [
                                                                      {
                                                                        prim: 'PUSH',
                                                                        args: [
                                                                          {
                                                                            prim: 'pair',
                                                                            args: [
                                                                              {
                                                                                prim: 'string',
                                                                              },
                                                                              {
                                                                                prim: 'unit',
                                                                              },
                                                                            ],
                                                                          },
                                                                          {
                                                                            prim: 'Pair',
                                                                            args: [
                                                                              {
                                                                                string:
                                                                                  'SenderIsNotAdmin',
                                                                              },
                                                                              {
                                                                                prim: 'Unit',
                                                                              },
                                                                            ],
                                                                          },
                                                                        ],
                                                                      },
                                                                      {
                                                                        prim: 'FAILWITH',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'DUP',
                                                                },
                                                                {
                                                                  prim: 'CDR',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'DUP',
                                                                },
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'CAR',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'CDR',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'DUP',
                                                                },
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'CDR',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'CAR',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'DROP',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'PAIR',
                                                          },
                                                          {
                                                            prim: 'SWAP',
                                                          },
                                                          {
                                                            prim: 'PAIR',
                                                          },
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'DUP',
                                                                },
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'CAR',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'CDR',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'DIP',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'DROP',
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                          {
                                                            prim: 'SWAP',
                                                          },
                                                          {
                                                            prim: 'PAIR',
                                                          },
                                                          {
                                                            prim: 'NIL',
                                                            args: [
                                                              {
                                                                prim: 'operation',
                                                              },
                                                            ],
                                                          },
                                                          {
                                                            prim: 'PAIR',
                                                          },
                                                        ],
                                                        [
                                                          {
                                                            prim: 'IF_LEFT',
                                                            args: [
                                                              [
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'DUP',
                                                                      },
                                                                      {
                                                                        prim: 'CDR',
                                                                      },
                                                                      {
                                                                        prim: 'CAR',
                                                                      },
                                                                      {
                                                                        prim: 'SENDER',
                                                                      },
                                                                      {
                                                                        prim: 'COMPARE',
                                                                      },
                                                                      {
                                                                        prim: 'EQ',
                                                                      },
                                                                      {
                                                                        prim: 'IF',
                                                                        args: [
                                                                          [],
                                                                          [
                                                                            {
                                                                              prim: 'PUSH',
                                                                              args: [
                                                                                {
                                                                                  prim: 'pair',
                                                                                  args: [
                                                                                    {
                                                                                      prim: 'string',
                                                                                    },
                                                                                    {
                                                                                      prim: 'unit',
                                                                                    },
                                                                                  ],
                                                                                },
                                                                                {
                                                                                  prim: 'Pair',
                                                                                  args: [
                                                                                    {
                                                                                      string:
                                                                                        'SenderIsNotAdmin',
                                                                                    },
                                                                                    {
                                                                                      prim: 'Unit',
                                                                                    },
                                                                                  ],
                                                                                },
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'FAILWITH',
                                                                            },
                                                                          ],
                                                                        ],
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'DUP',
                                                                      },
                                                                      {
                                                                        prim: 'CDR',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'DUP',
                                                                      },
                                                                      {
                                                                        prim: 'DIP',
                                                                        args: [
                                                                          [
                                                                            {
                                                                              prim: 'CDR',
                                                                            },
                                                                          ],
                                                                        ],
                                                                      },
                                                                      {
                                                                        prim: 'CAR',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'DROP',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'PAIR',
                                                                },
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'DUP',
                                                                      },
                                                                      {
                                                                        prim: 'DIP',
                                                                        args: [
                                                                          [
                                                                            {
                                                                              prim: 'CAR',
                                                                            },
                                                                          ],
                                                                        ],
                                                                      },
                                                                      {
                                                                        prim: 'CDR',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'DIP',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'DROP',
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'SWAP',
                                                                },
                                                                {
                                                                  prim: 'PAIR',
                                                                },
                                                                {
                                                                  prim: 'NIL',
                                                                  args: [
                                                                    {
                                                                      prim: 'operation',
                                                                    },
                                                                  ],
                                                                },
                                                                {
                                                                  prim: 'PAIR',
                                                                },
                                                              ],
                                                              [
                                                                {
                                                                  prim: 'IF_LEFT',
                                                                  args: [
                                                                    [
                                                                      {
                                                                        prim: 'DUP',
                                                                      },
                                                                      {
                                                                        prim: 'CAR',
                                                                      },
                                                                      {
                                                                        prim: 'DIP',
                                                                        args: [
                                                                          [
                                                                            {
                                                                              prim: 'CDR',
                                                                            },
                                                                          ],
                                                                        ],
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
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'SWAP',
                                                                            },
                                                                          ],
                                                                        ],
                                                                      },
                                                                      {
                                                                        prim: 'PAIR',
                                                                      },
                                                                      {
                                                                        prim: 'CDR',
                                                                      },
                                                                      {
                                                                        prim: 'CDR',
                                                                      },
                                                                      {
                                                                        prim: 'CAR',
                                                                      },
                                                                      {
                                                                        prim: 'DIP',
                                                                        args: [
                                                                          [
                                                                            {
                                                                              prim: 'AMOUNT',
                                                                            },
                                                                          ],
                                                                        ],
                                                                      },
                                                                      {
                                                                        prim: 'TRANSFER_TOKENS',
                                                                      },
                                                                      {
                                                                        prim: 'NIL',
                                                                        args: [
                                                                          {
                                                                            prim: 'operation',
                                                                          },
                                                                        ],
                                                                      },
                                                                      {
                                                                        prim: 'SWAP',
                                                                      },
                                                                      {
                                                                        prim: 'CONS',
                                                                      },
                                                                      {
                                                                        prim: 'PAIR',
                                                                      },
                                                                    ],
                                                                    [
                                                                      {
                                                                        prim: 'IF_LEFT',
                                                                        args: [
                                                                          [
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'CDR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'CAR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'SENDER',
                                                                                  },
                                                                                  {
                                                                                    prim: 'COMPARE',
                                                                                  },
                                                                                  {
                                                                                    prim: 'EQ',
                                                                                  },
                                                                                  {
                                                                                    prim: 'IF',
                                                                                    args: [
                                                                                      [],
                                                                                      [
                                                                                        {
                                                                                          prim: 'PUSH',
                                                                                          args: [
                                                                                            {
                                                                                              prim: 'pair',
                                                                                              args: [
                                                                                                {
                                                                                                  prim: 'string',
                                                                                                },
                                                                                                {
                                                                                                  prim: 'unit',
                                                                                                },
                                                                                              ],
                                                                                            },
                                                                                            {
                                                                                              prim: 'Pair',
                                                                                              args: [
                                                                                                {
                                                                                                  string:
                                                                                                    'SenderIsNotAdmin',
                                                                                                },
                                                                                                {
                                                                                                  prim: 'Unit',
                                                                                                },
                                                                                              ],
                                                                                            },
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'FAILWITH',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'SWAP',
                                                                            },
                                                                            {
                                                                              prim: 'CAR',
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'SWAP',
                                                                            },
                                                                            {
                                                                              prim: 'CAR',
                                                                            },
                                                                            {
                                                                              prim: 'GET',
                                                                            },
                                                                            {
                                                                              prim: 'IF_NONE',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'CDR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'INT',
                                                                                  },
                                                                                  {
                                                                                    prim: 'EQ',
                                                                                  },
                                                                                  {
                                                                                    prim: 'IF',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'NONE',
                                                                                          args: [
                                                                                            {
                                                                                              prim: 'pair',
                                                                                              args: [
                                                                                                {
                                                                                                  prim: 'nat',
                                                                                                },
                                                                                                {
                                                                                                  prim: 'map',
                                                                                                  args: [
                                                                                                    {
                                                                                                      prim: 'address',
                                                                                                    },
                                                                                                    {
                                                                                                      prim: 'nat',
                                                                                                    },
                                                                                                  ],
                                                                                                },
                                                                                              ],
                                                                                            },
                                                                                          ],
                                                                                        },
                                                                                      ],
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'EMPTY_MAP',
                                                                                                args: [
                                                                                                  {
                                                                                                    prim: 'address',
                                                                                                  },
                                                                                                  {
                                                                                                    prim: 'nat',
                                                                                                  },
                                                                                                ],
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'PAIR',
                                                                                        },
                                                                                        {
                                                                                          prim: 'SOME',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                ],
                                                                                [
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'CDR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'CAR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'ADD',
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'CDR',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'CAR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DROP',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'SOME',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'SWAP',
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
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'CAR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'DUP',
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'CAR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'UPDATE',
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'CDR',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'CAR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DROP',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'DUP',
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'CDR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'INT',
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'ADD',
                                                                                  },
                                                                                  {
                                                                                    prim: 'ISNAT',
                                                                                  },
                                                                                  {
                                                                                    prim: 'IF_NONE',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'PUSH',
                                                                                          args: [
                                                                                            {
                                                                                              prim: 'string',
                                                                                            },
                                                                                            {
                                                                                              string:
                                                                                                'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger.hs:313:27 in lorentz-contracts-0.2.0.1-HpDIkWsKofu3zAjntLgs8J:Lorentz.Contracts.ManagedLedger',
                                                                                            },
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'FAILWITH',
                                                                                        },
                                                                                      ],
                                                                                      [],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'CAR',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'CAR',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DROP',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'CAR',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DROP',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'DROP',
                                                                            },
                                                                            {
                                                                              prim: 'NIL',
                                                                              args: [
                                                                                {
                                                                                  prim: 'operation',
                                                                                },
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'PAIR',
                                                                            },
                                                                          ],
                                                                          [
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'CDR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'CAR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'SENDER',
                                                                                  },
                                                                                  {
                                                                                    prim: 'COMPARE',
                                                                                  },
                                                                                  {
                                                                                    prim: 'EQ',
                                                                                  },
                                                                                  {
                                                                                    prim: 'IF',
                                                                                    args: [
                                                                                      [],
                                                                                      [
                                                                                        {
                                                                                          prim: 'PUSH',
                                                                                          args: [
                                                                                            {
                                                                                              prim: 'pair',
                                                                                              args: [
                                                                                                {
                                                                                                  prim: 'string',
                                                                                                },
                                                                                                {
                                                                                                  prim: 'unit',
                                                                                                },
                                                                                              ],
                                                                                            },
                                                                                            {
                                                                                              prim: 'Pair',
                                                                                              args: [
                                                                                                {
                                                                                                  string:
                                                                                                    'SenderIsNotAdmin',
                                                                                                },
                                                                                                {
                                                                                                  prim: 'Unit',
                                                                                                },
                                                                                              ],
                                                                                            },
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'FAILWITH',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'SWAP',
                                                                            },
                                                                            {
                                                                              prim: 'CAR',
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'SWAP',
                                                                            },
                                                                            {
                                                                              prim: 'CAR',
                                                                            },
                                                                            {
                                                                              prim: 'GET',
                                                                            },
                                                                            {
                                                                              prim: 'IF_NONE',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'CDR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PUSH',
                                                                                    args: [
                                                                                      {
                                                                                        prim: 'nat',
                                                                                      },
                                                                                      {
                                                                                        int: '0',
                                                                                      },
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PUSH',
                                                                                    args: [
                                                                                      {
                                                                                        prim: 'string',
                                                                                      },
                                                                                      {
                                                                                        string:
                                                                                          'NotEnoughBalance',
                                                                                      },
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'FAILWITH',
                                                                                  },
                                                                                ],
                                                                                [],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'DUP',
                                                                            },
                                                                            {
                                                                              prim: 'CAR',
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
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'SWAP',
                                                                            },
                                                                            {
                                                                              prim: 'CDR',
                                                                            },
                                                                            {
                                                                              prim: 'SWAP',
                                                                            },
                                                                            {
                                                                              prim: 'SUB',
                                                                            },
                                                                            {
                                                                              prim: 'ISNAT',
                                                                            },
                                                                            {
                                                                              prim: 'IF_NONE',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'CAR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'CDR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PUSH',
                                                                                    args: [
                                                                                      {
                                                                                        prim: 'string',
                                                                                      },
                                                                                      {
                                                                                        string:
                                                                                          'NotEnoughBalance',
                                                                                      },
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'FAILWITH',
                                                                                  },
                                                                                ],
                                                                                [],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'CAR',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DROP',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'PAIR',
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'SWAP',
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'DUP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'CAR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'INT',
                                                                                  },
                                                                                  {
                                                                                    prim: 'EQ',
                                                                                  },
                                                                                  {
                                                                                    prim: 'IF',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                        {
                                                                                          prim: 'SIZE',
                                                                                        },
                                                                                        {
                                                                                          prim: 'INT',
                                                                                        },
                                                                                        {
                                                                                          prim: 'EQ',
                                                                                        },
                                                                                        {
                                                                                          prim: 'IF',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'DROP',
                                                                                              },
                                                                                              {
                                                                                                prim: 'NONE',
                                                                                                args: [
                                                                                                  {
                                                                                                    prim: 'pair',
                                                                                                    args: [
                                                                                                      {
                                                                                                        prim: 'nat',
                                                                                                      },
                                                                                                      {
                                                                                                        prim: 'map',
                                                                                                        args: [
                                                                                                          {
                                                                                                            prim: 'address',
                                                                                                          },
                                                                                                          {
                                                                                                            prim: 'nat',
                                                                                                          },
                                                                                                        ],
                                                                                                      },
                                                                                                    ],
                                                                                                  },
                                                                                                ],
                                                                                              },
                                                                                            ],
                                                                                            [
                                                                                              {
                                                                                                prim: 'SOME',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                      ],
                                                                                      [
                                                                                        {
                                                                                          prim: 'SOME',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'CAR',
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
                                                                                                prim: 'DUP',
                                                                                              },
                                                                                              {
                                                                                                prim: 'CAR',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'UPDATE',
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'CDR',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'CAR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DROP',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'DUP',
                                                                            },
                                                                            {
                                                                              prim: 'DIP',
                                                                              args: [
                                                                                [
                                                                                  {
                                                                                    prim: 'CDR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'NEG',
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'ADD',
                                                                                  },
                                                                                  {
                                                                                    prim: 'ISNAT',
                                                                                  },
                                                                                  {
                                                                                    prim: 'IF_NONE',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'PUSH',
                                                                                          args: [
                                                                                            {
                                                                                              prim: 'string',
                                                                                            },
                                                                                            {
                                                                                              string:
                                                                                                'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger.hs:313:27 in lorentz-contracts-0.2.0.1-HpDIkWsKofu3zAjntLgs8J:Lorentz.Contracts.ManagedLedger',
                                                                                            },
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'FAILWITH',
                                                                                        },
                                                                                      ],
                                                                                      [],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'CAR',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'CAR',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DROP',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DUP',
                                                                                        },
                                                                                        {
                                                                                          prim: 'DIP',
                                                                                          args: [
                                                                                            [
                                                                                              {
                                                                                                prim: 'CAR',
                                                                                              },
                                                                                            ],
                                                                                          ],
                                                                                        },
                                                                                        {
                                                                                          prim: 'CDR',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'DIP',
                                                                                    args: [
                                                                                      [
                                                                                        {
                                                                                          prim: 'DROP',
                                                                                        },
                                                                                      ],
                                                                                    ],
                                                                                  },
                                                                                  {
                                                                                    prim: 'SWAP',
                                                                                  },
                                                                                  {
                                                                                    prim: 'PAIR',
                                                                                  },
                                                                                ],
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'DROP',
                                                                            },
                                                                            {
                                                                              prim: 'NIL',
                                                                              args: [
                                                                                {
                                                                                  prim: 'operation',
                                                                                },
                                                                              ],
                                                                            },
                                                                            {
                                                                              prim: 'PAIR',
                                                                            },
                                                                          ],
                                                                        ],
                                                                      },
                                                                    ],
                                                                  ],
                                                                },
                                                              ],
                                                            ],
                                                          },
                                                        ],
                                                      ],
                                                    },
                                                  ],
                                                ],
                                              },
                                            ],
                                          ],
                                        },
                                      ],
                                    ],
                                  },
                                ],
                              ],
                            },
                          ],
                        ],
                      },
                    ],
                  ],
                },
              ],
              storage: {
                prim: 'Pair',
                args: [
                  [
                    {
                      prim: 'Elt',
                      args: [
                        {
                          string: 'tz29SSCBkTYXK4stSPosByHC4h26WDB3N11o',
                        },
                        {
                          prim: 'Pair',
                          args: [
                            {
                              int: '2',
                            },
                            [],
                          ],
                        },
                      ],
                    },
                  ],
                  {
                    prim: 'Pair',
                    args: [
                      {
                        string: 'tz29SSCBkTYXK4stSPosByHC4h26WDB3N11o',
                      },
                      {
                        prim: 'Pair',
                        args: [
                          {
                            prim: 'False',
                          },
                          {
                            int: '200',
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
            metadata: {
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'tz29SSCBkTYXK4stSPosByHC4h26WDB3N11o',
                  change: '-5943',
                  origin: 'block',
                },
                {
                  kind: 'accumulator',
                  category: 'block fees',
                  change: '5943',
                  origin: 'block',
                },
              ],
              operation_result: {
                status: 'applied',
                balance_updates: [
                  {
                    kind: 'contract',
                    contract: 'tz29SSCBkTYXK4stSPosByHC4h26WDB3N11o',
                    change: '-1333500',
                    origin: 'block',
                  },
                  {
                    kind: 'burned',
                    category: 'storage fees',
                    change: '1333500',
                    origin: 'block',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz29SSCBkTYXK4stSPosByHC4h26WDB3N11o',
                    change: '-64250',
                    origin: 'block',
                  },
                  {
                    kind: 'burned',
                    category: 'storage fees',
                    change: '64250',
                    origin: 'block',
                  },
                  {
                    kind: 'contract',
                    contract: 'tz29SSCBkTYXK4stSPosByHC4h26WDB3N11o',
                    change: '-1000000',
                    origin: 'block',
                  },
                  {
                    kind: 'contract',
                    contract: 'KT1VL1jr716oN2tRZo5kavH1uZvdigsBFZfE',
                    change: '1000000',
                    origin: 'block',
                  },
                ],
                originated_contracts: ['KT1VL1jr716oN2tRZo5kavH1uZvdigsBFZfE'],
                consumed_milligas: '3055338',
                storage_size: '5334',
                paid_storage_size_diff: '5334',
                lazy_storage_diff: [
                  {
                    kind: 'big_map',
                    id: '18017',
                    diff: {
                      action: 'alloc',
                      updates: [
                        {
                          key_hash: 'expru4tqUZyJzVXwYSTrPjA7jHVktca5Mpj8YCyfCfTx2rqmqsnVjY',
                          key: {
                            bytes: '00010c54a9f271091316a015922761e7b6fa59f64d5c',
                          },
                          value: {
                            prim: 'Pair',
                            args: [
                              {
                                int: '2',
                              },
                              [],
                            ],
                          },
                        },
                      ],
                      key_type: {
                        prim: 'address',
                      },
                      value_type: {
                        prim: 'pair',
                        args: [
                          {
                            prim: 'nat',
                          },
                          {
                            prim: 'map',
                            args: [
                              {
                                prim: 'address',
                              },
                              {
                                prim: 'nat',
                              },
                            ],
                          },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        ],
        signature:
          'sigNz82U5DSZEDPyNz1kC1rJ8BjufB4ziqr8Ey4wnaHbSWqhh3gxn49cG3mwiQSWRPNGkhZ9KNS7Pk9NM1VyzoZ5TFF6yDr9',
      },
    ],
  ],
};
