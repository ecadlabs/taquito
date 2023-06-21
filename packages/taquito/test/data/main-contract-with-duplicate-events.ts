export const mainContractWithDuplicateEvents = {
  code: [
    {
      prim: 'parameter',
      args: [
        {
          prim: 'pair',
          args: [
            {
              prim: 'pair',
              args: [
                {
                  prim: 'mutez',
                  annots: ['%amount'],
                },
                {
                  prim: 'int',
                  annots: ['%mode'],
                },
              ],
            },
            {
              prim: 'int',
              annots: ['%newStore'],
            },
            {
              prim: 'address',
              annots: ['%targetContractAddress'],
            },
          ],
        },
      ],
    },
    {
      prim: 'storage',
      args: [
        {
          prim: 'int',
        },
      ],
    },
    {
      prim: 'code',
      args: [
        [
          {
            prim: 'UNPAIR',
          },
          {
            prim: 'UNPAIR',
          },
          {
            prim: 'UNPAIR',
          },
          {
            prim: 'DIG',
            args: [
              {
                int: '2',
              },
            ],
          },
          {
            prim: 'UNPAIR',
          },
          {
            prim: 'PUSH',
            args: [
              {
                prim: 'int',
              },
              {
                int: '1',
              },
            ],
          },
          {
            prim: 'DUP',
            args: [
              {
                int: '5',
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
                  prim: 'SWAP',
                },
                {
                  prim: 'DIG',
                  args: [
                    {
                      int: '2',
                    },
                  ],
                },
                {
                  prim: 'DIG',
                  args: [
                    {
                      int: '3',
                    },
                  ],
                },
                {
                  prim: 'DIG',
                  args: [
                    {
                      int: '4',
                    },
                  ],
                },
                {
                  prim: 'DROP',
                  args: [
                    {
                      int: '4',
                    },
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
              ],
              [
                {
                  prim: 'PUSH',
                  args: [
                    {
                      prim: 'int',
                    },
                    {
                      int: '4',
                    },
                  ],
                },
                {
                  prim: 'DUP',
                  args: [
                    {
                      int: '5',
                    },
                  ],
                },
                {
                  prim: 'COMPARE',
                },
                {
                  prim: 'NEQ',
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
                            prim: 'string',
                          },
                          {
                            string:
                              'The main contract fails if parameter is four',
                          },
                        ],
                      },
                      {
                        prim: 'FAILWITH',
                      },
                    ],
                  ],
                },
                {
                  prim: 'SWAP',
                },
                {
                  prim: 'CONTRACT',
                  args: [
                    {
                      prim: 'int',
                    },
                  ],
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
                            string: 'option is None',
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
                  prim: 'DIG',
                  args: [
                    {
                      int: '2',
                    },
                  ],
                },
                {
                  prim: 'DUP',
                  args: [
                    {
                      int: '4',
                    },
                  ],
                },
                {
                  prim: 'TRANSFER_TOKENS',
                },
                {
                  prim: 'PUSH',
                  args: [
                    {
                      prim: 'int',
                    },
                    {
                      int: '1',
                    },
                  ],
                },
                {
                  prim: 'DUP',
                  args: [
                    {
                      int: '4',
                    },
                  ],
                },
                {
                  prim: 'ADD',
                },
                {
                  prim: 'EMIT',
                  annots: ['%tagOneOnlyIntRepeated'],
                  args: [
                    {
                      prim: 'int',
                    },
                  ],
                },
                {
                  prim: 'PUSH',
                  args: [
                    {
                      prim: 'string',
                    },
                    {
                      string: 'lorem ipsum',
                    },
                  ],
                },
                {
                  prim: 'EMIT',
                  annots: ['%tagTwoIntAndString'],
                  args: [
                    {
                      prim: 'string',
                    },
                  ],
                },
                {
                  prim: 'PUSH',
                  args: [
                    {
                      prim: 'int',
                    },
                    {
                      int: '1',
                    },
                  ],
                },
                {
                  prim: 'DIG',
                  args: [
                    {
                      int: '6',
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
                        prim: 'DUP',
                        args: [
                          {
                            int: '5',
                          },
                        ],
                      },
                      {
                        prim: 'EMIT',
                        annots: ['%tagTwoIntAndString'],
                        args: [
                          {
                            prim: 'int',
                          },
                        ],
                      },
                      {
                        prim: 'PUSH',
                        args: [
                          {
                            prim: 'int',
                          },
                          {
                            int: '2',
                          },
                        ],
                      },
                      {
                        prim: 'DIG',
                        args: [
                          {
                            int: '6',
                          },
                        ],
                      },
                      {
                        prim: 'ADD',
                      },
                      {
                        prim: 'EMIT',
                        annots: ['%tagOneOnlyIntRepeated'],
                        args: [
                          {
                            prim: 'int',
                          },
                        ],
                      },
                      {
                        prim: 'DIG',
                        args: [
                          {
                            int: '5',
                          },
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
                        prim: 'DIG',
                        args: [
                          {
                            int: '6',
                          },
                        ],
                      },
                      {
                        prim: 'CONS',
                      },
                      {
                        prim: 'DIG',
                        args: [
                          {
                            int: '2',
                          },
                        ],
                      },
                      {
                        prim: 'CONS',
                      },
                      {
                        prim: 'DIG',
                        args: [
                          {
                            int: '2',
                          },
                        ],
                      },
                      {
                        prim: 'CONS',
                      },
                      {
                        prim: 'DIG',
                        args: [
                          {
                            int: '2',
                          },
                        ],
                      },
                    ],
                    [
                      {
                        prim: 'DIG',
                        args: [
                          {
                            int: '4',
                          },
                        ],
                      },
                      {
                        prim: 'DROP',
                        args: [
                          {
                            int: '2',
                          },
                        ],
                      },
                      {
                        prim: 'DIG',
                        args: [
                          {
                            int: '2',
                          },
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
                        prim: 'DIG',
                        args: [
                          {
                            int: '3',
                          },
                        ],
                      },
                    ],
                  ],
                },
                {
                  prim: 'CONS',
                },
                {
                  prim: 'DIG',
                  args: [
                    {
                      int: '2',
                    },
                  ],
                },
                {
                  prim: 'CONS',
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
  storage: { int: '42' },
};
