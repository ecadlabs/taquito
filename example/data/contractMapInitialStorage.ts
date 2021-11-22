export const contractMapBigMap = [
    { prim: 'parameter', args: [{ prim: 'unit' }] },
    {
      prim: 'storage',
      args: [
        {
          prim: 'pair',
          args: [
            {
              prim: 'big_map',
              args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'address' }] }, { prim: 'int' }],
              annots: ['%thebigmap'],
            },
            {
              prim: 'map',
              args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'address' }] }, { prim: 'int' }],
              annots: ['%themap'],
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
          { prim: 'CDR' },
          { prim: 'NIL', args: [{ prim: 'operation' }] },
          { prim: 'PAIR' },
          { prim: 'DIP', args: [[{ prim: 'DROP' }]] },
        ],
      ],
    },
  ];