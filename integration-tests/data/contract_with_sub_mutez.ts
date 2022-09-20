export const submutezStorage = {
  prim: 'Pair',
  args: [
    [
      {
        prim: 'Elt',
        args: [
          { string: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys' },
          { prim: 'Pair', args: [{ string: '2019-10-25T17:00:54Z' }, { int: '5000000' }] },
        ],
      },
    ],
    { int: '0' },
  ],
};
export const submutezCode = [
  {
    prim: 'parameter',
    args: [
      {
        prim: 'or',
        args: [
          { prim: 'unit', annots: ['%deposit'] },
          { prim: 'unit', annots: ['%withdraw'] },
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
            prim: 'map',
            args: [
              { prim: 'address' },
              {
                prim: 'pair',
                args: [
                  { prim: 'timestamp', annots: ['%blockTimestamp'] },
                  { prim: 'mutez', annots: ['%tezAmount'] },
                ],
              },
            ],
            annots: ['%deposits'],
          },
          { prim: 'mutez', annots: ['%liquidity'] },
        ],
      },
    ],
  },
  {
    prim: 'code',
    args: [
      [
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        { prim: 'DUP' },
        {
          prim: 'LAMBDA',
          args: [
            { prim: 'bool' },
            { prim: 'address' },
            [
              { prim: 'DUP' },
              { prim: 'SENDER' },
              { prim: 'SWAP' },
              {
                prim: 'IF',
                args: [
                  [
                    { prim: 'DROP' },
                    {
                      prim: 'PUSH',
                      args: [
                        { prim: 'address' },
                        { string: 'tz1MZ4GPjAA2gZxKTozJt8Cu5Gvu6WU2ikZ4' },
                      ],
                    },
                    { prim: 'PUSH', args: [{ prim: 'unit' }, { prim: 'Unit' }] },
                  ],
                  [{ prim: 'PUSH', args: [{ prim: 'unit' }, { prim: 'Unit' }] }],
                ],
              },
              { prim: 'DROP' },
              { prim: 'SWAP' },
              { prim: 'DROP' },
            ],
          ],
        },
        { prim: 'DUP' },
        { prim: 'DIP', args: [[{ prim: 'PAIR' }]] },
        { prim: 'SWAP' },
        {
          prim: 'LAMBDA',
          args: [
            { prim: 'int' },
            { prim: 'mutez' },
            [
              { prim: 'DUP' },
              { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
              { prim: 'SWAP' },
              { prim: 'PUSH', args: [{ prim: 'int' }, { int: '100' }] },
              { prim: 'SWAP' },
              { prim: 'COMPARE' },
              { prim: 'GE' },
              {
                prim: 'IF',
                args: [
                  [
                    { prim: 'DROP' },
                    { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '1000000' }] },
                    { prim: 'PUSH', args: [{ prim: 'unit' }, { prim: 'Unit' }] },
                  ],
                  [{ prim: 'PUSH', args: [{ prim: 'unit' }, { prim: 'Unit' }] }],
                ],
              },
              { prim: 'DROP' },
              { prim: 'SWAP' },
              { prim: 'DROP' },
            ],
          ],
        },
        { prim: 'DUP' },
        { prim: 'DIP', args: [[{ prim: 'PAIR' }]] },
        { prim: 'SWAP' },
        {
          prim: 'LAMBDA',
          args: [
            {
              prim: 'pair',
              args: [
                {
                  prim: 'pair',
                  args: [
                    {
                      prim: 'map',
                      args: [
                        { prim: 'address' },
                        { prim: 'pair', args: [{ prim: 'timestamp' }, { prim: 'mutez' }] },
                      ],
                    },
                    { prim: 'mutez' },
                  ],
                },
                {
                  prim: 'pair',
                  args: [
                    { prim: 'lambda', args: [{ prim: 'int' }, { prim: 'mutez' }] },
                    {
                      prim: 'pair',
                      args: [
                        { prim: 'lambda', args: [{ prim: 'bool' }, { prim: 'address' }] },
                        { prim: 'list', args: [{ prim: 'operation' }] },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              prim: 'pair',
              args: [
                { prim: 'list', args: [{ prim: 'operation' }] },
                {
                  prim: 'pair',
                  args: [
                    {
                      prim: 'map',
                      args: [
                        { prim: 'address' },
                        { prim: 'pair', args: [{ prim: 'timestamp' }, { prim: 'mutez' }] },
                      ],
                    },
                    { prim: 'mutez' },
                  ],
                },
              ],
            },
            [
              { prim: 'DUP' },
              { prim: 'CDR' },
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
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DUP' }, { prim: 'CDR' }, { prim: 'SWAP' }, { prim: 'CAR' }]],
                    },
                  ],
                ],
              },
              { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
              { prim: 'AMOUNT' },
              { prim: 'COMPARE' },
              { prim: 'EQ' },
              {
                prim: 'IF',
                args: [
                  [
                    { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'No tez transferred!' }] },
                    { prim: 'FAILWITH' },
                  ],
                  [
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                    },
                    { prim: 'SWAP' },
                    { prim: 'PUSH', args: [{ prim: 'bool' }, { prim: 'False' }] },
                    { prim: 'EXEC' },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' },
                    { prim: 'CAR' },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'GET' },
                    { prim: 'DUP' },
                    {
                      prim: 'IF_NONE',
                      args: [
                        [
                          {
                            prim: 'DIP',
                            args: [
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
                                  ],
                                },
                                { prim: 'SWAP' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                          { prim: 'CDR' },
                          { prim: 'AMOUNT' },
                          { prim: 'ADD' },
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
                                { prim: 'CAR' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                          { prim: 'PAIR' },
                          { prim: 'SWAP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'SWAP' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'SWAP' },
                                      { prim: 'DIP', args: [[{ prim: 'SWAP' }, { prim: 'DROP' }]] },
                                    ],
                                  ],
                                },
                              ],
                            ],
                          },
                          { prim: 'AMOUNT' },
                          { prim: 'NOW' },
                          { prim: 'PAIR' },
                          { prim: 'DUP' },
                          { prim: 'SOME' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
                                  ],
                                },
                                { prim: 'SWAP' },
                              ],
                            ],
                          },
                          { prim: 'SENDER' },
                          { prim: 'UPDATE' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
                                  ],
                                },
                                { prim: 'SWAP' },
                                { prim: 'DROP' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'SWAP' },
                                {
                                  prim: 'DIP',
                                  args: [[{ prim: 'SWAP' }, { prim: 'DROP' }, { prim: 'DUP' }]],
                                },
                                { prim: 'SWAP' },
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
                                    ],
                                  ],
                                },
                                { prim: 'SWAP' },
                                { prim: 'CDR' },
                              ],
                            ],
                          },
                          { prim: 'PAIR' },
                          { prim: 'SWAP' },
                          { prim: 'DROP' },
                          { prim: 'SWAP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'SWAP' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'SWAP' },
                                      { prim: 'DIP', args: [[{ prim: 'SWAP' }, { prim: 'DROP' }]] },
                                    ],
                                  ],
                                },
                              ],
                            ],
                          },
                          { prim: 'PUSH', args: [{ prim: 'unit' }, { prim: 'Unit' }] },
                        ],
                        [
                          { prim: 'DUP' },
                          { prim: 'CAR' },
                          { prim: 'NOW' },
                          { prim: 'SUB' },
                          { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                          { prim: 'SWAP' },
                          { prim: 'CDR' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
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
                                                            ],
                                                          ],
                                                        },
                                                        { prim: 'SWAP' },
                                                      ],
                                                    ],
                                                  },
                                                  { prim: 'SWAP' },
                                                ],
                                              ],
                                            },
                                            { prim: 'SWAP' },
                                          ],
                                        ],
                                      },
                                      { prim: 'SWAP' },
                                    ],
                                  ],
                                },
                                { prim: 'EXEC' },
                              ],
                            ],
                          },
                          { prim: 'ADD' },
                          { prim: 'AMOUNT' },
                          { prim: 'ADD' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                { prim: 'SWAP' },
                                { prim: 'CAR' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                          { prim: 'PAIR' },
                          { prim: 'SWAP' },
                          {
                            prim: 'DIP',
                            args: [[{ prim: 'SWAP' }, { prim: 'DROP' }, { prim: 'DUP' }]],
                          },
                          { prim: 'SWAP' },
                          { prim: 'CDR' },
                          { prim: 'NOW' },
                          { prim: 'PAIR' },
                          { prim: 'SWAP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'DROP' },
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
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                { prim: 'SWAP' },
                                { prim: 'SOME' },
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
                                { prim: 'DROP' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'SWAP' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'SWAP' },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [{ prim: 'SWAP' }, { prim: 'DROP' }, { prim: 'DUP' }],
                                        ],
                                      },
                                      { prim: 'SWAP' },
                                    ],
                                  ],
                                },
                                { prim: 'SWAP' },
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
                                          ],
                                        ],
                                      },
                                      { prim: 'SWAP' },
                                    ],
                                  ],
                                },
                                { prim: 'SWAP' },
                                { prim: 'CDR' },
                              ],
                            ],
                          },
                          { prim: 'PAIR' },
                          { prim: 'SWAP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'SWAP' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'SWAP' },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            { prim: 'SWAP' },
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  { prim: 'SWAP' },
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        { prim: 'SWAP' },
                                                        { prim: 'DROP' },
                                                        { prim: 'DUP' },
                                                      ],
                                                    ],
                                                  },
                                                  { prim: 'SWAP' },
                                                ],
                                              ],
                                            },
                                            { prim: 'SWAP' },
                                          ],
                                        ],
                                      },
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
                          { prim: 'AMOUNT' },
                          { prim: 'ADD' },
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
                                          ],
                                        ],
                                      },
                                      { prim: 'SWAP' },
                                    ],
                                  ],
                                },
                                { prim: 'SWAP' },
                                { prim: 'CAR' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                          { prim: 'PAIR' },
                          { prim: 'SWAP' },
                          { prim: 'DROP' },
                          { prim: 'SWAP' },
                          { prim: 'DROP' },
                          [
                            { prim: 'SWAP' },
                            {
                              prim: 'DIP',
                              args: [
                                [
                                  { prim: 'SWAP' },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        { prim: 'SWAP' },
                                        {
                                          prim: 'DIP',
                                          args: [[{ prim: 'SWAP' }, { prim: 'DROP' }]],
                                        },
                                      ],
                                    ],
                                  },
                                ],
                              ],
                            },
                          ],
                          { prim: 'PUSH', args: [{ prim: 'unit' }, { prim: 'Unit' }] },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                    { prim: 'DROP' },
                    { prim: 'SWAP' },
                    { prim: 'DROP' },
                    { prim: 'SWAP' },
                    { prim: 'DROP' },
                  ],
                ],
              },
              { prim: 'DROP' },
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
              { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
              { prim: 'PAIR' },
              {
                prim: 'DIP',
                args: [[{ prim: 'DROP' }, { prim: 'DROP' }, { prim: 'DROP' }, { prim: 'DROP' }]],
              },
            ],
          ],
        },
        { prim: 'PAIR' },
        {
          prim: 'DIP',
          args: [
            [
              { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
              { prim: 'DUP' },
              { prim: 'DIP', args: [[{ prim: 'PAIR' }]] },
              { prim: 'SWAP' },
            ],
          ],
        },
        { prim: 'SWAP' },
        {
          prim: 'LAMBDA',
          args: [
            {
              prim: 'pair',
              args: [
                {
                  prim: 'pair',
                  args: [
                    {
                      prim: 'map',
                      args: [
                        { prim: 'address' },
                        { prim: 'pair', args: [{ prim: 'timestamp' }, { prim: 'mutez' }] },
                      ],
                    },
                    { prim: 'mutez' },
                  ],
                },
                {
                  prim: 'pair',
                  args: [
                    { prim: 'lambda', args: [{ prim: 'int' }, { prim: 'mutez' }] },
                    { prim: 'lambda', args: [{ prim: 'bool' }, { prim: 'address' }] },
                  ],
                },
              ],
            },
            {
              prim: 'pair',
              args: [
                { prim: 'list', args: [{ prim: 'operation' }] },
                {
                  prim: 'pair',
                  args: [
                    {
                      prim: 'map',
                      args: [
                        { prim: 'address' },
                        { prim: 'pair', args: [{ prim: 'timestamp' }, { prim: 'mutez' }] },
                      ],
                    },
                    { prim: 'mutez' },
                  ],
                },
              ],
            },
            [
              { prim: 'DUP' },
              { prim: 'CDR' },
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
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'SWAP' },
                  ],
                ],
              },
              { prim: 'SWAP' },
              { prim: 'PUSH', args: [{ prim: 'bool' }, { prim: 'False' }] },
              { prim: 'EXEC' },
              { prim: 'DUP' },
              { prim: 'NIL', args: [{ prim: 'operation' }] },
              { prim: 'SWAP' },
              {
                prim: 'DIP',
                args: [
                  [
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                    },
                    { prim: 'SWAP' },
                    { prim: 'CAR' },
                  ],
                ],
              },
              { prim: 'GET' },
              {
                prim: 'IF_NONE',
                args: [
                  [
                    { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'GET_FORCE' }] },
                    { prim: 'FAILWITH' },
                  ],
                  [],
                ],
              },
              { prim: 'DUP' },
              { prim: 'CAR' },
              { prim: 'NOW' },
              { prim: 'SUB' },
              { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
              { prim: 'SWAP' },
              { prim: 'CDR' },
              {
                prim: 'DIP',
                args: [
                  [
                    { prim: 'DUP' },
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
                                    ],
                                  ],
                                },
                                { prim: 'SWAP' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                    },
                    { prim: 'EXEC' },
                  ],
                ],
              },
              { prim: 'ADD' },
              { prim: 'DUP' },
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
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                    { prim: 'CDR' },
                  ],
                ],
              },
              { prim: 'COMPARE' },
              { prim: 'GT' },
              {
                prim: 'IF',
                args: [
                  [
                    { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'No tez to withdraw!' }] },
                    { prim: 'FAILWITH' },
                  ],
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
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                        ],
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
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'DUP' },
                          {
                            prim: 'NONE',
                            args: [
                              { prim: 'pair', args: [{ prim: 'timestamp' }, { prim: 'mutez' }] },
                            ],
                          },
                        ],
                      ],
                    },
                    { prim: 'UPDATE' },
                    { prim: 'SWAP' },
                    { prim: 'DROP' },
                    { prim: 'DUP' },
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
                                          ],
                                        ],
                                      },
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
                        ],
                      ],
                    },
                    { prim: 'PAIR' },
                    { prim: 'SWAP' },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'SWAP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'SWAP' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'SWAP' },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            { prim: 'SWAP' },
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  { prim: 'SWAP' },
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        { prim: 'SWAP' },
                                                        { prim: 'DROP' },
                                                        { prim: 'DUP' },
                                                      ],
                                                    ],
                                                  },
                                                  { prim: 'SWAP' },
                                                ],
                                              ],
                                            },
                                            { prim: 'SWAP' },
                                          ],
                                        ],
                                      },
                                      { prim: 'SWAP' },
                                    ],
                                  ],
                                },
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
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                    },
                    { prim: 'SUB_MUTEZ' },
                    [
                      {
                        prim: 'IF_NONE',
                        args: [
                          [
                            [
                              {
                                prim: 'UNIT',
                              },
                              {
                                prim: 'FAILWITH',
                              },
                            ],
                          ],
                          [],
                        ],
                      },
                    ],
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
                                          ],
                                        ],
                                      },
                                      { prim: 'SWAP' },
                                    ],
                                  ],
                                },
                                { prim: 'SWAP' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                          { prim: 'CAR' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                    { prim: 'PAIR' },
                    { prim: 'SWAP' },
                    {
                      prim: 'DIP',
                      args: [
                        [
                          { prim: 'SWAP' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'SWAP' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'SWAP' },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            { prim: 'SWAP' },
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  { prim: 'SWAP' },
                                                  {
                                                    prim: 'DIP',
                                                    args: [[{ prim: 'SWAP' }, { prim: 'DROP' }]],
                                                  },
                                                  { prim: 'DUP' },
                                                ],
                                              ],
                                            },
                                            { prim: 'SWAP' },
                                          ],
                                        ],
                                      },
                                      { prim: 'SWAP' },
                                    ],
                                  ],
                                },
                                { prim: 'SWAP' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                    { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
                    {
                      prim: 'IF_NONE',
                      args: [
                        [
                          {
                            prim: 'PUSH',
                            args: [{ prim: 'string' }, { string: 'bad address for get_contract' }],
                          },
                          { prim: 'FAILWITH' },
                        ],
                        [],
                      ],
                    },
                    {
                      prim: 'DIP',
                      args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                    },
                    { prim: 'SWAP' },
                    { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                    { prim: 'UNIT' },
                    { prim: 'TRANSFER_TOKENS' },
                    { prim: 'DUP' },
                    { prim: 'NIL', args: [{ prim: 'operation' }] },
                    { prim: 'SWAP' },
                    { prim: 'CONS' },
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
                                          ],
                                        ],
                                      },
                                      { prim: 'SWAP' },
                                    ],
                                  ],
                                },
                                { prim: 'SWAP' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                          { prim: 'DROP' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                    { prim: 'DROP' },
                    { prim: 'SWAP' },
                    { prim: 'DROP' },
                    [
                      { prim: 'SWAP' },
                      {
                        prim: 'DIP',
                        args: [
                          [
                            { prim: 'SWAP' },
                            {
                              prim: 'DIP',
                              args: [
                                [
                                  { prim: 'SWAP' },
                                  {
                                    prim: 'DIP',
                                    args: [
                                      [
                                        { prim: 'SWAP' },
                                        {
                                          prim: 'DIP',
                                          args: [[{ prim: 'SWAP' }, { prim: 'DROP' }]],
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
                    { prim: 'DROP' },
                    { prim: 'PUSH', args: [{ prim: 'unit' }, { prim: 'Unit' }] },
                  ],
                ],
              },
              { prim: 'DROP' },
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
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                  ],
                ],
              },
              { prim: 'PAIR' },
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
                  ],
                ],
              },
            ],
          ],
        },
        { prim: 'PAIR' },
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
                            args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                  ],
                ],
              },
              { prim: 'SWAP' },
            ],
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
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
                                  ],
                                },
                                { prim: 'SWAP' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                    },
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
        { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
        { prim: 'SWAP' },
        {
          prim: 'IF_LEFT',
          args: [
            [
              { prim: 'DUP' },
              {
                prim: 'DIP',
                args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
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
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                    { prim: 'DUP' },
                    { prim: 'CDR' },
                    { prim: 'SWAP' },
                    { prim: 'CAR' },
                    { prim: 'SWAP' },
                  ],
                ],
              },
              { prim: 'PAIR' },
              { prim: 'EXEC' },
              { prim: 'SWAP' },
              { prim: 'DROP' },
              { prim: 'SWAP' },
              { prim: 'DROP' },
            ],
            [
              { prim: 'DUP' },
              {
                prim: 'DIP',
                args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
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
                          {
                            prim: 'DIP',
                            args: [
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
                                  ],
                                },
                                { prim: 'SWAP' },
                              ],
                            ],
                          },
                          { prim: 'SWAP' },
                        ],
                      ],
                    },
                    { prim: 'SWAP' },
                    { prim: 'DUP' },
                    { prim: 'CDR' },
                    { prim: 'SWAP' },
                    { prim: 'CAR' },
                    { prim: 'SWAP' },
                  ],
                ],
              },
              { prim: 'PAIR' },
              { prim: 'EXEC' },
              { prim: 'SWAP' },
              { prim: 'DROP' },
              { prim: 'SWAP' },
              { prim: 'DROP' },
            ],
          ],
        },
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
            ],
          ],
        },
      ],
    ],
  },
];
