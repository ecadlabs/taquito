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
