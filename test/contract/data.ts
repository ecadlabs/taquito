export const sampleStorage = {
  prim: 'Pair',
  args: [
    [],
    {
      prim: 'Pair',
      args: [
        { bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd' },
        { prim: 'Pair', args: [{ prim: 'False' }, { int: '200' }] }
      ]
    }
  ]
}
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
              args: [{ prim: 'nat' }, { prim: 'map', args: [{ prim: 'address' }, { prim: 'nat' }] }]
            }
          ]
        },
        {
          prim: 'pair',
          args: [{ prim: 'address' }, { prim: 'pair', args: [{ prim: 'bool' }, { prim: 'nat' }] }]
        }
      ]
    }
  ]
}
