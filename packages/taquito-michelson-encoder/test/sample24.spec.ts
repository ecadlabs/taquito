import { BigNumber } from 'bignumber.js';
import { script24, storage24 } from '../data/sample24';
import { Schema } from '../src/schema/storage';
import { normalizeMichelsonValue } from './utils';

describe('Schema test', () => {
  it('Should parse storage properly simpler case', () => {
    const mapMaxPerAddressValue = [
      {
        prim: 'Elt',
        args: [
          {
            string: 'Arria',
          },
          [
            {
              prim: 'Elt',
              args: [
                {
                  string: 'tier3',
                },
                {
                  int: '104919',
                },
              ],
            },
          ],
        ],
      },
    ];

    const mapMaxPerAddressType = {
      prim: 'map',
      args: [
        {
          prim: 'string',
        },
        {
          prim: 'map',
          args: [
            {
              prim: 'string',
            },
            {
              prim: 'big_map',
              args: [
                {
                  prim: 'address',
                },
                {
                  prim: 'int',
                },
              ],
            },
          ],
        },
      ],
      annots: ['%max_per_address'],
    };

    const schema = new Schema(mapMaxPerAddressType);
    const storage = schema.Execute(mapMaxPerAddressValue);
    expect(normalizeMichelsonValue(storage)).toEqual({
      Arria: { tier3: '104919' },
    });
  });

  it('Should parse storage properly', () => {
    const schema = new Schema(storage24);
    const storage = schema.Execute(script24.script.storage);
    expect(normalizeMichelsonValue(storage)).toEqual(
      normalizeMichelsonValue({
        active: true,
        artist_map: {
          Arria: {
            address: 'tz1NcYGUWUrcriX5nWmHN6daCDKHQdMUSUDp',
            tier1_index: new BigNumber(0),
            tier1_metadata_path:
              '68747470733a2f2f676f6f676c652e636f6d2f6d657461646174615f64656661756c742f',
            tier1_total_supply: new BigNumber(1),
            tier2_index: new BigNumber(0),
            tier2_metadata_path:
              '68747470733a2f2f676f6f676c652e636f6d2f6d657461646174615f64656661756c742f',
            tier2_total_supply: new BigNumber(50),
            tier3_index: new BigNumber(8),
            tier3_metadata_path:
              '68747470733a2f2f676f6f676c652e636f6d2f6d657461646174615f64656661756c742f',
            tier3_total_supply: new BigNumber(100),
          },
          'Arria Stark': {
            address: 'tz1NcYGUWUrcriX5nWmHN6daCDKHQdMUSUDp',
            tier1_index: new BigNumber(1),
            tier1_metadata_path:
              '697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f',
            tier1_total_supply: new BigNumber(1),
            tier2_index: new BigNumber(0),
            tier2_metadata_path:
              '697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f',
            tier2_total_supply: new BigNumber(50),
            tier3_index: new BigNumber(0),
            tier3_metadata_path:
              '697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f',
            tier3_total_supply: new BigNumber(100),
          },
          Lojay: {
            address: 'tz1cVm8jzr5MN6oH21p54HuWCi69qYzjo7MN',
            tier1_index: new BigNumber(1),
            tier1_metadata_path:
              '697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f',
            tier1_total_supply: new BigNumber(1),
            tier2_index: new BigNumber(5),
            tier2_metadata_path:
              '697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f',
            tier2_total_supply: new BigNumber(50),
            tier3_index: new BigNumber(0),
            tier3_metadata_path:
              '697066733a2f2f7a646a37576b507672784c3756786957626a425035726673685074417a58775a373775765a686653416f484465623369772f',
            tier3_total_supply: new BigNumber(100),
          },
        },
        fa2: 'KT18hLaKKTfizp7BEiQLH32uroU68mCcX6Ru',
        joko_id: new BigNumber('15'),
        manager: 'tz1bnmFGgKfrRfHLNABQpWh14CjsTKmrFNog',
        max_mint: new BigNumber('5'),
        max_per_address: {
          Arria: { tier3: '104919' },
          Lojay: { tier2: '104774' },
        },
        metadata: '104761',
        pixel_artist_map: {
          Charlie: 'tz1bnmFGgKfrRfHLNABQpWh14CjsTKmrFNog',
          Sutu: 'tz1hWvP1HXRAmBWQU4ewYUeNNrEdz2sUKDNJ',
        },
        price: new BigNumber('10000000'),
        tier2_royalties: {
          artist: '40',
          pixel_artist: '30',
        },
        tier3_royalties: {
          artist: '30',
          pixel_artist: '40',
        },
        tier_map: '104762',
      })
    );
  });
});
