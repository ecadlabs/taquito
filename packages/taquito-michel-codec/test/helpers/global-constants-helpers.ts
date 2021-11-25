import { Expr } from '../../src/micheline';

export const script = (constant1: string, constant2: string) => {
  return `{ parameter (or (or (${constant1}) (${constant1})) (unit %reset)) ;
        storage (${constant1});
        code { UNPAIR ;
               IF_LEFT { IF_LEFT { SWAP ; SUB } { ADD } } { ${constant2} ; PUSH int 0 } ;
               NIL operation ;
               PAIR } }`;
};

export const scriptJSON = (constant1: Expr, constant2: Expr) => [
  {
    prim: 'parameter',
    args: [
      {
        prim: 'or',
        args: [
          {
            prim: 'or',
            args: [constant1, constant1],
          },
          { prim: 'unit', annots: ['%reset'] },
        ],
      },
    ],
  },
  { prim: 'storage', args: [constant1] },
  {
    prim: 'code',
    args: [
      [
        { prim: 'UNPAIR' },
        {
          prim: 'IF_LEFT',
          args: [
            [
              {
                prim: 'IF_LEFT',
                args: [[{ prim: 'SWAP' }, { prim: 'SUB' }], [{ prim: 'ADD' }]],
              },
            ],
            [
              constant2,
              {
                prim: 'PUSH',
                args: [constant1, { int: '0' }],
              },
            ],
          ],
        },
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        { prim: 'PAIR' },
      ],
    ],
  },
];

export const globalConstant = (hash: string) => {
  return `constant "${hash}"`;
};

export const globalConstantJSON = (hash: string) => {
  return { prim: 'constant', args: [{ string: hash }] };
};
