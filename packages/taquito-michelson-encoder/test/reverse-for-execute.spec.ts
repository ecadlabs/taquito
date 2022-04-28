import { Schema } from '@taquito/michelson-encoder';

describe('Exact reverse for Schema.Execute', () => {
  describe('Schema.Encode should have a flag to convert strings to binary', () => {
    const samples: { name: string; data_type: any; data: any }[] = [
      {
        name: 'Simple Address',
        data_type: { prim: 'address' },
        data: { bytes: '000072b91ef330c52e0862b890bc31feea232bcca757' },
      },
      {
        name: 'Tickets',
        data_type: {
          args: [{ prim: 'timestamp' }, { args: [{ prim: 'string' }], prim: 'ticket' }],
          prim: 'pair',
        },
        data: {
          args: [
            { int: '1625847582' },
            {
              args: [
                { bytes: '012e2f9b3ed43b73564c4b3dab30c8531f0e2c159100' },
                { args: [{ string: 'airdrop' }, { int: '5' }], prim: 'Pair' },
              ],
              prim: 'Pair',
            },
          ],
          prim: 'Pair',
        },
      },
      {
        name: 'Signature',
        data_type: {
          args: [
            { prim: 'bool', annots: ['%confirmed'] },
            {
              args: [
                { prim: 'nat', annots: ['%grade'] },
                { prim: 'signature', annots: ['%migration_sig'] },
              ],
              prim: 'pair',
            },
          ],
          prim: 'pair',
        },
        data: {
          args: [
            { prim: 'True' },
            {
              args: [
                { int: '1' },
                {
                  bytes:
                    'fde2f3342b931360c759a54601de5e9afbec373447d20d0c1a97d7b2c31dbe540a5739e1663eb720ab4d60b0f45ff1faeb1de98e183b8f78e56059849339110f',
                },
              ],
              prim: 'Pair',
            },
          ],
          prim: 'Pair',
        },
      },
      {
        name: 'DateTime',
        data_type: {
          args: [
            {
              args: [
                { prim: 'nat', annots: ['%accumulatedRewardPerShareStart'] },
                { prim: 'timestamp', annots: ['%lastUpdate'] },
              ],
              prim: 'pair',
            },
            { prim: 'nat', annots: ['%lpTokenBalance'] },
          ],
          prim: 'pair',
        },
        data: {
          args: [
            { args: [{ int: '500000449355' }, { int: '1629877086' }], prim: 'Pair' },
            { int: '0' },
          ],
          prim: 'Pair',
        },
      },
    ];

    samples.forEach((sample) =>
      it(`Should properly work for ${sample.name}`, () => {
        const schema = new Schema(sample.data_type);
        const decoded = schema.Execute(sample.data);
        const recoded = schema.Encode(decoded);
        expect(JSON.stringify(recoded)).toEqual(JSON.stringify(sample.data));
      })
    );
  });
});
