export const calledContractWithEvents = {
  code: [
    {
      prim: 'parameter',
      args: [
        {
          prim: 'int',
        },
      ],
    },
    {
      prim: 'storage',
      args: [
        {
          prim: 'unit',
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
            prim: 'PUSH',
            args: [
              {
                prim: 'int',
              },
              {
                int: '5',
              },
            ],
          },
          {
            prim: 'DUP',
            args: [
              {
                int: '2',
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
                      string: 'The called contract fails if parameter is five',
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
            prim: 'NIL',
            args: [
              {
                prim: 'operation',
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
                int: '3',
              },
            ],
          },
          {
            prim: 'ADD',
          },
          {
            prim: 'EMIT',
            annots: ['%eventFromCalledContract'],
            args: [
              {
                prim: 'int',
              },
            ],
          },
          {
            prim: 'CONS',
          },
          {
            prim: 'PAIR',
          },
        ],
      ],
    },
  ],
  storage: { prim: 'Unit' },
};
