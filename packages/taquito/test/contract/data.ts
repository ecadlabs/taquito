import { MichelsonScript, MichelsonData, MichelsonStorage, MichelsonType } from "@taquito/michel-codec";

export const sampleStorage: MichelsonData = {
  prim: 'Pair',
  args: [
    [],
    {
      prim: 'Pair',
      args: [
        { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' },
        { prim: 'Pair', args: [{ prim: 'False' }, { int: '200' }] },
      ],
    },
  ],
};

export const sample: MichelsonStorage = {
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
                { prim: 'nat' },
                { prim: 'map', args: [{ prim: 'address' }, { prim: 'nat' }] },
              ],
            },
          ],
        },
        {
          prim: 'pair',
          args: [{ prim: 'address' }, { prim: 'pair', args: [{ prim: 'bool' }, { prim: 'nat' }] }],
        },
      ],
    },
  ],
};

export const sampleBigMapAbstractionValue: MichelsonType = {
  prim: 'big_map',
  args: [
    { prim: 'string' },
    {
      prim: 'pair',
      args: [{ prim: 'nat' }, { prim: 'map', args: [{ prim: 'string' }, { prim: 'nat' }] }],
    },
  ],
};

export const sampleBigMapValue: MichelsonData = {
  prim: 'Pair',
  args: [
    { int: '261' },
    [
      {
        prim: 'Elt',
        args: [{ bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd' }, { int: '100' }],
      },
      {
        prim: 'Elt',
        args: [{ bytes: '01c57ad825f3c2bd87ca531edd4c911598aabd3a7100' }, { int: '100' }],
      },
    ],
  ],
};

export const miStr = `parameter int; # the participant's guess
storage   (pair
                int     # the number of guesses made by participants
                address # the address to send the winning pot to if the participants fail
          );
code {
       # (pair parameter storage) : []

       # make sure that the participant has contributed at least 1 tez
       PUSH mutez 1000000;
       AMOUNT;
       IFCMPGE {} { PUSH string "You did not provide enough tez."; FAILWITH; };

       # check that the number of guesses has not been exceeded
       UNPAIR; SWAP; # storage : parameter : []
       DUP;          # storage : storage : parameter : []
       CAR;          # int : storage : parameter : []
       DIP { PUSH int 15; };
       IFCMPLT { # check if guess is correct
                 SWAP; # parameter : storage : []
                 PUSH int 34;
                 IFCMPEQ { # the participant guessed correctly, give them the tokens.
                           SENDER;
                           CONTRACT unit;
                           IF_SOME {} { FAILWITH; };
                           BALANCE;
                           UNIT;
                           TRANSFER_TOKENS;
                           NIL operation; SWAP; CONS; PAIR;
                         }
                         { # the participant guessed incorrectly, increment the number of guesses performed.
                           UNPAIR;
                           PUSH int 1;
                           ADD;
                           PAIR;
                           NIL operation; PAIR;
                         };
               }
               { # attempts exceeded, give winnings to the specified address
                 DIP { DROP; }; # storage : []
                 DUP; CDR;
                 CONTRACT unit;
                 IF_SOME {} { FAILWITH; };
                 BALANCE;
                 UNIT;
                 TRANSFER_TOKENS;
                 NIL operation; SWAP; CONS; PAIR;
               };
     };
`;

export const miSample: MichelsonScript =
  [
    { prim: 'parameter', args: [{ prim: 'int' }] },
    {
      prim: 'storage',
      args: [
        { prim: 'pair', args: [{ prim: 'int' }, { prim: 'address' }] }
      ]
    },
    {
      prim: 'code',
      args: [
        [
          {
            prim: 'PUSH',
            args: [{ prim: 'mutez' }, { int: '1000000' }]
          },
          { prim: 'AMOUNT' },
          [
            { prim: 'COMPARE' },
            { prim: 'GE' },
            {
              prim: 'IF',
              args: [
                [],
                [
                  {
                    prim: 'PUSH',
                    args: [
                      { prim: 'string' },
                      { string: 'You did not provide enough tez.' }
                    ]
                  },
                  { prim: 'FAILWITH' }
                ]
              ]
            }
          ],
          [
            [
              { prim: 'DUP' },
              { prim: 'CAR' },
              {
                prim: 'DIP',
                args: [[{ prim: 'CDR' }]]
              }
            ]
          ],
          { prim: 'SWAP' },
          { prim: 'DUP' },
          { prim: 'CAR' },
          {
            prim: 'DIP',
            args: [
              [
                {
                  prim: 'PUSH',
                  args: [{ prim: 'int' }, { int: '15' }]
                }
              ]
            ]
          },
          [
            { prim: 'COMPARE' },
            { prim: 'LT' },
            {
              prim: 'IF',
              args: [
                [
                  { prim: 'SWAP' },
                  {
                    prim: 'PUSH',
                    args: [{ prim: 'int' }, { int: '34' }]
                  },
                  [
                    { prim: 'COMPARE' },
                    { prim: 'EQ' },
                    {
                      prim: 'IF',
                      args: [
                        [
                          { prim: 'SENDER' },
                          {
                            prim: 'CONTRACT',
                            args: [{ prim: 'unit' }]
                          },
                          [
                            {
                              prim: 'IF_NONE',
                              args: [[{ prim: 'FAILWITH' }], []]
                            }
                          ],
                          { prim: 'BALANCE' },
                          { prim: 'UNIT' },
                          { prim: 'TRANSFER_TOKENS' },
                          {
                            prim: 'NIL',
                            args: [{ prim: 'operation' }]
                          },
                          { prim: 'SWAP' },
                          { prim: 'CONS' },
                          { prim: 'PAIR' }
                        ],
                        [
                          [
                            [
                              { prim: 'DUP' },
                              { prim: 'CAR' },
                              {
                                prim: 'DIP',
                                args: [[{ prim: 'CDR' }]]
                              }
                            ]
                          ],
                          {
                            prim: 'PUSH',
                            args: [{ prim: 'int' }, { int: '1' }]
                          },
                          { prim: 'ADD' },
                          { prim: 'PAIR' },
                          {
                            prim: 'NIL',
                            args: [{ prim: 'operation' }]
                          },
                          { prim: 'PAIR' }
                        ]
                      ]
                    }
                  ]
                ],
                [
                  {
                    prim: 'DIP',
                    args: [[{ prim: 'DROP' }]]
                  },
                  { prim: 'DUP' },
                  { prim: 'CDR' },
                  { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
                  [
                    {
                      prim: 'IF_NONE',
                      args: [[{ prim: 'FAILWITH' }], []]
                    }
                  ],
                  { prim: 'BALANCE' },
                  { prim: 'UNIT' },
                  { prim: 'TRANSFER_TOKENS' },
                  { prim: 'NIL', args: [{ prim: 'operation' }] },
                  { prim: 'SWAP' },
                  { prim: 'CONS' },
                  { prim: 'PAIR' }
                ]
              ]
            }
          ]
        ]
      ]
    }
  ];

export const miInit = '(Pair 0 "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn")';

export const miStorage: MichelsonData = {
  prim: "Pair",
  args: [
    {
      int: "0",
    },
    {
      string: "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn",
    },
  ],
};

export const ligoSample: MichelsonScript = [
  { prim: 'parameter', args: [{ prim: 'int' }] },
  { prim: 'storage', args: [{ prim: 'int' }] },
  {
    prim: 'code',
    args: [
      [
        [],
        [
          [
            [[{ prim: 'DUP' }], { prim: 'CAR' }],
            [
              [
                [
                  [
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DUP' }]],
                    },
                    { prim: 'SWAP' },
                  ],
                ],
                { prim: 'CDR' },
              ],
              [
                {
                  prim: 'PUSH',
                  args: [{ prim: 'unit' }, { prim: 'Unit' }],
                },
                [
                  [
                    [
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
                                        },
                                      ],
                                    ],
                                  },
                                  { prim: 'SWAP' },
                                ],
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
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
                                        {
                                          prim: 'DUP',
                                        },
                                      ],
                                    ],
                                  },
                                  { prim: 'SWAP' },
                                ],
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                      { prim: 'ADD' },
                    ],
                    {
                      prim: 'NIL',
                      args: [{ prim: 'operation' }],
                    },
                  ],
                  { prim: 'PAIR' },
                ],
              ],
              [],
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
                                      prim: 'DIP',
                                      args: [
                                        [
                                          {
                                            prim: 'DIP',
                                            args: [[[]]],
                                          },
                                        ],
                                      ],
                                    },
                                  ],
                                ],
                              },
                              { prim: 'DROP' },
                            ],
                          ],
                        ],
                      },
                      { prim: 'DROP' },
                    ],
                  ],
                ],
              },
            ],
            [],
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
                            prim: 'DIP',
                            args: [[[]]],
                          },
                        ],
                      ],
                    },
                    { prim: 'DROP' },
                  ],
                ],
              ],
            },
          ],
          {
            prim: 'DIP',
            args: [[[{ prim: 'DIP', args: [[[]]] }, { prim: 'DROP' }]]],
          },
        ],
      ],
    ],
  },
];

export const tokenCode: MichelsonScript = [
  {
    prim: 'parameter',
    args: [
      {
        prim: 'or',
        args: [
          {
            prim: 'pair',
            args: [
              { prim: 'address', annots: [':from'] },
              {
                prim: 'pair',
                args: [
                  { prim: 'address', annots: [':to'] },
                  { prim: 'nat', annots: [':value'] },
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
                  { prim: 'address', annots: [':spender'] },
                  { prim: 'nat', annots: [':value'] },
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
                          { prim: 'address', annots: [':owner'] },
                          { prim: 'address', annots: [':spender'] },
                        ],
                      },
                      { prim: 'contract', args: [{ prim: 'nat', annots: [':remaining'] }] },
                    ],
                    annots: ['%getAllowance'],
                  },
                  {
                    prim: 'or',
                    args: [
                      {
                        prim: 'pair',
                        args: [
                          { prim: 'address', annots: [':owner'] },
                          { prim: 'contract', args: [{ prim: 'nat', annots: [':balance'] }] },
                        ],
                        annots: ['%getBalance'],
                      },
                      {
                        prim: 'or',
                        args: [
                          {
                            prim: 'pair',
                            args: [
                              { prim: 'unit' },
                              {
                                prim: 'contract',
                                args: [{ prim: 'nat', annots: [':totalSupply'] }],
                              },
                            ],
                            annots: ['%getTotalSupply'],
                          },
                          {
                            prim: 'or',
                            args: [
                              { prim: 'bool', annots: ['%setPause'] },
                              {
                                prim: 'or',
                                args: [
                                  { prim: 'address', annots: ['%setAdministrator'] },
                                  {
                                    prim: 'or',
                                    args: [
                                      {
                                        prim: 'pair',
                                        args: [
                                          { prim: 'unit' },
                                          {
                                            prim: 'contract',
                                            args: [{ prim: 'address', annots: [':administrator'] }],
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
                                              { prim: 'address', annots: [':to'] },
                                              { prim: 'nat', annots: [':value'] },
                                            ],
                                            annots: ['%mint'],
                                          },
                                          {
                                            prim: 'pair',
                                            args: [
                                              { prim: 'address', annots: [':from'] },
                                              { prim: 'nat', annots: [':value'] },
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
              { prim: 'address' },
              {
                prim: 'pair',
                args: [
                  { prim: 'nat' },
                  { prim: 'map', args: [{ prim: 'address' }, { prim: 'nat' }] },
                ],
              },
            ],
          },
          {
            prim: 'pair',
            args: [
              { prim: 'address' },
              { prim: 'pair', args: [{ prim: 'bool' }, { prim: 'nat' }] },
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
        { prim: 'DUP' },
        { prim: 'CAR' },
        { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
        {
          prim: 'IF_LEFT',
          args: [
            [
              {
                prim: 'DIP',
                args: [
                  [
                    { prim: 'DUP' },
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'CAR' },
                    {
                      prim: 'IF',
                      args: [
                        [
                          {
                            prim: 'PUSH',
                            args: [
                              { prim: 'pair', args: [{ prim: 'string' }, { prim: 'unit' }] },
                              {
                                prim: 'Pair',
                                args: [{ string: 'OperationsArePaused' }, { prim: 'Unit' }],
                              },
                            ],
                          },
                          { prim: 'FAILWITH' },
                        ],
                        [],
                      ],
                    },
                  ],
                ],
              },
              { prim: 'DUP' },
              { prim: 'CDR' },
              { prim: 'CAR' },
              { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] },
              { prim: 'CAST', args: [{ prim: 'address' }] },
              { prim: 'COMPARE' },
              { prim: 'EQ' },
              {
                prim: 'IF',
                args: [
                  [{ prim: 'DROP' }],
                  [
                    { prim: 'DUP' },
                    { prim: 'CAR' },
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                    },
                    { prim: 'SENDER' },
                    { prim: 'COMPARE' },
                    { prim: 'EQ' },
                    {
                      prim: 'IF',
                      args: [
                        [
                          { prim: 'DROP' },
                          { prim: 'PUSH', args: [{ prim: 'bool' }, { prim: 'False' }] },
                        ],
                        [
                          { prim: 'CDR' },
                          { prim: 'CAR' },
                          { prim: 'SENDER' },
                          { prim: 'COMPARE' },
                          { prim: 'NEQ' },
                        ],
                      ],
                    },
                    {
                      prim: 'IF',
                      args: [
                        [
                          { prim: 'DUP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                      { prim: 'CAR' },
                                      { prim: 'SENDER' },
                                      { prim: 'PAIR' },
                                      { prim: 'DUP' },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            { prim: 'CDR' },
                                            { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                            { prim: 'GET' },
                                            {
                                              prim: 'IF_NONE',
                                              args: [
                                                [
                                                  {
                                                    prim: 'EMPTY_MAP',
                                                    args: [{ prim: 'address' }, { prim: 'nat' }],
                                                  },
                                                ],
                                                [{ prim: 'CDR' }],
                                              ],
                                            },
                                          ],
                                        ],
                                      },
                                      { prim: 'CAR' },
                                      { prim: 'GET' },
                                      {
                                        prim: 'IF_NONE',
                                        args: [
                                          [{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] }],
                                          [],
                                        ],
                                      },
                                    ],
                                  ],
                                },
                                { prim: 'DUP' },
                                { prim: 'CAR' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'SENDER' },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            { prim: 'DUP' },
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                                  { prim: 'SWAP' },
                                                ],
                                              ],
                                            },
                                            { prim: 'SWAP' },
                                            { prim: 'SUB' },
                                            { prim: 'ISNAT' },
                                            {
                                              prim: 'IF_NONE',
                                              args: [
                                                [
                                                  { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                                  { prim: 'SWAP' },
                                                  { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                                  { prim: 'SWAP' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'PAIR' },
                                                  {
                                                    prim: 'PUSH',
                                                    args: [
                                                      { prim: 'string' },
                                                      { string: 'NotEnoughAllowance' },
                                                    ],
                                                  },
                                                  { prim: 'PAIR' },
                                                  { prim: 'FAILWITH' },
                                                ],
                                                [],
                                              ],
                                            },
                                          ],
                                        ],
                                      },
                                      { prim: 'PAIR' },
                                    ],
                                  ],
                                },
                                { prim: 'PAIR' },
                                { prim: 'DIP', args: [[{ prim: 'DROP' }, { prim: 'DROP' }]] },
                                { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] },
                                { prim: 'SWAP' },
                                { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] },
                                { prim: 'SWAP' },
                                { prim: 'GET' },
                                {
                                  prim: 'IF_NONE',
                                  args: [
                                    [
                                      { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            {
                                              prim: 'EMPTY_MAP',
                                              args: [{ prim: 'address' }, { prim: 'nat' }],
                                            },
                                          ],
                                        ],
                                      },
                                      { prim: 'PAIR' },
                                      {
                                        prim: 'EMPTY_MAP',
                                        args: [{ prim: 'address' }, { prim: 'nat' }],
                                      },
                                    ],
                                    [{ prim: 'DUP' }, { prim: 'CDR' }],
                                  ],
                                },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
                                  ],
                                },
                                { prim: 'SWAP' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'DUP' },
                                { prim: 'INT' },
                                { prim: 'EQ' },
                                {
                                  prim: 'IF',
                                  args: [
                                    [{ prim: 'DROP' }, { prim: 'NONE', args: [{ prim: 'nat' }] }],
                                    [{ prim: 'SOME' }],
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
                                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                            { prim: 'SWAP' },
                                          ],
                                        ],
                                      },
                                      { prim: 'SWAP' },
                                    ],
                                  ],
                                },
                                { prim: 'SWAP' },
                                { prim: 'CDR' },
                                { prim: 'CAR' },
                                { prim: 'UPDATE' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'DUP' },
                                      { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                      { prim: 'CDR' },
                                    ],
                                  ],
                                },
                                { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                                { prim: 'SWAP' },
                                { prim: 'PAIR' },
                                { prim: 'SOME' },
                                { prim: 'SWAP' },
                                { prim: 'CAR' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] }],
                                  ],
                                },
                                { prim: 'UPDATE' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'DUP' },
                                      { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                      { prim: 'CAR' },
                                    ],
                                  ],
                                },
                                { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                                { prim: 'PAIR' },
                              ],
                            ],
                          },
                        ],
                        [],
                      ],
                    },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' },
                    { prim: 'CAR' },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' },
                    { prim: 'CDR' },
                    { prim: 'CAR' },
                    { prim: 'GET' },
                    {
                      prim: 'IF_NONE',
                      args: [
                        [
                          { prim: 'DUP' },
                          { prim: 'CDR' },
                          { prim: 'CDR' },
                          { prim: 'INT' },
                          { prim: 'EQ' },
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
                                        { prim: 'nat' },
                                        {
                                          prim: 'map',
                                          args: [{ prim: 'address' }, { prim: 'nat' }],
                                        },
                                      ],
                                    },
                                  ],
                                },
                              ],
                              [
                                { prim: 'DUP' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      {
                                        prim: 'EMPTY_MAP',
                                        args: [{ prim: 'address' }, { prim: 'nat' }],
                                      },
                                    ],
                                  ],
                                },
                                { prim: 'PAIR' },
                                { prim: 'SOME' },
                              ],
                            ],
                          },
                        ],
                        [
                          { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                          { prim: 'SWAP' },
                          { prim: 'CDR' },
                          { prim: 'CDR' },
                          { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] },
                          { prim: 'ADD' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                { prim: 'CAR' },
                              ],
                            ],
                          },
                          { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                          { prim: 'PAIR' },
                          { prim: 'SOME' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] }]],
                    },
                    { prim: 'DUP' },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'CDR' },
                          { prim: 'CAR' },
                          { prim: 'UPDATE' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                { prim: 'CAR' },
                              ],
                            ],
                          },
                          { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                          { prim: 'PAIR' },
                        ],
                      ],
                    },
                    { prim: 'DUP' },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'CDR' },
                          { prim: 'CDR' },
                          { prim: 'INT' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'CDR' },
                                { prim: 'DUP' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                              ],
                            ],
                          },
                          { prim: 'ADD' },
                          { prim: 'ISNAT' },
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
                                        'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger.hs:313:27 in lorentz-contracts-0.2.0.1-HpDIkWsKofu3zAjntLgs8J:Lorentz.Contracts.ManagedLedger',
                                    },
                                  ],
                                },
                                { prim: 'FAILWITH' },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                { prim: 'CDR' },
                              ],
                            ],
                          },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                { prim: 'CDR' },
                              ],
                            ],
                          },
                          { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                          { prim: 'SWAP' },
                          { prim: 'PAIR' },
                          { prim: 'SWAP' },
                          { prim: 'PAIR' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                { prim: 'CDR' },
                              ],
                            ],
                          },
                          { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                          { prim: 'SWAP' },
                          { prim: 'PAIR' },
                        ],
                      ],
                    },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' },
                    { prim: 'CAR' },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' },
                    { prim: 'CAR' },
                    { prim: 'GET' },
                    {
                      prim: 'IF_NONE',
                      args: [
                        [
                          { prim: 'CDR' },
                          { prim: 'CDR' },
                          { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
                          { prim: 'SWAP' },
                          { prim: 'PAIR' },
                          {
                            prim: 'PUSH',
                            args: [{ prim: 'string' }, { string: 'NotEnoughBalance' }],
                          },
                          { prim: 'PAIR' },
                          { prim: 'FAILWITH' },
                        ],
                        [],
                      ],
                    },
                    { prim: 'DUP' },
                    { prim: 'CAR' },
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                    },
                    { prim: 'SWAP' },
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'SWAP' },
                    { prim: 'SUB' },
                    { prim: 'ISNAT' },
                    {
                      prim: 'IF_NONE',
                      args: [
                        [
                          { prim: 'CAR' },
                          { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                          { prim: 'SWAP' },
                          { prim: 'CDR' },
                          { prim: 'CDR' },
                          { prim: 'PAIR' },
                          {
                            prim: 'PUSH',
                            args: [{ prim: 'string' }, { string: 'NotEnoughBalance' }],
                          },
                          { prim: 'PAIR' },
                          { prim: 'FAILWITH' },
                        ],
                        [],
                      ],
                    },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'DUP' },
                          { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                          { prim: 'CAR' },
                        ],
                      ],
                    },
                    { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                    { prim: 'PAIR' },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'DUP' },
                          { prim: 'CAR' },
                          { prim: 'INT' },
                          { prim: 'EQ' },
                          {
                            prim: 'IF',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'CDR' },
                                { prim: 'SIZE' },
                                { prim: 'INT' },
                                { prim: 'EQ' },
                                {
                                  prim: 'IF',
                                  args: [
                                    [
                                      { prim: 'DROP' },
                                      {
                                        prim: 'NONE',
                                        args: [
                                          {
                                            prim: 'pair',
                                            args: [
                                              { prim: 'nat' },
                                              {
                                                prim: 'map',
                                                args: [{ prim: 'address' }, { prim: 'nat' }],
                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                    [{ prim: 'SOME' }],
                                  ],
                                },
                              ],
                              [{ prim: 'SOME' }],
                            ],
                          },
                          { prim: 'SWAP' },
                          { prim: 'CAR' },
                          {
                            prim: 'DIP',
                            args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] }]],
                          },
                          { prim: 'UPDATE' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                { prim: 'CAR' },
                              ],
                            ],
                          },
                          { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                          { prim: 'PAIR' },
                        ],
                      ],
                    },
                    { prim: 'DUP' },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'CDR' },
                          { prim: 'CDR' },
                          { prim: 'NEG' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'CDR' },
                                { prim: 'DUP' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                              ],
                            ],
                          },
                          { prim: 'ADD' },
                          { prim: 'ISNAT' },
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
                                        'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger.hs:313:27 in lorentz-contracts-0.2.0.1-HpDIkWsKofu3zAjntLgs8J:Lorentz.Contracts.ManagedLedger',
                                    },
                                  ],
                                },
                                { prim: 'FAILWITH' },
                              ],
                              [],
                            ],
                          },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                { prim: 'CDR' },
                              ],
                            ],
                          },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                { prim: 'CDR' },
                              ],
                            ],
                          },
                          { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                          { prim: 'SWAP' },
                          { prim: 'PAIR' },
                          { prim: 'SWAP' },
                          { prim: 'PAIR' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                { prim: 'CDR' },
                              ],
                            ],
                          },
                          { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                          { prim: 'SWAP' },
                          { prim: 'PAIR' },
                        ],
                      ],
                    },
                    { prim: 'DROP' },
                  ],
                ],
              },
              { prim: 'NIL', args: [{ prim: 'operation' }] },
              { prim: 'PAIR' },
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
                          { prim: 'DUP' },
                          { prim: 'CDR' },
                          { prim: 'CDR' },
                          { prim: 'CAR' },
                          {
                            prim: 'IF',
                            args: [
                              [
                                {
                                  prim: 'PUSH',
                                  args: [
                                    { prim: 'pair', args: [{ prim: 'string' }, { prim: 'unit' }] },
                                    {
                                      prim: 'Pair',
                                      args: [{ string: 'OperationsArePaused' }, { prim: 'Unit' }],
                                    },
                                  ],
                                },
                                { prim: 'FAILWITH' },
                              ],
                              [],
                            ],
                          },
                        ],
                      ],
                    },
                    { prim: 'SENDER' },
                    { prim: 'PAIR' },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' },
                    { prim: 'DUP' },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'CAR' },
                          { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                          { prim: 'GET' },
                          {
                            prim: 'IF_NONE',
                            args: [
                              [{ prim: 'EMPTY_MAP', args: [{ prim: 'address' }, { prim: 'nat' }] }],
                              [{ prim: 'CDR' }],
                            ],
                          },
                        ],
                      ],
                    },
                    { prim: 'CDR' },
                    { prim: 'CAR' },
                    { prim: 'GET' },
                    {
                      prim: 'IF_NONE',
                      args: [[{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] }], []],
                    },
                    { prim: 'DUP' },
                    { prim: 'INT' },
                    { prim: 'EQ' },
                    {
                      prim: 'IF',
                      args: [
                        [{ prim: 'DROP' }],
                        [
                          { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                          { prim: 'SWAP' },
                          { prim: 'CDR' },
                          { prim: 'CDR' },
                          { prim: 'INT' },
                          { prim: 'EQ' },
                          {
                            prim: 'IF',
                            args: [
                              [{ prim: 'DROP' }],
                              [
                                {
                                  prim: 'PUSH',
                                  args: [{ prim: 'string' }, { string: 'UnsafeAllowanceChange' }],
                                },
                                { prim: 'PAIR' },
                                { prim: 'FAILWITH' },
                              ],
                            ],
                          },
                        ],
                      ],
                    },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] },
                    { prim: 'SWAP' },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] },
                    { prim: 'SWAP' },
                    { prim: 'GET' },
                    {
                      prim: 'IF_NONE',
                      args: [
                        [
                          { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
                          {
                            prim: 'DIP',
                            args: [
                              [{ prim: 'EMPTY_MAP', args: [{ prim: 'address' }, { prim: 'nat' }] }],
                            ],
                          },
                          { prim: 'PAIR' },
                          { prim: 'EMPTY_MAP', args: [{ prim: 'address' }, { prim: 'nat' }] },
                        ],
                        [{ prim: 'DUP' }, { prim: 'CDR' }],
                      ],
                    },
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                    },
                    { prim: 'SWAP' },
                    { prim: 'CDR' },
                    { prim: 'CDR' },
                    { prim: 'DUP' },
                    { prim: 'INT' },
                    { prim: 'EQ' },
                    {
                      prim: 'IF',
                      args: [
                        [{ prim: 'DROP' }, { prim: 'NONE', args: [{ prim: 'nat' }] }],
                        [{ prim: 'SOME' }],
                      ],
                    },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          {
                            prim: 'DIP',
                            args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                    { prim: 'CDR' },
                    { prim: 'CAR' },
                    { prim: 'UPDATE' },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'DUP' },
                          { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                          { prim: 'CDR' },
                        ],
                      ],
                    },
                    { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                    { prim: 'SWAP' },
                    { prim: 'PAIR' },
                    { prim: 'SOME' },
                    { prim: 'SWAP' },
                    { prim: 'CAR' },
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] }]],
                    },
                    { prim: 'UPDATE' },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'DUP' },
                          { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                          { prim: 'CAR' },
                        ],
                      ],
                    },
                    { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                    { prim: 'PAIR' },
                    { prim: 'NIL', args: [{ prim: 'operation' }] },
                    { prim: 'PAIR' },
                  ],
                  [
                    {
                      prim: 'IF_LEFT',
                      args: [
                        [
                          { prim: 'DUP' },
                          { prim: 'CAR' },
                          { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                          {
                            prim: 'DIP',
                            args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                          },
                          { prim: 'PAIR' },
                          { prim: 'DUP' },
                          { prim: 'CAR' },
                          { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                          { prim: 'DUP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'CAR' },
                                { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                { prim: 'GET' },
                                {
                                  prim: 'IF_NONE',
                                  args: [
                                    [
                                      {
                                        prim: 'EMPTY_MAP',
                                        args: [{ prim: 'address' }, { prim: 'nat' }],
                                      },
                                    ],
                                    [{ prim: 'CDR' }],
                                  ],
                                },
                              ],
                            ],
                          },
                          { prim: 'CDR' },
                          { prim: 'GET' },
                          {
                            prim: 'IF_NONE',
                            args: [[{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] }], []],
                          },
                          { prim: 'DIP', args: [[{ prim: 'AMOUNT' }]] },
                          { prim: 'TRANSFER_TOKENS' },
                          { prim: 'NIL', args: [{ prim: 'operation' }] },
                          { prim: 'SWAP' },
                          { prim: 'CONS' },
                          { prim: 'PAIR' },
                        ],
                        [
                          {
                            prim: 'IF_LEFT',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'CAR' },
                                { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
                                  ],
                                },
                                { prim: 'PAIR' },
                                { prim: 'DUP' },
                                { prim: 'CAR' },
                                { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                { prim: 'GET' },
                                {
                                  prim: 'IF_NONE',
                                  args: [
                                    [{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] }],
                                    [{ prim: 'CAR' }],
                                  ],
                                },
                                { prim: 'DIP', args: [[{ prim: 'AMOUNT' }]] },
                                { prim: 'TRANSFER_TOKENS' },
                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                { prim: 'SWAP' },
                                { prim: 'CONS' },
                                { prim: 'PAIR' },
                              ],
                              [
                                {
                                  prim: 'IF_LEFT',
                                  args: [
                                    [
                                      { prim: 'DUP' },
                                      { prim: 'CAR' },
                                      { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                            { prim: 'SWAP' },
                                          ],
                                        ],
                                      },
                                      { prim: 'PAIR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'DIP', args: [[{ prim: 'AMOUNT' }]] },
                                      { prim: 'TRANSFER_TOKENS' },
                                      { prim: 'NIL', args: [{ prim: 'operation' }] },
                                      { prim: 'SWAP' },
                                      { prim: 'CONS' },
                                      { prim: 'PAIR' },
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
                                                  { prim: 'DUP' },
                                                  { prim: 'CDR' },
                                                  { prim: 'CAR' },
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
                                                            {
                                                              prim: 'pair',
                                                              args: [
                                                                { prim: 'string' },
                                                                { prim: 'unit' },
                                                              ],
                                                            },
                                                            {
                                                              prim: 'Pair',
                                                              args: [
                                                                { string: 'SenderIsNotAdmin' },
                                                                { prim: 'Unit' },
                                                              ],
                                                            },
                                                          ],
                                                        },
                                                        { prim: 'FAILWITH' },
                                                      ],
                                                    ],
                                                  },
                                                ],
                                              ],
                                            },
                                            {
                                              prim: 'DIP',
                                              args: [[{ prim: 'DUP' }, { prim: 'CDR' }]],
                                            },
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  { prim: 'DUP' },
                                                  { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                                  { prim: 'CDR' },
                                                ],
                                              ],
                                            },
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  { prim: 'DUP' },
                                                  { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                                  { prim: 'CAR' },
                                                ],
                                              ],
                                            },
                                            { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                                            { prim: 'PAIR' },
                                            { prim: 'SWAP' },
                                            { prim: 'PAIR' },
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  { prim: 'DUP' },
                                                  { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                                  { prim: 'CDR' },
                                                ],
                                              ],
                                            },
                                            { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                                            { prim: 'SWAP' },
                                            { prim: 'PAIR' },
                                            { prim: 'NIL', args: [{ prim: 'operation' }] },
                                            { prim: 'PAIR' },
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
                                                        { prim: 'DUP' },
                                                        { prim: 'CDR' },
                                                        { prim: 'CAR' },
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
                                                                  {
                                                                    prim: 'pair',
                                                                    args: [
                                                                      { prim: 'string' },
                                                                      { prim: 'unit' },
                                                                    ],
                                                                  },
                                                                  {
                                                                    prim: 'Pair',
                                                                    args: [
                                                                      {
                                                                        string: 'SenderIsNotAdmin',
                                                                      },
                                                                      { prim: 'Unit' },
                                                                    ],
                                                                  },
                                                                ],
                                                              },
                                                              { prim: 'FAILWITH' },
                                                            ],
                                                          ],
                                                        },
                                                      ],
                                                    ],
                                                  },
                                                  {
                                                    prim: 'DIP',
                                                    args: [[{ prim: 'DUP' }, { prim: 'CDR' }]],
                                                  },
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        { prim: 'DUP' },
                                                        { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                                        { prim: 'CAR' },
                                                      ],
                                                    ],
                                                  },
                                                  { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                                                  { prim: 'PAIR' },
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        { prim: 'DUP' },
                                                        { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                                        { prim: 'CDR' },
                                                      ],
                                                    ],
                                                  },
                                                  { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
                                                  { prim: 'SWAP' },
                                                  { prim: 'PAIR' },
                                                  { prim: 'NIL', args: [{ prim: 'operation' }] },
                                                  { prim: 'PAIR' },
                                                ],
                                                [
                                                  {
                                                    prim: 'IF_LEFT',
                                                    args: [
                                                      [
                                                        { prim: 'DUP' },
                                                        { prim: 'CAR' },
                                                        { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [[{ prim: 'DUP' }]],
                                                              },
                                                              { prim: 'SWAP' },
                                                            ],
                                                          ],
                                                        },
                                                        { prim: 'PAIR' },
                                                        { prim: 'CDR' },
                                                        { prim: 'CDR' },
                                                        { prim: 'CAR' },
                                                        {
                                                          prim: 'DIP',
                                                          args: [[{ prim: 'AMOUNT' }]],
                                                        },
                                                        { prim: 'TRANSFER_TOKENS' },
                                                        {
                                                          prim: 'NIL',
                                                          args: [{ prim: 'operation' }],
                                                        },
                                                        { prim: 'SWAP' },
                                                        { prim: 'CONS' },
                                                        { prim: 'PAIR' },
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
                                                                    { prim: 'DUP' },
                                                                    { prim: 'CDR' },
                                                                    { prim: 'CAR' },
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
                                                                              {
                                                                                prim: 'pair',
                                                                                args: [
                                                                                  {
                                                                                    prim: 'string',
                                                                                  },
                                                                                  { prim: 'unit' },
                                                                                ],
                                                                              },
                                                                              {
                                                                                prim: 'Pair',
                                                                                args: [
                                                                                  {
                                                                                    string:
                                                                                      'SenderIsNotAdmin',
                                                                                  },
                                                                                  { prim: 'Unit' },
                                                                                ],
                                                                              },
                                                                            ],
                                                                          },
                                                                          { prim: 'FAILWITH' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                  ],
                                                                ],
                                                              },
                                                              {
                                                                prim: 'DIP',
                                                                args: [[{ prim: 'DUP' }]],
                                                              },
                                                              { prim: 'SWAP' },
                                                              { prim: 'CAR' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [[{ prim: 'DUP' }]],
                                                              },
                                                              { prim: 'SWAP' },
                                                              { prim: 'CAR' },
                                                              { prim: 'GET' },
                                                              {
                                                                prim: 'IF_NONE',
                                                                args: [
                                                                  [
                                                                    { prim: 'DUP' },
                                                                    { prim: 'CDR' },
                                                                    { prim: 'INT' },
                                                                    { prim: 'EQ' },
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
                                                                                  { prim: 'nat' },
                                                                                  {
                                                                                    prim: 'map',
                                                                                    args: [
                                                                                      {
                                                                                        prim:
                                                                                          'address',
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
                                                                          { prim: 'DUP' },
                                                                          { prim: 'CDR' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [
                                                                                {
                                                                                  prim: 'EMPTY_MAP',
                                                                                  args: [
                                                                                    {
                                                                                      prim:
                                                                                        'address',
                                                                                    },
                                                                                    { prim: 'nat' },
                                                                                  ],
                                                                                },
                                                                              ],
                                                                            ],
                                                                          },
                                                                          { prim: 'PAIR' },
                                                                          { prim: 'SOME' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                  ],
                                                                  [
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DUP' }]],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'CDR' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          { prim: 'CAR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    { prim: 'ADD' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'CDR' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'CAR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DROP' }]],
                                                                    },
                                                                    { prim: 'PAIR' },
                                                                    { prim: 'SOME' },
                                                                  ],
                                                                ],
                                                              },
                                                              { prim: 'SWAP' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          { prim: 'CAR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                  ],
                                                                ],
                                                              },
                                                              { prim: 'DUP' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    { prim: 'CAR' },
                                                                    { prim: 'UPDATE' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'CDR' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'CAR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DROP' }]],
                                                                    },
                                                                    { prim: 'PAIR' },
                                                                  ],
                                                                ],
                                                              },
                                                              { prim: 'DUP' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    { prim: 'CDR' },
                                                                    { prim: 'INT' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          { prim: 'CDR' },
                                                                          { prim: 'DUP' },
                                                                          { prim: 'CDR' },
                                                                          { prim: 'CDR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    { prim: 'ADD' },
                                                                    { prim: 'ISNAT' },
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
                                                                                  'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger.hs:313:27 in lorentz-contracts-0.2.0.1-HpDIkWsKofu3zAjntLgs8J:Lorentz.Contracts.ManagedLedger',
                                                                              },
                                                                            ],
                                                                          },
                                                                          { prim: 'FAILWITH' },
                                                                        ],
                                                                        [],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'CAR' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'CDR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'CAR' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'CDR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DROP' }]],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'PAIR' },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'PAIR' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'CAR' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'CDR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DROP' }]],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'PAIR' },
                                                                  ],
                                                                ],
                                                              },
                                                              { prim: 'DROP' },
                                                              {
                                                                prim: 'NIL',
                                                                args: [{ prim: 'operation' }],
                                                              },
                                                              { prim: 'PAIR' },
                                                            ],
                                                            [
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    { prim: 'DUP' },
                                                                    { prim: 'CDR' },
                                                                    { prim: 'CAR' },
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
                                                                              {
                                                                                prim: 'pair',
                                                                                args: [
                                                                                  {
                                                                                    prim: 'string',
                                                                                  },
                                                                                  { prim: 'unit' },
                                                                                ],
                                                                              },
                                                                              {
                                                                                prim: 'Pair',
                                                                                args: [
                                                                                  {
                                                                                    string:
                                                                                      'SenderIsNotAdmin',
                                                                                  },
                                                                                  { prim: 'Unit' },
                                                                                ],
                                                                              },
                                                                            ],
                                                                          },
                                                                          { prim: 'FAILWITH' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                  ],
                                                                ],
                                                              },
                                                              {
                                                                prim: 'DIP',
                                                                args: [[{ prim: 'DUP' }]],
                                                              },
                                                              { prim: 'SWAP' },
                                                              { prim: 'CAR' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [[{ prim: 'DUP' }]],
                                                              },
                                                              { prim: 'SWAP' },
                                                              { prim: 'CAR' },
                                                              { prim: 'GET' },
                                                              {
                                                                prim: 'IF_NONE',
                                                                args: [
                                                                  [
                                                                    { prim: 'CDR' },
                                                                    {
                                                                      prim: 'PUSH',
                                                                      args: [
                                                                        { prim: 'nat' },
                                                                        { int: '0' },
                                                                      ],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'PAIR' },
                                                                    {
                                                                      prim: 'PUSH',
                                                                      args: [
                                                                        { prim: 'string' },
                                                                        {
                                                                          string:
                                                                            'NotEnoughBalance',
                                                                        },
                                                                      ],
                                                                    },
                                                                    { prim: 'PAIR' },
                                                                    { prim: 'FAILWITH' },
                                                                  ],
                                                                  [],
                                                                ],
                                                              },
                                                              { prim: 'DUP' },
                                                              { prim: 'CAR' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DUP' }]],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                  ],
                                                                ],
                                                              },
                                                              { prim: 'SWAP' },
                                                              { prim: 'CDR' },
                                                              { prim: 'SWAP' },
                                                              { prim: 'SUB' },
                                                              { prim: 'ISNAT' },
                                                              {
                                                                prim: 'IF_NONE',
                                                                args: [
                                                                  [
                                                                    { prim: 'CAR' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DUP' }]],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'CDR' },
                                                                    { prim: 'PAIR' },
                                                                    {
                                                                      prim: 'PUSH',
                                                                      args: [
                                                                        { prim: 'string' },
                                                                        {
                                                                          string:
                                                                            'NotEnoughBalance',
                                                                        },
                                                                      ],
                                                                    },
                                                                    { prim: 'PAIR' },
                                                                    { prim: 'FAILWITH' },
                                                                  ],
                                                                  [],
                                                                ],
                                                              },
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    { prim: 'DUP' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'CDR' }]],
                                                                    },
                                                                    { prim: 'CAR' },
                                                                  ],
                                                                ],
                                                              },
                                                              {
                                                                prim: 'DIP',
                                                                args: [[{ prim: 'DROP' }]],
                                                              },
                                                              { prim: 'PAIR' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [[{ prim: 'DUP' }]],
                                                              },
                                                              { prim: 'SWAP' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    { prim: 'DUP' },
                                                                    { prim: 'CAR' },
                                                                    { prim: 'INT' },
                                                                    { prim: 'EQ' },
                                                                    {
                                                                      prim: 'IF',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          { prim: 'CDR' },
                                                                          { prim: 'SIZE' },
                                                                          { prim: 'INT' },
                                                                          { prim: 'EQ' },
                                                                          {
                                                                            prim: 'IF',
                                                                            args: [
                                                                              [
                                                                                { prim: 'DROP' },
                                                                                {
                                                                                  prim: 'NONE',
                                                                                  args: [
                                                                                    {
                                                                                      prim: 'pair',
                                                                                      args: [
                                                                                        {
                                                                                          prim:
                                                                                            'nat',
                                                                                        },
                                                                                        {
                                                                                          prim:
                                                                                            'map',
                                                                                          args: [
                                                                                            {
                                                                                              prim:
                                                                                                'address',
                                                                                            },
                                                                                            {
                                                                                              prim:
                                                                                                'nat',
                                                                                            },
                                                                                          ],
                                                                                        },
                                                                                      ],
                                                                                    },
                                                                                  ],
                                                                                },
                                                                              ],
                                                                              [{ prim: 'SOME' }],
                                                                            ],
                                                                          },
                                                                        ],
                                                                        [{ prim: 'SOME' }],
                                                                      ],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'CAR' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [
                                                                                { prim: 'DUP' },
                                                                                { prim: 'CAR' },
                                                                              ],
                                                                            ],
                                                                          },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    { prim: 'UPDATE' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'CDR' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'CAR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DROP' }]],
                                                                    },
                                                                    { prim: 'PAIR' },
                                                                  ],
                                                                ],
                                                              },
                                                              { prim: 'DUP' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    { prim: 'CDR' },
                                                                    { prim: 'NEG' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          { prim: 'CDR' },
                                                                          { prim: 'DUP' },
                                                                          { prim: 'CDR' },
                                                                          { prim: 'CDR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    { prim: 'ADD' },
                                                                    { prim: 'ISNAT' },
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
                                                                                  'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger.hs:313:27 in lorentz-contracts-0.2.0.1-HpDIkWsKofu3zAjntLgs8J:Lorentz.Contracts.ManagedLedger',
                                                                              },
                                                                            ],
                                                                          },
                                                                          { prim: 'FAILWITH' },
                                                                        ],
                                                                        [],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'CAR' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'CDR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'CAR' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'CDR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DROP' }]],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'PAIR' },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'PAIR' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          { prim: 'DUP' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'CAR' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'CDR' },
                                                                        ],
                                                                      ],
                                                                    },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DROP' }]],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'PAIR' },
                                                                  ],
                                                                ],
                                                              },
                                                              { prim: 'DROP' },
                                                              {
                                                                prim: 'NIL',
                                                                args: [{ prim: 'operation' }],
                                                              },
                                                              { prim: 'PAIR' },
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
];
export const tokenInit = (k: string): MichelsonData => ({
  prim: 'Pair',
  args: [
    [],
    {
      prim: 'Pair',
      args: [{ string: k }, { prim: 'Pair', args: [{ prim: 'False' }, { int: '200' }] }],
    },
  ],
});
