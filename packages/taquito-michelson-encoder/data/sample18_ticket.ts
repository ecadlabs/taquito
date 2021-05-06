export const rpcContractResponse = {
  balance: '0',
  script: {
    code: [
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
                        prim: 'pair',
                        args: [
                          {
                            prim: 'contract',
                            args: [
                              {
                                prim: 'pair',
                                args: [
                                  { prim: 'nat', annots: ['%opening_price'] },
                                  { prim: 'nat', annots: ['%set_reserve_price'] },
                                  {
                                    prim: 'timestamp',
                                    annots: ['%set_start_time']
                                  },
                                  { prim: 'int', annots: ['%set_round_time'] },
                                  {
                                    prim: 'ticket',
                                    args: [{ prim: 'nat' }],
                                    annots: ['%ticket']
                                  }
                                ]
                              }
                            ],
                            annots: ['%destination']
                          },
                          { prim: 'nat', annots: ['%opening_price'] },
                          { prim: 'nat', annots: ['%reserve_price'] },
                          { prim: 'timestamp', annots: ['%start_time'] },
                          { prim: 'int', annots: ['%round_time'] },
                          { prim: 'nat', annots: ['%ticket_id'] }
                        ],
                        annots: ['%auction']
                      },
                      { prim: 'nat', annots: ['%burn'] }
                    ]
                  },
                  {
                    prim: 'or',
                    args: [
                      {
                        prim: 'map',
                        args: [{ prim: 'string' }, { prim: 'bytes' }],
                        annots: ['%mint']
                      },
                      { prim: 'ticket', args: [{ prim: 'nat' }], annots: ['%receive'] }
                    ]
                  }
                ]
              },
              {
                prim: 'pair',
                args: [
                  {
                    prim: 'contract',
                    args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }],
                    annots: ['%destination']
                  },
                  { prim: 'nat', annots: ['%ticket_id'] }
                ],
                annots: ['%send']
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
              { prim: 'address', annots: ['%admin'] },
              {
                prim: 'big_map',
                args: [{ prim: 'nat' }, { prim: 'ticket', args: [{ prim: 'nat' }] }],
                annots: ['%tickets']
              },
              { prim: 'nat', annots: ['%current_id'] },
              {
                prim: 'big_map',
                args: [
                  { prim: 'nat' },
                  {
                    prim: 'pair',
                    args: [
                      { prim: 'nat' },
                      { prim: 'map', args: [{ prim: 'string' }, { prim: 'bytes' }] }
                    ]
                  }
                ],
                annots: ['%token_metadata']
              }
            ]
          }
        ]
      },
      {
        prim: 'code',
        args: [
          [
            { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
            { prim: 'AMOUNT' },
            { prim: 'COMPARE' },
            { prim: 'EQ' },
            {
              prim: 'IF',
              args: [
                [],
                [
                  { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'failed assertion' }] },
                  { prim: 'FAILWITH' }
                ]
              ]
            },
            { prim: 'UNPAIR' },
            { prim: 'SWAP' },
            { prim: 'UNPAIR' },
            { prim: 'SWAP' },
            { prim: 'UNPAIR' },
            { prim: 'SWAP' },
            { prim: 'UNPAIR' },
            { prim: 'DIG', args: [{ int: '4' }] },
            {
              prim: 'IF_LEFT',
              args: [
                [
                  {
                    prim: 'IF_LEFT',
                    args: [
                      [
                        {
                          prim: 'IF_LEFT',
                          args: [
                            [
                              { prim: 'DIG', args: [{ int: '4' }] },
                              { prim: 'DUP' },
                              { prim: 'DUG', args: [{ int: '5' }] },
                              { prim: 'SENDER' },
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
                                        { string: 'failed assertion' }
                                      ]
                                    },
                                    { prim: 'FAILWITH' }
                                  ]
                                ]
                              },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              {
                                prim: 'NONE',
                                args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }]
                              },
                              { prim: 'DIG', args: [{ int: '2' }] },
                              { prim: 'DUP' },
                              { prim: 'DUG', args: [{ int: '3' }] },
                              { prim: 'CDR' },
                              { prim: 'CDR' },
                              { prim: 'CDR' },
                              { prim: 'CDR' },
                              { prim: 'CDR' },
                              { prim: 'GET_AND_UPDATE' },
                              {
                                prim: 'IF_NONE',
                                args: [
                                  [
                                    { prim: 'DROP', args: [{ int: '5' }] },
                                    {
                                      prim: 'PUSH',
                                      args: [
                                        { prim: 'string' },
                                        { string: 'no tickets' }
                                      ]
                                    },
                                    { prim: 'FAILWITH' }
                                  ],
                                  [
                                    { prim: 'DIG', args: [{ int: '2' }] },
                                    { prim: 'DUP' },
                                    { prim: 'DUG', args: [{ int: '3' }] },
                                    { prim: 'CAR' },
                                    {
                                      prim: 'PUSH',
                                      args: [{ prim: 'mutez' }, { int: '0' }]
                                    },
                                    { prim: 'DIG', args: [{ int: '2' }] },
                                    { prim: 'DIG', args: [{ int: '4' }] },
                                    { prim: 'DUP' },
                                    { prim: 'DUG', args: [{ int: '5' }] },
                                    { prim: 'CDR' },
                                    { prim: 'CDR' },
                                    { prim: 'CDR' },
                                    { prim: 'CDR' },
                                    { prim: 'CAR' },
                                    { prim: 'PAIR' },
                                    { prim: 'DIG', args: [{ int: '4' }] },
                                    { prim: 'DUP' },
                                    { prim: 'DUG', args: [{ int: '5' }] },
                                    { prim: 'CDR' },
                                    { prim: 'CDR' },
                                    { prim: 'CDR' },
                                    { prim: 'CAR' },
                                    { prim: 'PAIR' },
                                    { prim: 'DIG', args: [{ int: '4' }] },
                                    { prim: 'DUP' },
                                    { prim: 'DUG', args: [{ int: '5' }] },
                                    { prim: 'CDR' },
                                    { prim: 'CDR' },
                                    { prim: 'CAR' },
                                    { prim: 'PAIR' },
                                    { prim: 'DIG', args: [{ int: '4' }] },
                                    { prim: 'CDR' },
                                    { prim: 'CAR' },
                                    { prim: 'PAIR' },
                                    { prim: 'TRANSFER_TOKENS' },
                                    { prim: 'DIG', args: [{ int: '3' }] },
                                    { prim: 'DIG', args: [{ int: '3' }] },
                                    { prim: 'PAIR' },
                                    { prim: 'DIG', args: [{ int: '2' }] },
                                    { prim: 'PAIR' },
                                    { prim: 'DIG', args: [{ int: '2' }] },
                                    { prim: 'PAIR' },
                                    {
                                      prim: 'NIL',
                                      args: [{ prim: 'operation' }]
                                    },
                                    { prim: 'DIG', args: [{ int: '2' }] },
                                    { prim: 'CONS' },
                                    { prim: 'PAIR' }
                                  ]
                                ]
                              }
                            ],
                            [
                              { prim: 'DIG', args: [{ int: '4' }] },
                              { prim: 'DUP' },
                              { prim: 'DUG', args: [{ int: '5' }] },
                              { prim: 'SENDER' },
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
                                        { string: 'failed assertion' }
                                      ]
                                    },
                                    { prim: 'FAILWITH' }
                                  ]
                                ]
                              },
                              { prim: 'DIG', args: [{ int: '2' }] },
                              { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'ADD' },
                              { prim: 'PAIR' },
                              { prim: 'DIG', args: [{ int: '2' }] },
                              {
                                prim: 'NONE',
                                args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }]
                              },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'UPDATE' },
                              { prim: 'PAIR' },
                              { prim: 'SWAP' },
                              { prim: 'PAIR' },
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
                              { prim: 'DIG', args: [{ int: '4' }] },
                              { prim: 'DUP' },
                              { prim: 'DUG', args: [{ int: '5' }] },
                              { prim: 'SENDER' },
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
                                        { string: 'failed assertion' }
                                      ]
                                    },
                                    { prim: 'FAILWITH' }
                                  ]
                                ]
                              },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'DUP' },
                              { prim: 'DUG', args: [{ int: '4' }] },
                              { prim: 'TICKET' },
                              { prim: 'SOME' },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'DUP' },
                              { prim: 'DUG', args: [{ int: '4' }] },
                              { prim: 'GET_AND_UPDATE' },
                              { prim: 'DROP' },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'DIG', args: [{ int: '2' }] },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'DUP' },
                              { prim: 'DUG', args: [{ int: '4' }] },
                              { prim: 'PAIR' },
                              { prim: 'SOME' },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'DUP' },
                              { prim: 'DUG', args: [{ int: '4' }] },
                              { prim: 'UPDATE' },
                              { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'ADD' },
                              { prim: 'PAIR' },
                              { prim: 'SWAP' },
                              { prim: 'PAIR' },
                              { prim: 'SWAP' },
                              { prim: 'PAIR' },
                              { prim: 'NIL', args: [{ prim: 'operation' }] },
                              { prim: 'PAIR' }
                            ],
                            [
                              { prim: 'READ_TICKET' },
                              { prim: 'UNPAIR' },
                              { prim: 'DROP' },
                              { prim: 'UNPAIR' },
                              { prim: 'DROP' },
                              { prim: 'DIG', args: [{ int: '4' }] },
                              { prim: 'DIG', args: [{ int: '2' }] },
                              { prim: 'SOME' },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'DUP' },
                              { prim: 'DUG', args: [{ int: '4' }] },
                              { prim: 'GET_AND_UPDATE' },
                              { prim: 'DROP' },
                              { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                              { prim: 'DIG', args: [{ int: '2' }] },
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
                                        { string: 'failed assertion' }
                                      ]
                                    },
                                    { prim: 'FAILWITH' }
                                  ]
                                ]
                              },
                              { prim: 'DIG', args: [{ int: '2' }] },
                              { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                              { prim: 'DIG', args: [{ int: '3' }] },
                              { prim: 'ADD' },
                              { prim: 'PAIR' },
                              { prim: 'SWAP' },
                              { prim: 'PAIR' },
                              { prim: 'SWAP' },
                              { prim: 'PAIR' },
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
                  { prim: 'DIG', args: [{ int: '4' }] },
                  { prim: 'DUP' },
                  { prim: 'DUG', args: [{ int: '5' }] },
                  { prim: 'SENDER' },
                  { prim: 'COMPARE' },
                  { prim: 'EQ' },
                  {
                    prim: 'IF',
                    args: [
                      [],
                      [
                        {
                          prim: 'PUSH',
                          args: [{ prim: 'string' }, { string: 'failed assertion' }]
                        },
                        { prim: 'FAILWITH' }
                      ]
                    ]
                  },
                  { prim: 'DIG', args: [{ int: '3' }] },
                  { prim: 'NONE', args: [{ prim: 'ticket', args: [{ prim: 'nat' }] }] },
                  { prim: 'DIG', args: [{ int: '2' }] },
                  { prim: 'DUP' },
                  { prim: 'DUG', args: [{ int: '3' }] },
                  { prim: 'CDR' },
                  { prim: 'GET_AND_UPDATE' },
                  {
                    prim: 'IF_NONE',
                    args: [
                      [
                        { prim: 'DROP', args: [{ int: '5' }] },
                        {
                          prim: 'PUSH',
                          args: [{ prim: 'string' }, { string: 'no tickets' }]
                        },
                        { prim: 'FAILWITH' }
                      ],
                      [
                        { prim: 'DIG', args: [{ int: '2' }] },
                        { prim: 'CAR' },
                        { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
                        { prim: 'DIG', args: [{ int: '2' }] },
                        { prim: 'TRANSFER_TOKENS' },
                        { prim: 'DIG', args: [{ int: '3' }] },
                        { prim: 'DIG', args: [{ int: '3' }] },
                        { prim: 'PAIR' },
                        { prim: 'DIG', args: [{ int: '2' }] },
                        { prim: 'PAIR' },
                        { prim: 'DIG', args: [{ int: '2' }] },
                        { prim: 'PAIR' },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        { prim: 'DIG', args: [{ int: '2' }] },
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
    storage: {
      prim: 'Pair',
      args: [{ string: 'tz1bwfmSYqrhUTAoybGdhWBBefsbuhNdcC2Y' }, { int: '142' }, { int: '2' }, { int: '143' }]
    }
  }
};
export const storage = rpcContractResponse.script.code.find((x) => x.prim === 'storage')!.args[0] as any;

export const params = rpcContractResponse.script.code.find((x) => x.prim === 'parameter')!.args[0] as any;

export const bigMapValue = {
  prim: 'Pair',
  args: [{ string: 'KT1EAMUQC1yJ2sRPNPpLHVMGCzroYGe1C1ea' }, { int: '0' }, { int: '1' }]
};
