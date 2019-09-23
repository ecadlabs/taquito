export const sampleStorage = {
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
export const sample = {
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

export const sampleBigMapValue = {
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

export const miSample = [
  { prim: 'parameter', args: [{ prim: 'int', args: [] }] },
  {
    prim: 'storage',
    args: [{ prim: 'pair', args: [{ prim: 'int', args: [] }, { prim: 'address', args: [] }] }],
  },
  {
    prim: 'code',
    args: [
      [
        { prim: 'PUSH', args: [{ prim: 'mutez', args: [] }, { int: '1000000' }] },
        { prim: 'AMOUNT', args: [] },
        { prim: 'IFCMPGE', args: [[]] },
        {
          prim: '',
          args: [
            [
              {
                prim: 'PUSH',
                args: [{ prim: 'string', args: [] }, { string: 'You did not provide enough tez.' }],
              },
              { prim: 'FAILWITH', args: [] },
            ],
          ],
        },
        { prim: 'UNPAIR', args: [] },
        { prim: 'SWAP', args: [] },
        { prim: 'DUP', args: [] },
        { prim: 'CAR', args: [] },
        {
          prim: '# int : storage : parameter : []\n       DIP',
          args: [[{ prim: 'PUSH', args: [{ prim: 'int', args: [] }, { int: '15' }] }]],
        },
        {
          prim: 'IFCMPLT',
          args: [
            [
              { prim: 'SWAP', args: [] },
              { prim: 'PUSH', args: [{ prim: 'int', args: [] }, { int: '34' }] },
              {
                prim: 'IFCMPEQ',
                args: [
                  [
                    { prim: 'SENDER', args: [] },
                    { prim: 'CONTRACT', args: [{ prim: 'unit', args: [] }] },
                    { prim: 'IF_SOME', args: [[]] },
                    { prim: '', args: [[{ prim: 'FAILWITH', args: [] }]] },
                    { prim: 'BALANCE', args: [] },
                    { prim: 'UNIT', args: [] },
                    { prim: 'TRANSFER_TOKENS', args: [] },
                    { prim: 'NIL', args: [{ prim: 'operation', args: [] }] },
                    { prim: 'SWAP', args: [] },
                    { prim: 'CONS', args: [] },
                    { prim: 'PAIR', args: [] },
                  ],
                ],
              },
              {
                prim: '',
                args: [
                  [
                    { prim: 'UNPAIR', args: [] },
                    { prim: 'PUSH', args: [{ prim: 'int', args: [] }, { int: '1' }] },
                    { prim: 'ADD', args: [] },
                    { prim: 'PAIR', args: [] },
                    { prim: 'NIL', args: [{ prim: 'operation', args: [] }] },
                    { prim: 'PAIR', args: [] },
                  ],
                ],
              },
            ],
          ],
        },
        {
          prim: '',
          args: [
            [
              {
                prim:
                  '# attempts exceeded, give winnings to the specified address\n                 DIP',
                args: [[{ prim: 'DROP', args: [] }]],
              },
              { prim: 'DUP', args: [] },
              { prim: 'CDR', args: [] },
              { prim: 'CONTRACT', args: [{ prim: 'unit', args: [] }] },
              { prim: 'IF_SOME', args: [[]] },
              { prim: '', args: [[{ prim: 'FAILWITH', args: [] }]] },
              { prim: 'BALANCE', args: [] },
              { prim: 'UNIT', args: [] },
              { prim: 'TRANSFER_TOKENS', args: [] },
              { prim: 'NIL', args: [{ prim: 'operation', args: [] }] },
              { prim: 'SWAP', args: [] },
              { prim: 'CONS', args: [] },
              { prim: 'PAIR', args: [] },
            ],
          ],
        },
      ],
    ],
  },
];

export const ligoSample = [
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
