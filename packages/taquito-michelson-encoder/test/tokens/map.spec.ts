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
});
