import { createToken } from '../../src/tokens/createToken';
import { MapToken } from '../../src/tokens/map';
import { MichelsonMap } from '../../src/michelson-map';
import BigNumber from 'bignumber.js';

describe('Map token', () => {
  let token: MapToken;
  beforeEach(() => {
    token = createToken(
      { prim: 'map', args: [{ prim: 'string' }, { prim: 'int' }], annots: [] },
      0
    ) as MapToken;
  });

  describe('Encode', () => {
    it('Encode properly an empty map', () => {
      const map = new MichelsonMap();
      const result = token.Encode([map]);
      expect(result).toEqual([]);
    });

    it('Encode properly a map with one value', () => {
      const map = new MichelsonMap();
      map.set('test', 1);
      const result = token.Encode([map]);
      expect(result).toEqual([{ prim: 'Elt', args: [{ string: 'test' }, { int: '1' }] }]);
    });

    it('Encode properly a map with keys of type string using fromLiteral', () => {
      // Map keys must be in strictly increasing order
      const map = MichelsonMap.fromLiteral({
        '8': 8,
        '9': 9,
        '10': 10,
        '11': 11,
        '12': 12,
      });
      const result = token.Encode([map]);
      expect(result).toEqual([
        { prim: 'Elt', args: [{ string: '10' }, { int: '10' }] },
        { prim: 'Elt', args: [{ string: '11' }, { int: '11' }] },
        { prim: 'Elt', args: [{ string: '12' }, { int: '12' }] },
        { prim: 'Elt', args: [{ string: '8' }, { int: '8' }] },
        { prim: 'Elt', args: [{ string: '9' }, { int: '9' }] },
      ]);
    });

    it('Encode properly a map with keys of type int using fromLiteral', () => {
      // Map keys must be in strictly increasing order
      token = createToken(
        { prim: 'map', args: [{ prim: 'int' }, { prim: 'int' }], annots: [] },
        0
      ) as MapToken;
      const map = MichelsonMap.fromLiteral({
        '8': 8,
        '9': 9,
        '10': 10,
        '11': 11,
        '12': 12,
      });
      const result = token.Encode([map]);
      expect(result).toEqual([
        { prim: 'Elt', args: [{ int: '8' }, { int: '8' }] },
        { prim: 'Elt', args: [{ int: '9' }, { int: '9' }] },
        { prim: 'Elt', args: [{ int: '10' }, { int: '10' }] },
        { prim: 'Elt', args: [{ int: '11' }, { int: '11' }] },
        { prim: 'Elt', args: [{ int: '12' }, { int: '12' }] },
      ]);
    });

    it('Encode properly a map with keys of type nat using fromLiteral', () => {
      // Map keys must be in strictly increasing order
      token = createToken(
        { prim: 'map', args: [{ prim: 'nat' }, { prim: 'int' }], annots: [] },
        0
      ) as MapToken;
      const map = MichelsonMap.fromLiteral({
        8: 3,
        9: 16,
        12: 1,
      });
      const result = token.Encode([map]);
      expect(result).toEqual([
        { prim: 'Elt', args: [{ int: '8' }, { int: '3' }] },
        { prim: 'Elt', args: [{ int: '9' }, { int: '16' }] },
        { prim: 'Elt', args: [{ int: '12' }, { int: '1' }] },
      ]);
    });

    it('Encode properly a map with keys of type nat', () => {
      // Map keys must be in strictly increasing order
      token = createToken(
        { prim: 'map', args: [{ prim: 'nat' }, { prim: 'int' }], annots: [] },
        0
      ) as MapToken;
      const map = new MichelsonMap();
      map.set(8, 3);
      map.set(12, 1);
      map.set(9, 16);
      const result = token.Encode([map]);
      expect(result).toEqual([
        { prim: 'Elt', args: [{ int: '8' }, { int: '3' }] },
        { prim: 'Elt', args: [{ int: '9' }, { int: '16' }] },
        { prim: 'Elt', args: [{ int: '12' }, { int: '1' }] },
      ]);
    });

    it('Encode properly a map with keys of type mutez', () => {
      // Map keys must be in strictly increasing order
      token = createToken(
        { prim: 'map', args: [{ prim: 'mutez' }, { prim: 'int' }], annots: [] },
        0
      ) as MapToken;
      const map = MichelsonMap.fromLiteral({
        8: 5,
        22: 2,
        9: 4,
        10: 1,
        12: 15,
      });
      const result = token.Encode([map]);
      expect(result).toEqual([
        { prim: 'Elt', args: [{ int: '8' }, { int: '5' }] },
        { prim: 'Elt', args: [{ int: '9' }, { int: '4' }] },
        { prim: 'Elt', args: [{ int: '10' }, { int: '1' }] },
        { prim: 'Elt', args: [{ int: '12' }, { int: '15' }] },
        { prim: 'Elt', args: [{ int: '22' }, { int: '2' }] },
      ]);
    });

    it('Encode properly a map with keys of type or', () => {
      // Map keys must be in strictly increasing order
      token = createToken(
        {
          prim: 'map',
          args: [
            {
              prim: 'or',
              args: [
                {
                  prim: 'or',
                  args: [
                    {
                      prim: 'or',
                      args: [
                        {
                          prim: 'address',
                          annots: ['%myAddress'],
                        },
                        { prim: 'bytes', annots: ['%myBytes'] },
                      ],
                    },
                    {
                      prim: 'or',
                      args: [
                        { prim: 'int', annots: ['%myInt'] },
                        { prim: 'nat', annots: ['%myNat'] },
                      ],
                    },
                  ],
                },
                {
                  prim: 'or',
                  args: [
                    {
                      prim: 'or',
                      args: [
                        {
                          prim: 'pair',
                          args: [{ prim: 'nat' }, { prim: 'int' }],
                          annots: ['%myPair'],
                        },
                        {
                          prim: 'string',
                          annots: ['%myString'],
                        },
                      ],
                    },
                    { prim: 'mutez', annots: ['%myTez'] },
                  ],
                },
              ],
            },
            { prim: 'nat' },
          ],
        },
        0
      ) as MapToken;
      const map = new MichelsonMap();
      map.set({ myTez: 12 }, 3); //RR
      map.set({ myTez: 2 }, 3); //RR
      map.set({ myBytes: 'cccc' }, 15); //LLR
      map.set({ myAddress: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu' }, 5); //LLL
      map.set({ myNat: 48 }, 16); //LRR
      map.set({ myPair: { 0: 12, 1: 6 } }, 3); //RLL
      map.set({ myInt: 4 }, 6); //LRL
      map.set({ myString: 'test' }, 3); //RLR
      map.set({ myBytes: 'aaaa' }, 5); //LLR
      const result = token.Encode([map]);
      expect(result).toEqual([
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Left',
              args: [
                {
                  prim: 'Left',
                  args: [
                    { prim: 'Left', args: [{ string: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu' }] },
                  ],
                },
              ],
            },
            { int: '5' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Left', args: [{ prim: 'Right', args: [{ bytes: 'aaaa' }] }] }],
            },
            { int: '5' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Left', args: [{ prim: 'Right', args: [{ bytes: 'cccc' }] }] }],
            },
            { int: '15' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Right', args: [{ prim: 'Left', args: [{ int: '4' }] }] }],
            },
            { int: '6' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '48' }] }] }],
            },
            { int: '16' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Right',
              args: [
                {
                  prim: 'Left',
                  args: [
                    { prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '12' }, { int: '6' }] }] },
                  ],
                },
              ],
            },
            { int: '3' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Right',
              args: [{ prim: 'Left', args: [{ prim: 'Right', args: [{ string: 'test' }] }] }],
            },
            { int: '3' },
          ],
        },
        {
          prim: 'Elt',
          args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '2' }] }] }, { int: '3' }],
        },
        {
          prim: 'Elt',
          args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '12' }] }] }, { int: '3' }],
        },
      ]);
    });

    it('Encode properly a map with keys of type or no annotation', () => {
      // Map keys must be in strictly increasing order
      token = createToken(
        {
          prim: 'map',
          args: [
            {
              prim: 'or',
              args: [
                {
                  prim: 'or',
                  args: [
                    {
                      prim: 'or',
                      args: [
                        {
                          prim: 'address',
                        },
                        { prim: 'bytes' },
                      ],
                    },
                    {
                      prim: 'or',
                      args: [{ prim: 'int' }, { prim: 'nat' }],
                    },
                  ],
                },
                {
                  prim: 'or',
                  args: [
                    {
                      prim: 'or',
                      args: [
                        {
                          prim: 'pair',
                          args: [{ prim: 'nat' }, { prim: 'int' }],
                        },
                        {
                          prim: 'string',
                        },
                      ],
                    },
                    { prim: 'mutez' },
                  ],
                },
              ],
            },
            { prim: 'nat' },
          ],
        },
        0
      ) as MapToken;
      const map = new MichelsonMap();
      map.set({ 6: 12 }, 3); //RR
      map.set({ 6: 2 }, 3); //RR
      map.set({ 1: 'cccc' }, 15); //LLR
      map.set({ 0: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu' }, 5); //LLL
      map.set({ 3: 48 }, 16); //LRR
      map.set({ 4: { 0: 12, 1: 6 } }, 3); //RLL
      map.set({ 2: 4 }, 6); //LRL
      map.set({ 5: 'test' }, 3); //RLR
      map.set({ 1: 'aaaa' }, 5); //LLR
      const result = token.Encode([map]);
      expect(result).toEqual([
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Left',
              args: [
                {
                  prim: 'Left',
                  args: [
                    { prim: 'Left', args: [{ string: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu' }] },
                  ],
                },
              ],
            },
            { int: '5' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Left', args: [{ prim: 'Right', args: [{ bytes: 'aaaa' }] }] }],
            },
            { int: '5' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Left', args: [{ prim: 'Right', args: [{ bytes: 'cccc' }] }] }],
            },
            { int: '15' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Right', args: [{ prim: 'Left', args: [{ int: '4' }] }] }],
            },
            { int: '6' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '48' }] }] }],
            },
            { int: '16' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Right',
              args: [
                {
                  prim: 'Left',
                  args: [
                    { prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '12' }, { int: '6' }] }] },
                  ],
                },
              ],
            },
            { int: '3' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            {
              prim: 'Right',
              args: [{ prim: 'Left', args: [{ prim: 'Right', args: [{ string: 'test' }] }] }],
            },
            { int: '3' },
          ],
        },
        {
          prim: 'Elt',
          args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '2' }] }] }, { int: '3' }],
        },
        {
          prim: 'Elt',
          args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '12' }] }] }, { int: '3' }],
        },
      ]);
    });

    it('Encode properly a map with keys of type key using fromLiteral', () => {
      // Map keys must be in strictly increasing order
      token = createToken(
        { prim: 'map', args: [{ prim: 'key' }, { prim: 'int' }], annots: [] },
        0
      ) as MapToken;
      const map = MichelsonMap.fromLiteral({
        edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g: 90,
        sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj: 45,
        edpktm3zeGMzfzFuqgyYftt7uNyVRANTjrJCdU7bURwgGb9bRZwmJq: 30,
        p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT: 99,
        edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh: 1,
        p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV: 60,
        p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi: 70,
      });
      const result = token.Encode([map]);
      expect(result).toEqual([
        {
          prim: 'Elt',
          args: [
            { string: 'edpktm3zeGMzfzFuqgyYftt7uNyVRANTjrJCdU7bURwgGb9bRZwmJq' },
            { int: '30' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh' },
            { int: '1' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g' },
            { int: '90' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj' },
            { int: '45' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi' },
            { int: '70' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV' },
            { int: '60' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT' },
            { int: '99' },
          ],
        },
      ]);
    });

    it('Encode properly a map with keys of type key', () => {
      // Map keys must be in strictly increasing order
      token = createToken(
        { prim: 'map', args: [{ prim: 'key' }, { prim: 'int' }], annots: [] },
        0
      ) as MapToken;
      const map = new MichelsonMap();
      map.set('edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g', 30);
      map.set('p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV', 23);
      map.set('edpktm3zeGMzfzFuqgyYftt7uNyVRANTjrJCdU7bURwgGb9bRZwmJq', 1);
      map.set('edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh', 2);
      map.set('sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj', 17);
      map.set('p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT', 17);
      map.set('p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi', 90);
      const result = token.Encode([map]);
      expect(result).toEqual([
        {
          prim: 'Elt',
          args: [
            { string: 'edpktm3zeGMzfzFuqgyYftt7uNyVRANTjrJCdU7bURwgGb9bRZwmJq' },
            { int: '1' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh' },
            { int: '2' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g' },
            { int: '30' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'sppk7aTKnmX5WV17KPo3LanjfPLoXTuNjkQTdLx2bYDqHPLVVCbSwoj' },
            { int: '17' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi' },
            { int: '90' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV' },
            { int: '23' },
          ],
        },
        {
          prim: 'Elt',
          args: [
            { string: 'p2pk65shUHKhx7zUSF7e8KZ2inmQ5aMS4jRBUmK6aCis4oaHoiWPXoT' },
            { int: '17' },
          ],
        },
      ]);
    });

    it('Encode properly a map with keys of type option using fromLiteral', () => {
      // Map keys must be in strictly increasing order
      token = createToken(
        {
          prim: 'map',
          args: [{ prim: 'option', args: [{ prim: 'int' }] }, { prim: 'int' }],
          annots: [],
        },
        0
      ) as MapToken;
      const map = MichelsonMap.fromLiteral({
        5: 30,
        3: 1,
        22: 1,
      });
      const result = token.Encode([map]);
      expect(result).toEqual([
        { prim: 'Elt', args: [{ prim: 'Some', args: [{ int: '3' }] }, { int: '1' }] },
        { prim: 'Elt', args: [{ prim: 'Some', args: [{ int: '5' }] }, { int: '30' }] },
        { prim: 'Elt', args: [{ prim: 'Some', args: [{ int: '22' }] }, { int: '1' }] },
      ]);
    });

    it('Encode properly a map with keys of type option', () => {
      // Map keys must be in strictly increasing order
      token = createToken(
        {
          prim: 'map',
          args: [{ prim: 'option', args: [{ prim: 'int' }] }, { prim: 'int' }],
          annots: [],
        },
        0
      ) as MapToken;
      const map = new MichelsonMap();
      map.set(5, 30);
      map.set(3, 1);
      map.set(22, 1);
      const result = token.Encode([map]);
      expect(result).toEqual([
        { prim: 'Elt', args: [{ prim: 'Some', args: [{ int: '3' }] }, { int: '1' }] },
        { prim: 'Elt', args: [{ prim: 'Some', args: [{ int: '5' }] }, { int: '30' }] },
        { prim: 'Elt', args: [{ prim: 'Some', args: [{ int: '22' }] }, { int: '1' }] },
      ]);
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'map',
        schema: {
          key: {
            __michelsonType: 'string',
            schema: 'string',
          },
          value: {
            __michelsonType: 'int',
            schema: 'int',
          },
        },
      });
    });
  });
});

describe('Map token with pair', () => {
  let token: MapToken;
  beforeEach(() => {
    token = createToken(
      {
        prim: 'map',
        args: [{ prim: 'pair', args: [{ prim: 'string' }, { prim: 'string' }] }, { prim: 'int' }],
        annots: [],
      },
      0
    ) as MapToken;
  });

  describe('Encode', () => {
    it('Encode properly an empty map', () => {
      const map = new MichelsonMap();
      const result = token.Encode([map]);
      expect(result).toEqual([]);
    });

    it('Encode properly a map with two value', () => {
      const map = new MichelsonMap();
      map.set({ 0: 'test', 1: '1test' }, 2);
      map.set({ 0: 'test1', 1: 'test' }, 3);
      const result = token.Encode([map]);
      expect(result).toEqual([
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test' }, { string: '1test' }] }, { int: '2' }],
        },
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test1' }, { string: 'test' }] }, { int: '3' }],
        },
      ]);
    });
  });

  describe('EncodeObject', () => {
    it('EncodeObject properly an empty map', () => {
      const map = new MichelsonMap();
      const result = token.EncodeObject(map);
      expect(result).toEqual([]);
    });

    it('EncodeObject properly a map with two value', () => {
      const map = new MichelsonMap();
      map.set({ 0: 'test', 1: '1test' }, 2);
      map.set({ 0: 'test1', 1: 'test' }, 3);
      const result = token.EncodeObject(map);
      expect(result).toEqual([
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test' }, { string: '1test' }] }, { int: '2' }],
        },
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test1' }, { string: 'test' }] }, { int: '3' }],
        },
      ]);
    });
  });

  describe('Execute', () => {
    it('Execute properly on empty map storage', () => {
      const result = token.Execute([]) as MichelsonMap<any, any>;

      expect(result).toBeInstanceOf(MichelsonMap);
      expect(result.size).toEqual(0);
    });

    it('Execute properly on storage with two values', () => {
      const result = token.Execute([
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test' }, { string: '1test' }] }, { int: '2' }],
        },
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test1' }, { string: 'test' }] }, { int: '3' }],
        },
      ]) as MichelsonMap<any, any>;

      expect(result).toBeInstanceOf(MichelsonMap);
      expect(result.size).toEqual(2);

      expect(result.get({ 0: 'test', 1: '1test' })).toBeInstanceOf(BigNumber);
      expect(result.get({ 0: 'test', 1: '1test' }).toString()).toEqual('2');
      expect(result.get({ 1: '1test', 0: 'test' }).toString()).toEqual('2');

      expect(result.get({ 0: 'test1', 1: 'test' })).toBeInstanceOf(BigNumber);
      expect(result.get({ 0: 'test1', 1: 'test' }).toString()).toEqual('3');
      expect(result.get({ 1: 'test', 0: 'test1' }).toString()).toEqual('3');
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'map',
        schema: {
          key: {
            __michelsonType: 'pair',
            schema: {
              0: {
                __michelsonType: 'string',
                schema: 'string',
              },
              1: {
                __michelsonType: 'string',
                schema: 'string',
              },
            },
          },
          value: {
            __michelsonType: 'int',
            schema: 'int',
          },
        },
      });
    });
  });
});

describe('Map token with annotated pair', () => {
  let token: MapToken;
  beforeEach(() => {
    token = createToken(
      {
        prim: 'map',
        args: [
          {
            prim: 'pair',
            args: [
              { prim: 'string', annots: ['%test'] },
              { prim: 'string', annots: ['%test2'] },
            ],
          },
          { prim: 'int' },
        ],
        annots: [],
      },
      0
    ) as MapToken;
  });

  describe('Encode', () => {
    it('Encode properly an empty map', () => {
      const map = new MichelsonMap();
      const result = token.Encode([map]);
      expect(result).toEqual([]);
    });

    it('Encode properly a map with two value', () => {
      const map = new MichelsonMap();
      map.set({ test: 'test', test2: '1test' }, 2);
      map.set({ test: 'test1', test2: 'test' }, 3);
      const result = token.Encode([map]);
      expect(result).toEqual([
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test' }, { string: '1test' }] }, { int: '2' }],
        },
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test1' }, { string: 'test' }] }, { int: '3' }],
        },
      ]);
    });
  });

  describe('EncodeObject', () => {
    it('EncodeObject properly an empty map', () => {
      const map = new MichelsonMap();
      const result = token.EncodeObject(map);
      expect(result).toEqual([]);
    });

    it('EncodeObject properly a map with two value', () => {
      const map = new MichelsonMap();
      map.set({ test: 'test', test2: '1test' }, 2);
      map.set({ test: 'test1', test2: 'test' }, 3);
      const result = token.EncodeObject(map);
      expect(result).toEqual([
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test' }, { string: '1test' }] }, { int: '2' }],
        },
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test1' }, { string: 'test' }] }, { int: '3' }],
        },
      ]);
    });
  });

  describe('Execute', () => {
    it('Execute properly on empty map storage', () => {
      const result = token.Execute([]) as MichelsonMap<any, any>;

      expect(result).toBeInstanceOf(MichelsonMap);
      expect(result.size).toEqual(0);
    });

    it('Execute properly on storage with two values', () => {
      const result = token.Execute([
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test' }, { string: '1test' }] }, { int: '2' }],
        },
        {
          prim: 'Elt',
          args: [{ prim: 'Pair', args: [{ string: 'test1' }, { string: 'test' }] }, { int: '3' }],
        },
      ]) as MichelsonMap<any, any>;

      expect(result).toBeInstanceOf(MichelsonMap);
      expect(result.size).toEqual(2);

      expect(result.get({ test: 'test', test2: '1test' })).toBeInstanceOf(BigNumber);
      expect(result.get({ test: 'test', test2: '1test' }).toString()).toEqual('2');

      expect(result.get({ test: 'test1', test2: 'test' })).toBeInstanceOf(BigNumber);
      expect(result.get({ test: 'test1', test2: 'test' }).toString()).toEqual('3');
    });
  });

  it('Should generate the schema properly', () => {
    expect(token.generateSchema()).toEqual({
      __michelsonType: 'map',
      schema: {
        key: {
          __michelsonType: 'pair',
          schema: {
            test: {
              __michelsonType: 'string',
              schema: 'string',
            },
            test2: {
              __michelsonType: 'string',
              schema: 'string',
            },
          },
        },
        value: {
          __michelsonType: 'int',
          schema: 'int',
        },
      },
    });
  });
});

describe('Map token with complex pair', () => {
  let token: MapToken;

  const createValue = (
    int: string,
    nat: string,
    str: string,
    bytes: string,
    mutez: string,
    b: string,
    keyHash: string,
    ts: string,
    address: string,
    val = '1000'
  ) => {
    return {
      prim: 'Elt',
      args: [
        {
          prim: 'Pair',
          args: [
            { int: int },
            {
              prim: 'Pair',
              args: [
                { int: nat },
                {
                  prim: 'Pair',
                  args: [
                    { string: str },
                    {
                      prim: 'Pair',
                      args: [
                        { bytes: bytes },
                        {
                          prim: 'Pair',
                          args: [
                            { int: mutez },
                            {
                              prim: 'Pair',
                              args: [
                                { prim: b },
                                {
                                  prim: 'Pair',
                                  args: [
                                    { string: keyHash },
                                    {
                                      prim: 'Pair',
                                      args: [{ string: ts }, { string: address }],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        { int: val },
      ],
    };
  };

  beforeEach(() => {
    token = createToken(
      {
        prim: 'map',
        args: [
          {
            prim: 'pair',
            args: [
              { prim: 'int' },
              {
                prim: 'pair',
                args: [
                  { prim: 'nat' },
                  {
                    prim: 'pair',
                    args: [
                      { prim: 'string' },
                      {
                        prim: 'pair',
                        args: [
                          { prim: 'bytes' },
                          {
                            prim: 'pair',
                            args: [
                              { prim: 'mutez' },
                              {
                                prim: 'pair',
                                args: [
                                  { prim: 'bool' },
                                  {
                                    prim: 'pair',
                                    args: [
                                      { prim: 'key_hash' },
                                      {
                                        prim: 'pair',
                                        args: [{ prim: 'timestamp' }, { prim: 'address' }],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          { prim: 'int' },
        ],
        annots: [],
      },
      0
    ) as MapToken;
  });

  describe('Execute', () => {
    it('Execute properly on empty map storage', () => {
      const result = token.Execute([]) as MichelsonMap<any, any>;

      expect(result).toBeInstanceOf(MichelsonMap);
      expect(result.size).toEqual(0);
    });

    it('Execute properly on 2 values', () => {
      const result = token.Execute([
        createValue(
          '1',
          '2',
          'test',
          'cafe',
          '10',
          'True',
          'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
          '2019-09-06T15:08:29Z',
          'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5'
        ),
        createValue(
          '1',
          '2',
          'test',
          'cafe',
          '10',
          'False',
          'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
          '2019-09-06T15:08:29Z',
          'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5'
        ),
      ]) as MichelsonMap<any, any>;

      expect(result).toBeInstanceOf(MichelsonMap);
      expect(result.size).toEqual(2);

      const value = result.get({
        0: '1',
        1: '2',
        2: 'test',
        3: 'cafe',
        4: '10',
        5: true,
        6: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
        7: '2019-09-06T15:08:29.000Z',
        8: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
      });

      expect(value).toBeInstanceOf(BigNumber);
      expect(value.toString()).toEqual('1000');

      const value2 = result.get({
        0: '1',
        1: '2',
        2: 'test',
        3: 'cafe',
        4: '10',
        5: false,
        6: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
        7: '2019-09-06T15:08:29.000Z',
        8: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
      });

      expect(value2).toBeInstanceOf(BigNumber);
      expect(value2.toString()).toEqual('1000');
    });

    it('EncodeObject with bool as key', () => {
      const map = new MichelsonMap();
      map.set(
        {
          0: '1',
          1: '2',
          2: 'test',
          3: 'cafe',
          4: '10',
          5: false,
          6: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
          7: '2019-09-06T15:08:29.000Z',
          8: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
        },
        1000
      );

      map.set(
        {
          0: '1',
          1: '2',
          2: 'test',
          3: 'cafe',
          4: '10',
          5: true,
          6: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
          7: '2019-09-06T15:08:29.000Z',
          8: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
        },
        101
      );

      const encoded = token.EncodeObject(map);

      expect(encoded[0]).toEqual(
        createValue(
          '1',
          '2',
          'test',
          'cafe',
          '10',
          'False',
          'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
          '2019-09-06T15:08:29.000Z',
          'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5'
        )
      );
      expect(encoded[1]).toEqual(
        createValue(
          '1',
          '2',
          'test',
          'cafe',
          '10',
          'True',
          'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
          '2019-09-06T15:08:29.000Z',
          'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
          '101'
        )
      );
    });
  });

  it('Should generate the schema properly', () => {
    expect(token.generateSchema()).toEqual({
      __michelsonType: 'map',
      schema: {
        key: {
          __michelsonType: 'pair',
          schema: {
            0: {
              __michelsonType: 'int',
              schema: 'int',
            },
            1: {
              __michelsonType: 'nat',
              schema: 'nat',
            },
            2: {
              __michelsonType: 'string',
              schema: 'string',
            },
            3: {
              __michelsonType: 'bytes',
              schema: 'bytes',
            },
            4: {
              __michelsonType: 'mutez',
              schema: 'mutez',
            },
            5: {
              __michelsonType: 'bool',
              schema: 'bool',
            },
            6: {
              __michelsonType: 'key_hash',
              schema: 'key_hash',
            },
            7: {
              __michelsonType: 'timestamp',
              schema: 'timestamp',
            },
            8: {
              __michelsonType: 'address',
              schema: 'address',
            },
          },
        },
        value: {
          __michelsonType: 'int',
          schema: 'int',
        },
      },
    });
  });
});

describe('Map token with nat as key and nat as value', () => {
  let token: MapToken;
  beforeEach(() => {
    token = createToken(
      {
        prim: 'map',
        args: [{ prim: 'nat' }, { prim: 'nat' }],
        annots: [],
      },
      0
    ) as MapToken;
  });

  it('Execute should deserialize type nat in BigNumber', () => {
    const result = token.Execute([
      {
        prim: 'Elt',
        args: [{ int: '5' }, { int: '2' }],
      },
    ]) as MichelsonMap<any, any>;

    expect(result).toBeInstanceOf(MichelsonMap);
    expect(result.keys().next().value).toMatchObject(new BigNumber(5));
    expect(result.values().next().value).toMatchObject(new BigNumber(2));
  });
});
