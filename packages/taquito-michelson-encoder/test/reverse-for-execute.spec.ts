import { Schema } from '@taquito/michelson-encoder';
import { optimizedEncoding } from './helpers';

describe('Exact reverse for Schema.Execute', () => {
  describe('Schema.Encode should have a flag to convert strings to binary', () => {
    const samples: {
      ignoreMessage?: string;
      name: string;
      bigmapId: number | string | bigint;
      contractAddress: string;
      data_type: any;
      data: any;
    }[] = [
      {
        name: 'Simple Address',
        bigmapId: 3943,
        contractAddress: 'KT1GRSvLoikDsXujKgZPsGLX8k8VvR2Tq95b',
        data_type: { prim: 'address' },
        data: { bytes: '0000eeb57696df0892e5cb4663d72775fbcb09d214e3' },
      },
      {
        name: 'Tickets',
        bigmapId: 5696,
        contractAddress: 'KT1CnygLoKfJA66499U9ZQkL6ykUfzgruGfM',
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
        ignoreMessage: 'This test is suspended, as it requires additional research',
        name: 'Signature',
        bigmapId: 288,
        contractAddress: 'KT1KYWFZtuaJwwmNscLw7ipUqiq62RHvhuCG',
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
        bigmapId: 11934,
        contractAddress: 'KT1Df5WX3giW5LxgquYH33nbd3WDG5CmE2Zo',
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
      {
        name: 'KeyHash',
        bigmapId: 17,
        contractAddress: 'KT1ChNsEFxwyCbJyWGSL3KdjeXE28AY1Kaog',
        data_type: { prim: 'key_hash' },
        data: { bytes: '0022c45a24cb37da97be334c0f70865f946cb6902d' },
      },
      {
        name: 'Address: 000014be10910b0fa385f88aea0603dd93b64c4b6589',
        bigmapId: 837,
        contractAddress: 'KT1EH8yKXkRoxNkULRB1dSuwhkKyi5LJH82o',
        data_type: {
          args: [
            { prim: 'address', annots: ['%owner'] },
            { prim: 'address', annots: ['%owner'] },
            { prim: 'nat', annots: ['%token_id'] },
          ],
          prim: 'pair',
        },
        data: {
          args: [
            { bytes: '000014be10910b0fa385f88aea0603dd93b64c4b6589' },
            {
              args: [{ bytes: '0133e65012a368dadf1d3d8fff4570b8a4e3c0458c00' }, { int: '381' }],
              prim: 'Pair',
            },
          ],
          prim: 'Pair',
        },
      },
    ];

    samples.forEach((sample) => {
      it(`Should properly work for ${sample.name}`, () => {
        if (sample.ignoreMessage !== undefined) {
          console.warn(`Test case disabled with message: \n${sample.ignoreMessage}\n`);
          return;
        }
        const schema = new Schema(sample.data_type);
        const decoded = schema.Execute(sample.data);
        const recoded = schema.Encode(decoded, optimizedEncoding);
        expect(recoded).toEqual(sample.data);
      });
    });
  });
});
