export const emitCode = [
  {
    prim: 'parameter',
    args: [
      {
        prim: 'unit',
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
          prim: 'DROP',
        },
        {
          prim: 'UNIT',
        },
        {
          prim: 'PUSH',
          args: [
            {
              prim: 'string',
            },
            {
              string: 'right',
            },
          ],
        },
        {
          prim: 'RIGHT',
          args: [
            {
              prim: 'nat',
            },
          ],
        },
        {
          prim: 'EMIT',
          annots: ['%tag1'],
        },
        {
          prim: 'PUSH',
          args: [
            {
              prim: 'nat',
            },
            {
              int: '2',
            },
          ],
        },
        {
          prim: 'LEFT',
          args: [
            {
              prim: 'string',
            },
          ],
        },
        {
          prim: 'EMIT',
          args: [
            {
              prim: 'or',
              args: [
                {
                  prim: 'nat',
                  annots: ['%int'],
                },
                {
                  prim: 'string',
                  annots: ['%str'],
                },
              ],
            },
          ],
          annots: ['%tag2'],
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
          prim: 'SWAP',
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
];
