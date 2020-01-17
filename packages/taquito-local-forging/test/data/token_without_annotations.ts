export const noAnnotCode = [
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
                      { prim: 'address' },
                      { prim: 'pair', args: [{ prim: 'address' }, { prim: 'nat' }] },
                    ],
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
                              { prim: 'pair', args: [{ prim: 'address' }, { prim: 'nat' }] },
                            ],
                          },
                        ],
                      },
                      { prim: 'pair', args: [{ prim: 'address' }, { prim: 'nat' }] },
                    ],
                  },
                ],
              },
              {
                prim: 'or',
                args: [
                  {
                    prim: 'pair',
                    args: [
                      { prim: 'address' },
                      { prim: 'pair', args: [{ prim: 'address' }, { prim: 'nat' }] },
                    ],
                  },
                  {
                    prim: 'or',
                    args: [
                      {
                        prim: 'pair',
                        args: [
                          { prim: 'pair', args: [{ prim: 'address' }, { prim: 'address' }] },
                          { prim: 'contract', args: [{ prim: 'nat' }] },
                        ],
                      },
                      {
                        prim: 'pair',
                        args: [{ prim: 'address' }, { prim: 'contract', args: [{ prim: 'nat' }] }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            prim: 'or',
            args: [
              {
                prim: 'or',
                args: [
                  {
                    prim: 'pair',
                    args: [{ prim: 'unit' }, { prim: 'contract', args: [{ prim: 'nat' }] }],
                  },
                  { prim: 'or', args: [{ prim: 'bool' }, { prim: 'address' }] },
                ],
              },
              {
                prim: 'or',
                args: [
                  {
                    prim: 'or',
                    args: [
                      {
                        prim: 'pair',
                        args: [{ prim: 'unit' }, { prim: 'contract', args: [{ prim: 'address' }] }],
                      },
                      { prim: 'pair', args: [{ prim: 'address' }, { prim: 'nat' }] },
                    ],
                  },
                  {
                    prim: 'or',
                    args: [
                      { prim: 'pair', args: [{ prim: 'address' }, { prim: 'nat' }] },
                      { prim: 'address' },
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
              { prim: 'pair', args: [{ prim: 'address' }, { prim: 'bool' }] },
              {
                prim: 'pair',
                args: [
                  { prim: 'nat' },
                  { prim: 'or', args: [{ prim: 'address' }, { prim: 'address' }] },
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
        { prim: 'DUP' },
        { prim: 'CAR' },
        { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
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
                          { prim: 'SENDER' },
                          { prim: 'PAIR' },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'CDR' },
                                { prim: 'CAR' },
                                { prim: 'CDR' },
                                {
                                  prim: 'IF',
                                  args: [
                                    [
                                      {
                                        prim: 'PUSH',
                                        args: [
                                          {
                                            prim: 'pair',
                                            args: [{ prim: 'string' }, { prim: 'unit' }],
                                          },
                                          {
                                            prim: 'Pair',
                                            args: [
                                              { string: 'OperationsArePaused' },
                                              { prim: 'Unit' },
                                            ],
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
                          { prim: 'DUP' },
                          { prim: 'CDR' },
                          { prim: 'CAR' },
                          { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                          { prim: 'COMPARE' },
                          { prim: 'EQ' },
                          {
                            prim: 'IF',
                            args: [
                              [{ prim: 'DROP' }],
                              [
                                { prim: 'DUP' },
                                { prim: 'CAR' },
                                { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] },
                                { prim: 'SWAP' },
                                { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                { prim: 'COMPARE' },
                                { prim: 'EQ' },
                                {
                                  prim: 'IF',
                                  args: [
                                    [{ prim: 'DROP' }],
                                    [
                                      { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                      { prim: 'SWAP' },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                            { prim: 'SWAP' },
                                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
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
                                                                args: [[{ prim: 'DUP' }]],
                                                              },
                                                            ],
                                                          ],
                                                        },
                                                        { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                                        { prim: 'PAIR' },
                                                        { prim: 'DUP' },
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              { prim: 'CDR' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [[{ prim: 'CAR' }]],
                                                              },
                                                              { prim: 'GET' },
                                                              {
                                                                prim: 'IF_NONE',
                                                                args: [
                                                                  [
                                                                    {
                                                                      prim: 'EMPTY_MAP',
                                                                      args: [
                                                                        { prim: 'address' },
                                                                        { prim: 'nat' },
                                                                      ],
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
                                                            [
                                                              {
                                                                prim: 'PUSH',
                                                                args: [
                                                                  { prim: 'nat' },
                                                                  { int: '0' },
                                                                ],
                                                              },
                                                            ],
                                                            [],
                                                          ],
                                                        },
                                                      ],
                                                    ],
                                                  },
                                                ],
                                              ],
                                            },
                                            {
                                              prim: 'DIP',
                                              args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
                                            },
                                            { prim: 'SWAP' },
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
                                                              { prim: 'DUP' },
                                                              { prim: 'CDR' },
                                                              { prim: 'CDR' },
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
                                                              { prim: 'SUB' },
                                                              { prim: 'ISNAT' },
                                                              {
                                                                prim: 'IF_NONE',
                                                                args: [
                                                                  [
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DUP' }]],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'DUP' }]],
                                                                    },
                                                                    { prim: 'SWAP' },
                                                                    { prim: 'CDR' },
                                                                    { prim: 'CDR' },
                                                                    { prim: 'PAIR' },
                                                                    {
                                                                      prim: 'PUSH',
                                                                      args: [
                                                                        { prim: 'string' },
                                                                        {
                                                                          string:
                                                                            'NotEnoughAllowance',
                                                                        },
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
                                                        { prim: 'SWAP' },
                                                      ],
                                                    ],
                                                  },
                                                  { prim: 'PAIR' },
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
                                                ],
                                              ],
                                            },
                                            {
                                              prim: 'DIP',
                                              args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
                                            },
                                            { prim: 'SWAP' },
                                            {
                                              prim: 'DIP',
                                              args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
                                            },
                                            { prim: 'SWAP' },
                                            { prim: 'GET' },
                                            {
                                              prim: 'IF_NONE',
                                              args: [
                                                [
                                                  {
                                                    prim: 'PUSH',
                                                    args: [{ prim: 'nat' }, { int: '0' }],
                                                  },
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        {
                                                          prim: 'EMPTY_MAP',
                                                          args: [
                                                            { prim: 'address' },
                                                            { prim: 'nat' },
                                                          ],
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
                                                [
                                                  { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                                  { prim: 'SWAP' },
                                                ],
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
                                                [
                                                  { prim: 'DROP' },
                                                  { prim: 'NONE', args: [{ prim: 'nat' }] },
                                                ],
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
                                                [
                                                  {
                                                    prim: 'DIP',
                                                    args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
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
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] }],
                                  ],
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
                                            { prim: 'CAR' },
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
                                                    'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger/Impl.hs:158:27 in lorentz-contracts-0.2.0.1.2-CWNYAYQdqCJAhKtTd1tWlU:Lorentz.Contracts.ManagedLedger.Impl',
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
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
                                  ],
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
                                                            args: [
                                                              { prim: 'address' },
                                                              { prim: 'nat' },
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
                                              args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
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
                                            { prim: 'CAR' },
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
                                                    'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger/Impl.hs:158:27 in lorentz-contracts-0.2.0.1.2-CWNYAYQdqCJAhKtTd1tWlU:Lorentz.Contracts.ManagedLedger.Impl',
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
                                      { prim: 'CDR' },
                                      {
                                        prim: 'IF_LEFT',
                                        args: [
                                          [
                                            {
                                              prim: 'PUSH',
                                              args: [
                                                {
                                                  prim: 'pair',
                                                  args: [{ prim: 'string' }, { prim: 'unit' }],
                                                },
                                                {
                                                  prim: 'Pair',
                                                  args: [
                                                    { string: 'ProxyIsNotSet' },
                                                    { prim: 'Unit' },
                                                  ],
                                                },
                                              ],
                                            },
                                            { prim: 'FAILWITH' },
                                          ],
                                          [
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
                                                          { string: 'CallerIsNotProxy' },
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
                                    ],
                                  ],
                                },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'DUP' },
                                      { prim: 'CDR' },
                                      { prim: 'CAR' },
                                      { prim: 'CDR' },
                                      {
                                        prim: 'IF',
                                        args: [
                                          [
                                            {
                                              prim: 'PUSH',
                                              args: [
                                                {
                                                  prim: 'pair',
                                                  args: [{ prim: 'string' }, { prim: 'unit' }],
                                                },
                                                {
                                                  prim: 'Pair',
                                                  args: [
                                                    { string: 'OperationsArePaused' },
                                                    { prim: 'Unit' },
                                                  ],
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
                                { prim: 'DUP' },
                                { prim: 'CDR' },
                                { prim: 'CAR' },
                                { prim: 'DIP', args: [[{ prim: 'CAR' }]] },
                                { prim: 'COMPARE' },
                                { prim: 'EQ' },
                                {
                                  prim: 'IF',
                                  args: [
                                    [{ prim: 'DROP' }],
                                    [
                                      { prim: 'DUP' },
                                      { prim: 'CAR' },
                                      { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                      { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] },
                                      { prim: 'SWAP' },
                                      { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                      { prim: 'COMPARE' },
                                      { prim: 'EQ' },
                                      {
                                        prim: 'IF',
                                        args: [
                                          [{ prim: 'DROP' }],
                                          [
                                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                            { prim: 'SWAP' },
                                            {
                                              prim: 'DIP',
                                              args: [
                                                [
                                                  { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                                  { prim: 'SWAP' },
                                                  { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
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
                                                                      args: [[{ prim: 'DUP' }]],
                                                                    },
                                                                  ],
                                                                ],
                                                              },
                                                              {
                                                                prim: 'DIP',
                                                                args: [[{ prim: 'CAR' }]],
                                                              },
                                                              { prim: 'PAIR' },
                                                              { prim: 'DUP' },
                                                              {
                                                                prim: 'DIP',
                                                                args: [
                                                                  [
                                                                    { prim: 'CDR' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [[{ prim: 'CAR' }]],
                                                                    },
                                                                    { prim: 'GET' },
                                                                    {
                                                                      prim: 'IF_NONE',
                                                                      args: [
                                                                        [
                                                                          {
                                                                            prim: 'EMPTY_MAP',
                                                                            args: [
                                                                              { prim: 'address' },
                                                                              { prim: 'nat' },
                                                                            ],
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
                                                                  [
                                                                    {
                                                                      prim: 'PUSH',
                                                                      args: [
                                                                        { prim: 'nat' },
                                                                        { int: '0' },
                                                                      ],
                                                                    },
                                                                  ],
                                                                  [],
                                                                ],
                                                              },
                                                            ],
                                                          ],
                                                        },
                                                      ],
                                                    ],
                                                  },
                                                  {
                                                    prim: 'DIP',
                                                    args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
                                                  },
                                                  { prim: 'SWAP' },
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
                                                                    { prim: 'DUP' },
                                                                    { prim: 'CDR' },
                                                                    { prim: 'CDR' },
                                                                    {
                                                                      prim: 'DIP',
                                                                      args: [
                                                                        [
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'DUP' }],
                                                                            ],
                                                                          },
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
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'DUP' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'SWAP' },
                                                                          {
                                                                            prim: 'DIP',
                                                                            args: [
                                                                              [{ prim: 'DUP' }],
                                                                            ],
                                                                          },
                                                                          { prim: 'SWAP' },
                                                                          { prim: 'CDR' },
                                                                          { prim: 'CDR' },
                                                                          { prim: 'PAIR' },
                                                                          {
                                                                            prim: 'PUSH',
                                                                            args: [
                                                                              { prim: 'string' },
                                                                              {
                                                                                string:
                                                                                  'NotEnoughAllowance',
                                                                              },
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
                                                              { prim: 'SWAP' },
                                                            ],
                                                          ],
                                                        },
                                                        { prim: 'PAIR' },
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
                                                      ],
                                                    ],
                                                  },
                                                  {
                                                    prim: 'DIP',
                                                    args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
                                                  },
                                                  { prim: 'SWAP' },
                                                  {
                                                    prim: 'DIP',
                                                    args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
                                                  },
                                                  { prim: 'SWAP' },
                                                  { prim: 'GET' },
                                                  {
                                                    prim: 'IF_NONE',
                                                    args: [
                                                      [
                                                        {
                                                          prim: 'PUSH',
                                                          args: [{ prim: 'nat' }, { int: '0' }],
                                                        },
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [
                                                              {
                                                                prim: 'EMPTY_MAP',
                                                                args: [
                                                                  { prim: 'address' },
                                                                  { prim: 'nat' },
                                                                ],
                                                              },
                                                            ],
                                                          ],
                                                        },
                                                        { prim: 'PAIR' },
                                                        {
                                                          prim: 'EMPTY_MAP',
                                                          args: [
                                                            { prim: 'address' },
                                                            { prim: 'nat' },
                                                          ],
                                                        },
                                                      ],
                                                      [{ prim: 'DUP' }, { prim: 'CDR' }],
                                                    ],
                                                  },
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
                                                  { prim: 'CDR' },
                                                  { prim: 'CDR' },
                                                  { prim: 'DUP' },
                                                  { prim: 'INT' },
                                                  { prim: 'EQ' },
                                                  {
                                                    prim: 'IF',
                                                    args: [
                                                      [
                                                        { prim: 'DROP' },
                                                        { prim: 'NONE', args: [{ prim: 'nat' }] },
                                                      ],
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
                                                      [
                                                        {
                                                          prim: 'DIP',
                                                          args: [
                                                            [{ prim: 'DUP' }, { prim: 'CAR' }],
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
                                                            args: [
                                                              { prim: 'address' },
                                                              { prim: 'nat' },
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
                                                  { prim: 'CDR' },
                                                  {
                                                    prim: 'DIP',
                                                    args: [
                                                      [
                                                        {
                                                          prim: 'EMPTY_MAP',
                                                          args: [
                                                            { prim: 'address' },
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
                                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                            { prim: 'SWAP' },
                                            { prim: 'CDR' },
                                            { prim: 'CDR' },
                                            {
                                              prim: 'DIP',
                                              args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
                                            },
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
                                        args: [
                                          [
                                            {
                                              prim: 'DIP',
                                              args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
                                            },
                                          ],
                                        ],
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
                                                  { prim: 'CAR' },
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
                                                          'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger/Impl.hs:158:27 in lorentz-contracts-0.2.0.1.2-CWNYAYQdqCJAhKtTd1tWlU:Lorentz.Contracts.ManagedLedger.Impl',
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
                                              args: [
                                                { prim: 'string' },
                                                { string: 'NotEnoughBalance' },
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
                                            { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                            { prim: 'SWAP' },
                                          ],
                                        ],
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
                                              args: [
                                                { prim: 'string' },
                                                { string: 'NotEnoughBalance' },
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
                                                                  args: [
                                                                    { prim: 'address' },
                                                                    { prim: 'nat' },
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
                                                    args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
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
                                                  { prim: 'CAR' },
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
                                                          'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger/Impl.hs:158:27 in lorentz-contracts-0.2.0.1.2-CWNYAYQdqCJAhKtTd1tWlU:Lorentz.Contracts.ManagedLedger.Impl',
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
                                { prim: 'SENDER' },
                                { prim: 'PAIR' },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'DUP' },
                                      { prim: 'CDR' },
                                      { prim: 'CAR' },
                                      { prim: 'CDR' },
                                      {
                                        prim: 'IF',
                                        args: [
                                          [
                                            {
                                              prim: 'PUSH',
                                              args: [
                                                {
                                                  prim: 'pair',
                                                  args: [{ prim: 'string' }, { prim: 'unit' }],
                                                },
                                                {
                                                  prim: 'Pair',
                                                  args: [
                                                    { string: 'OperationsArePaused' },
                                                    { prim: 'Unit' },
                                                  ],
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
                                { prim: 'CAR' },
                                { prim: 'GET' },
                                {
                                  prim: 'IF_NONE',
                                  args: [
                                    [{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] }],
                                    [],
                                  ],
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
                                              args: [
                                                { prim: 'string' },
                                                { string: 'UnsafeAllowanceChange' },
                                              ],
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
                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                { prim: 'PAIR' },
                              ],
                            ],
                          },
                        ],
                      ],
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
                                { prim: 'DUP' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                {
                                  prim: 'IF_LEFT',
                                  args: [
                                    [
                                      {
                                        prim: 'PUSH',
                                        args: [
                                          {
                                            prim: 'pair',
                                            args: [{ prim: 'string' }, { prim: 'unit' }],
                                          },
                                          {
                                            prim: 'Pair',
                                            args: [{ string: 'ProxyIsNotSet' }, { prim: 'Unit' }],
                                          },
                                        ],
                                      },
                                      { prim: 'FAILWITH' },
                                    ],
                                    [
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
                                                  args: [{ prim: 'string' }, { prim: 'unit' }],
                                                },
                                                {
                                                  prim: 'Pair',
                                                  args: [
                                                    { string: 'CallerIsNotProxy' },
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
                              ],
                            ],
                          },
                          {
                            prim: 'DIP',
                            args: [
                              [
                                { prim: 'DUP' },
                                { prim: 'CDR' },
                                { prim: 'CAR' },
                                { prim: 'CDR' },
                                {
                                  prim: 'IF',
                                  args: [
                                    [
                                      {
                                        prim: 'PUSH',
                                        args: [
                                          {
                                            prim: 'pair',
                                            args: [{ prim: 'string' }, { prim: 'unit' }],
                                          },
                                          {
                                            prim: 'Pair',
                                            args: [
                                              { string: 'OperationsArePaused' },
                                              { prim: 'Unit' },
                                            ],
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
                                        args: [
                                          { prim: 'string' },
                                          { string: 'UnsafeAllowanceChange' },
                                        ],
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
                                    [
                                      {
                                        prim: 'EMPTY_MAP',
                                        args: [{ prim: 'address' }, { prim: 'nat' }],
                                      },
                                    ],
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
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
                                  ],
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
                                  args: [
                                    [{ prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] }],
                                    [],
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
                            ],
                          },
                        ],
                      ],
                    },
                  ],
                ],
              },
            ],
            [
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
                          { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                          {
                            prim: 'DIP',
                            args: [[{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }]],
                          },
                          { prim: 'PAIR' },
                          { prim: 'CDR' },
                          { prim: 'CDR' },
                          { prim: 'CDR' },
                          { prim: 'CAR' },
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
                                                  args: [{ prim: 'string' }, { prim: 'unit' }],
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
                                { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CDR' }]] },
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
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'DUP' },
                                      { prim: 'CDR' },
                                      { prim: 'CAR' },
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
                                                  args: [{ prim: 'string' }, { prim: 'unit' }],
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
                                { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CDR' }]] },
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
                            ],
                          },
                        ],
                      ],
                    },
                  ],
                  [
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
                                { prim: 'DIP', args: [[{ prim: 'CDR' }]] },
                                {
                                  prim: 'DIP',
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
                                  ],
                                },
                                { prim: 'PAIR' },
                                { prim: 'CDR' },
                                { prim: 'CDR' },
                                { prim: 'CAR' },
                                { prim: 'CAR' },
                                { prim: 'DIP', args: [[{ prim: 'AMOUNT' }]] },
                                { prim: 'TRANSFER_TOKENS' },
                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                { prim: 'SWAP' },
                                { prim: 'CONS' },
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
                                                  args: [{ prim: 'string' }, { prim: 'unit' }],
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
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CAR' }]] }],
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
                                      { prim: 'INT' },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            { prim: 'DUP' },
                                            { prim: 'CDR' },
                                            { prim: 'DUP' },
                                            { prim: 'CDR' },
                                            { prim: 'CAR' },
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
                                                    'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger/Impl.hs:158:27 in lorentz-contracts-0.2.0.1.2-CWNYAYQdqCJAhKtTd1tWlU:Lorentz.Contracts.ManagedLedger.Impl',
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
                                    ],
                                  ],
                                },
                                { prim: 'DROP' },
                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                { prim: 'PAIR' },
                              ],
                            ],
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
                                      { prim: 'DUP' },
                                      { prim: 'CDR' },
                                      { prim: 'CAR' },
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
                                                  args: [{ prim: 'string' }, { prim: 'unit' }],
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
                                  args: [
                                    [{ prim: 'DIP', args: [[{ prim: 'DUP' }]] }, { prim: 'SWAP' }],
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
                                      { prim: 'DIP', args: [[{ prim: 'DUP' }]] },
                                      { prim: 'SWAP' },
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
                                                            args: [
                                                              { prim: 'address' },
                                                              { prim: 'nat' },
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
                                              args: [[{ prim: 'DUP' }, { prim: 'CAR' }]],
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
                                      { prim: 'NEG' },
                                      {
                                        prim: 'DIP',
                                        args: [
                                          [
                                            { prim: 'DUP' },
                                            { prim: 'CDR' },
                                            { prim: 'DUP' },
                                            { prim: 'CDR' },
                                            { prim: 'CAR' },
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
                                                    'Unexpected failure: Negative total supply\nCallStack (from HasCallStack):\n  failUnexpected, called at src/Lorentz/Contracts/ManagedLedger/Impl.hs:158:27 in lorentz-contracts-0.2.0.1.2-CWNYAYQdqCJAhKtTd1tWlU:Lorentz.Contracts.ManagedLedger.Impl',
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
                                    ],
                                  ],
                                },
                                { prim: 'DROP' },
                                { prim: 'NIL', args: [{ prim: 'operation' }] },
                                { prim: 'PAIR' },
                              ],
                              [
                                {
                                  prim: 'DIP',
                                  args: [
                                    [
                                      { prim: 'DUP' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      { prim: 'CDR' },
                                      {
                                        prim: 'IF_LEFT',
                                        args: [
                                          [
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
                                                          { string: 'NotAllowedToSetProxy' },
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
                                          [
                                            {
                                              prim: 'PUSH',
                                              args: [
                                                {
                                                  prim: 'pair',
                                                  args: [{ prim: 'string' }, { prim: 'unit' }],
                                                },
                                                {
                                                  prim: 'Pair',
                                                  args: [
                                                    { string: 'ProxyAlreadySet' },
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
                                { prim: 'RIGHT', args: [{ prim: 'address' }] },
                                { prim: 'DIP', args: [[{ prim: 'DUP' }, { prim: 'CDR' }]] },
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
                                { prim: 'NIL', args: [{ prim: 'operation' }] },
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
];
export const noAnnotInit = (owner: string) => ({
  prim: 'Pair',
  args: [
    [
      {
        prim: 'Elt',
        args: [{ string: owner }, { prim: 'Pair', args: [{ int: '17' }, []] }],
      },
    ],
    {
      prim: 'Pair',
      args: [
        { prim: 'Pair', args: [{ string: owner }, { prim: 'False' }] },
        { prim: 'Pair', args: [{ int: '17' }, { prim: 'Left', args: [{ string: owner }] }] },
      ],
    },
  ],
});
