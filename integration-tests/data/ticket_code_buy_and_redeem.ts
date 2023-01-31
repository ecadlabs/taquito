import { MichelsonMap } from '@taquito/michelson-encoder';

const ticket_types = new MichelsonMap();
ticket_types.set('ticket1', '1');
ticket_types.set('ticket2', '2');

export const ticketStorageBuyAndRedeem = {
    data: {
        ticket_validity: 10,
        valid_ticket_types: ticket_types,
    },
    tickets: new MichelsonMap(),
};

export const ticketCodeBuyAndRedeem = [
    {
      prim: 'parameter',
      args: [
        {
          prim: 'or',
          args: [
            {
              prim: 'pair',
              annots: ['%buy_tickets'],
              args: [
                { prim: 'nat', annots: ['%ticket_amount'] },
                { prim: 'address', annots: ['%ticket_owner'] },
                { prim: 'string', annots: ['%ticket_type'] },
              ],
            },
            { prim: 'string', annots: ['%redeem_ticket'] },
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
              prim: 'pair',
              annots: ['%data'],
              args: [
                { prim: 'int', annots: ['%ticket_validity'] },
                {
                  prim: 'big_map',
                  annots: ['%valid_ticket_types'],
                  args: [{ prim: 'string' }, { prim: 'mutez' }],
                },
              ],
            },
            {
              prim: 'big_map',
              annots: ['%tickets'],
              args: [
                { prim: 'pair', args: [{ prim: 'address' }, { prim: 'string' }] },
                {
                  prim: 'pair',
                  args: [{ prim: 'timestamp' }, { prim: 'ticket', args: [{ prim: 'string' }] }],
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
          { prim: 'UNPAIR' },
          { prim: 'SWAP' },
          { prim: 'UNPAIR' },
          { prim: 'DIG', args: [{ int: '2' }] },
          {
            prim: 'IF_LEFT',
            args: [
              [
                { prim: 'UNPAIR', args: [{ int: '3' }] },
                { prim: 'SWAP' },
                { prim: 'DROP' },
                { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                { prim: 'DUP', args: [{ int: '2' }] },
                { prim: 'COMPARE' },
                { prim: 'LT' },
                {
                  prim: 'IF',
                  args: [
                    [
                      { prim: 'DROP', args: [{ int: '4' }] },
                      {
                        prim: 'PUSH',
                        args: [{ prim: 'string' }, { string: 'INVALID_TICKET_AMOUNT' }],
                      },
                      { prim: 'FAILWITH' },
                    ],
                    [
                      { prim: 'DUP', args: [{ int: '3' }] },
                      { prim: 'CDR' },
                      { prim: 'DUP', args: [{ int: '3' }] },
                      { prim: 'GET' },
                      {
                        prim: 'IF_NONE',
                        args: [
                          [
                            {
                              prim: 'PUSH',
                              args: [{ prim: 'string' }, { string: 'INVALID_TICKET_TYPE' }],
                            },
                            { prim: 'FAILWITH' },
                          ],
                          [],
                        ],
                      },
                      { prim: 'DUP', args: [{ int: '2' }] },
                      { prim: 'MUL' },
                      { prim: 'AMOUNT' },
                      { prim: 'COMPARE' },
                      { prim: 'NEQ' },
                      {
                        prim: 'IF',
                        args: [
                          [
                            { prim: 'DROP', args: [{ int: '4' }] },
                            {
                              prim: 'PUSH',
                              args: [{ prim: 'string' }, { string: 'INVALID_AMOUNT' }],
                            },
                            { prim: 'FAILWITH' },
                          ],
                          [
                            { prim: 'DIG', args: [{ int: '3' }] },
                            {
                              prim: 'NONE',
                              args: [
                                {
                                  prim: 'pair',
                                  args: [
                                    { prim: 'timestamp' },
                                    { prim: 'ticket', args: [{ prim: 'string' }] },
                                  ],
                                },
                              ],
                            },
                            { prim: 'DUP', args: [{ int: '4' }] },
                            { prim: 'SENDER' },
                            { prim: 'PAIR' },
                            { prim: 'GET_AND_UPDATE' },
                            {
                              prim: 'IF_NONE',
                              args: [
                                [
                                  { prim: 'SWAP' },
                                  { prim: 'DUP', args: [{ int: '3' }] },
                                  { prim: 'TICKET' },
                                  [
                                    {
                                      prim: 'IF_NONE',
                                      args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []],
                                    },
                                  ],
                                ],
                                [
                                  { prim: 'DIG', args: [{ int: '2' }] },
                                  { prim: 'DUP', args: [{ int: '4' }] },
                                  { prim: 'TICKET' },
                                  [
                                    {
                                      prim: 'IF_NONE',
                                      args: [[[{ prim: 'UNIT' }, { prim: 'FAILWITH' }]], []],
                                    },
                                  ],
                                  { prim: 'SWAP' },
                                  { prim: 'CDR' },
                                  { prim: 'PAIR' },
                                  { prim: 'JOIN_TICKETS' },
                                  {
                                    prim: 'IF_NONE',
                                    args: [
                                      [
                                        {
                                          prim: 'PUSH',
                                          args: [
                                            { prim: 'string' },
                                            { string: 'UNJOINABLE_TICKETS' },
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
                            { prim: 'NOW' },
                            { prim: 'PAIR' },
                            { prim: 'SOME' },
                            { prim: 'DIG', args: [{ int: '2' }] },
                            { prim: 'SENDER' },
                            { prim: 'PAIR' },
                            { prim: 'GET_AND_UPDATE' },
                            { prim: 'DROP' },
                            { prim: 'SWAP' },
                            { prim: 'PAIR' },
                          ],
                        ],
                      },
                    ],
                  ],
                },
              ],
              [
                { prim: 'DIG', args: [{ int: '2' }] },
                {
                  prim: 'NONE',
                  args: [
                    {
                      prim: 'pair',
                      args: [{ prim: 'timestamp' }, { prim: 'ticket', args: [{ prim: 'string' }] }],
                    },
                  ],
                },
                { prim: 'DUP', args: [{ int: '3' }] },
                { prim: 'SENDER' },
                { prim: 'PAIR' },
                { prim: 'GET_AND_UPDATE' },
                {
                  prim: 'IF_NONE',
                  args: [
                    [
                      { prim: 'DROP', args: [{ int: '2' }] },
                      { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'NO_TICKETS' }] },
                      { prim: 'FAILWITH' },
                    ],
                    [
                      { prim: 'UNPAIR' },
                      { prim: 'NOW' },
                      { prim: 'DUP', args: [{ int: '6' }] },
                      { prim: 'CAR' },
                      { prim: 'DUP', args: [{ int: '3' }] },
                      { prim: 'ADD' },
                      { prim: 'COMPARE' },
                      { prim: 'LT' },
                      {
                        prim: 'IF',
                        args: [
                          [
                            { prim: 'DROP', args: [{ int: '4' }] },
                            {
                              prim: 'PUSH',
                              args: [{ prim: 'string' }, { string: 'INVALID_TICKETS' }],
                            },
                            { prim: 'FAILWITH' },
                          ],
                          [
                            { prim: 'SWAP' },
                            { prim: 'READ_TICKET' },
                            { prim: 'CDR' },
                            { prim: 'CDR' },
                            { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '0' }] },
                            { prim: 'DUP', args: [{ int: '2' }] },
                            { prim: 'COMPARE' },
                            { prim: 'EQ' },
                            {
                              prim: 'IF',
                              args: [
                                [
                                  { prim: 'DROP', args: [{ int: '5' }] },
                                  {
                                    prim: 'PUSH',
                                    args: [{ prim: 'string' }, { string: 'ZERO_AMOUNT_TICKET' }],
                                  },
                                  { prim: 'FAILWITH' },
                                ],
                                [
                                  { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                                  { prim: 'DUP', args: [{ int: '2' }] },
                                  { prim: 'COMPARE' },
                                  { prim: 'EQ' },
                                  {
                                    prim: 'IF',
                                    args: [
                                      [
                                        { prim: 'SWAP' },
                                        { prim: 'DIG', args: [{ int: '2' }] },
                                        { prim: 'DIG', args: [{ int: '4' }] },
                                        { prim: 'DROP', args: [{ int: '4' }] },
                                      ],
                                      [
                                        { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                                        { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '1' }] },
                                        { prim: 'DIG', args: [{ int: '2' }] },
                                        { prim: 'SUB' },
                                        { prim: 'ABS' },
                                        { prim: 'PAIR' },
                                        { prim: 'SWAP' },
                                        { prim: 'SPLIT_TICKET' },
                                        {
                                          prim: 'IF_NONE',
                                          args: [
                                            [
                                              { prim: 'DROP', args: [{ int: '3' }] },
                                              {
                                                prim: 'PUSH',
                                                args: [
                                                  { prim: 'string' },
                                                  { string: 'UNSPLITTABLE_TICKET' },
                                                ],
                                              },
                                              { prim: 'FAILWITH' },
                                            ],
                                            [
                                              { prim: 'DIG', args: [{ int: '2' }] },
                                              { prim: 'SWAP' },
                                              { prim: 'CAR' },
                                              { prim: 'DIG', args: [{ int: '2' }] },
                                              { prim: 'PAIR' },
                                              { prim: 'SOME' },
                                              { prim: 'DIG', args: [{ int: '2' }] },
                                              { prim: 'SENDER' },
                                              { prim: 'PAIR' },
                                              { prim: 'GET_AND_UPDATE' },
                                              { prim: 'DROP' },
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
                { prim: 'SWAP' },
                { prim: 'PAIR' },
              ],
            ],
          },
          { prim: 'NIL', args: [{ prim: 'operation' }] },
          { prim: 'PAIR' },
        ],
      ],
    },
  ];
  