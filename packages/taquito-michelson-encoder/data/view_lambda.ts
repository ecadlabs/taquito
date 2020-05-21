export const viewLambda = [
  {
    prim: 'parameter',
    args: [
      {
        prim: 'lambda',
        args: [
          { prim: 'unit' },
          {
            prim: 'pair',
            args: [{ prim: 'list', args: [{ prim: 'operation' }] }, { prim: 'unit' }],
          },
        ],
      },
    ],
  },
  { prim: 'storage', args: [{ prim: 'unit' }] },
  { prim: 'code', args: [[{ prim: 'CAR' }, { prim: 'UNIT' }, { prim: 'EXEC' }]] },
];
