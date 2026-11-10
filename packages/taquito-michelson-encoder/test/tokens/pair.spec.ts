import { MichelsonV1Expression } from '@taquito/rpc';
import { ParameterSchema, Schema, Token } from '../../src/taquito-michelson-encoder';
import { createToken } from '../../src/tokens/createToken';
import { PairToken } from '../../src/tokens/pair';
import BigNumber from 'bignumber.js';

describe('Pair token', () => {
  const token = createToken(
    {
      prim: 'pair',
      args: [
        { prim: 'int', annots: ['test'] },
        { prim: 'string', annots: ['test2'] },
      ],
    },
    0
  ) as PairToken;
  describe('Compare', () => {
    test('Compare simple pair', () => {
      expect(token.compare({ test: 1, test2: 'test' }, { test: 2, test2: 'test' })).toEqual(-1);
      expect(token.compare({ test: 3, test2: 'test' }, { test: 2, test2: 'test' })).toEqual(1);
      expect(token.compare({ test: 2, test2: 'test' }, { test: 2, test2: 'test' })).toEqual(0);
      expect(token.compare({ test: 2, test2: 'hello' }, { test: 2, test2: 'test' })).toEqual(-1);
      expect(token.compare({ test: 2, test2: 'test' }, { test: 2, test2: 'hello' })).toEqual(1);
    });
  });

  describe('ToBigMapKey', () => {
    test('Simple pair to big map key', () => {
      const { key, type } = token.ToBigMapKey({ test: 1, test2: 'test' });
      expect(key).toEqual({ prim: 'Pair', args: [{ int: '1' }, { string: 'test' }] });
      expect(type).toEqual({ prim: 'pair', args: [{ prim: 'int' }, { prim: 'string' }] });
    });

    it('Nested pair to big map key', () => {
      const token = createToken(
        {
          prim: 'pair',
          args: [
            { prim: 'int', annots: ['test'] },
            {
              prim: 'pair',
              args: [
                { prim: 'string', annots: ['test2'] },
                { prim: 'string', annots: ['test3'] },
              ],
            },
          ],
        },
        0
      ) as PairToken;
      const { key, type } = token.ToBigMapKey({ test: 1, test2: 'test', test3: 'test' });
      expect(key).toEqual({
        prim: 'Pair',
        args: [{ int: '1' }, { prim: 'Pair', args: [{ string: 'test' }, { string: 'test' }] }],
      });
      expect(type).toEqual({
        prim: 'pair',
        args: [{ prim: 'int' }, { prim: 'pair', args: [{ prim: 'string' }, { prim: 'string' }] }],
      });
    });
  });

  describe('generateSchema', () => {
    it('Should generate the schema properly', () => {
      expect(token.generateSchema()).toEqual({
        __michelsonType: 'pair',
        schema: {
          test: {
            __michelsonType: 'int',
            schema: 'int',
          },
          test2: {
            __michelsonType: 'string',
            schema: 'string',
          },
        },
      });
    });
  });
});

describe('Complexe pair token', () => {
  const complexPair = createToken(
    {
      prim: 'pair',
      args: [
        { prim: 'int', annots: ['%simple'] },
        {
          prim: 'pair',
          args: [
            { prim: 'pair', annots: ['%complex'], args: [{ prim: 'nat' }, { prim: 'string' }] },
            {
              prim: 'pair',
              args: [
                {
                  prim: 'pair',
                  annots: ['%optional'],
                  args: [
                    {
                      prim: 'or',
                      args: [
                        { prim: 'int', annots: ['%int'] },
                        { prim: 'string', annots: ['%string'] },
                      ],
                    },
                    {
                      prim: 'or',
                      args: [
                        { prim: 'int', annots: ['%int'] },
                        { prim: 'string', annots: ['%string'] },
                      ],
                    },
                  ],
                },
                {
                  prim: 'option',
                  annots: ['%last_checked_sig'],
                  args: [
                    {
                      prim: 'pair',
                      args: [
                        {
                          prim: 'pair',
                          args: [
                            { prim: 'bytes', annots: ['%msg'] },
                            { prim: 'address', annots: ['%sender'] },
                          ],
                        },
                        { prim: 'signature', annots: ['%sig_'] },
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
    0
  ) as PairToken;

  it('Should generate the schema properly', () => {
    expect(complexPair.generateSchema()).toEqual({
      __michelsonType: 'pair',
      schema: {
        simple: {
          __michelsonType: 'int',
          schema: 'int',
        },
        complex: {
          __michelsonType: 'pair',
          schema: {
            '1': {
              __michelsonType: 'nat',
              schema: 'nat',
            },
            '2': {
              __michelsonType: 'string',
              schema: 'string',
            },
          },
        },
        optional: {
          __michelsonType: 'pair',
          schema: {
            '2': {
              __michelsonType: 'or',
              schema: {
                int: {
                  __michelsonType: 'int',
                  schema: 'int',
                },
                string: {
                  __michelsonType: 'string',
                  schema: 'string',
                },
              },
            },
            '3': {
              __michelsonType: 'or',
              schema: {
                int: {
                  __michelsonType: 'int',
                  schema: 'int',
                },
                string: {
                  __michelsonType: 'string',
                  schema: 'string',
                },
              },
            },
          },
        },
        last_checked_sig: {
          __michelsonType: 'option',
          schema: {
            __michelsonType: 'pair',
            schema: {
              msg: {
                __michelsonType: 'bytes',
                schema: 'bytes',
              },
              sender: {
                __michelsonType: 'address',
                schema: 'address',
              },
              sig_: {
                __michelsonType: 'signature',
                schema: 'signature',
              },
            },
          },
        },
      },
    });
  });

  it('Should encode object properly', () => {
    expect(
      complexPair.EncodeObject({
        simple: 132138771926046,
        complex: {
          1: 132138771926013,
          2: 'Taquito',
        },
        optional: {
          // or null
          3: { int: 4 }, // or {string: 'aaa'}
          4: { string: 'Tezos' }, // or {int: 5}
        },
        last_checked_sig: {
          // or null
          msg: '0554657a6f73205369676e6564204d6573736167653a20626561636f6e2d746573742d646170702e6e65746c6966792e6170702f20323032322d30332d30395431393a34313a31382e3035375a203130',
          sender: 'tz1X1exK5QTHZgj44rVw8BgARdsURGpHa2BL',
          sig_: 'sigfRR4eWYXHRAXafFY5muQoH6Hh43kSLBeDzcPjBsDH5TKQzRATyoMafMtcDp19Gs8BveGbFSm77hzEjioKq2UWKpTF1j6T',
        },
      })
    ).toEqual({
      prim: 'Pair',
      args: [
        {
          int: '132138771926046',
        },
        {
          prim: 'Pair',
          args: [
            {
              prim: 'Pair',
              args: [
                {
                  int: '132138771926013',
                },
                {
                  string: 'Taquito',
                },
              ],
            },
            {
              prim: 'Pair',
              args: [
                {
                  prim: 'Pair',
                  args: [
                    {
                      prim: 'Left',
                      args: [
                        {
                          int: '4',
                        },
                      ],
                    },
                    {
                      prim: 'Right',
                      args: [
                        {
                          string: 'Tezos',
                        },
                      ],
                    },
                  ],
                },
                {
                  prim: 'Some',
                  args: [
                    {
                      prim: 'Pair',
                      args: [
                        {
                          prim: 'Pair',
                          args: [
                            {
                              bytes:
                                '0554657a6f73205369676e6564204d6573736167653a20626561636f6e2d746573742d646170702e6e65746c6966792e6170702f20323032322d30332d30395431393a34313a31382e3035375a203130',
                            },
                            {
                              string: 'tz1X1exK5QTHZgj44rVw8BgARdsURGpHa2BL',
                            },
                          ],
                        },
                        {
                          string:
                            'sigfRR4eWYXHRAXafFY5muQoH6Hh43kSLBeDzcPjBsDH5TKQzRATyoMafMtcDp19Gs8BveGbFSm77hzEjioKq2UWKpTF1j6T',
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
    });
  });
});

describe('PairToken mixed with and without annotations', () => {
  const schema = {
    prim: 'pair',
    args: [
      {
        prim: 'pair',
        args: [
          {
            prim: 'pair',
            args: [{ prim: 'int' }, { prim: 'int' }],
            annots: ['%A3'],
          },
          { prim: 'int' },
        ],
      },
      { prim: 'bool' },
    ],
  };

  const michelineJson = {
    prim: 'Pair',
    args: [
      {
        prim: 'Pair',
        args: [{ prim: 'Pair', args: [{ int: '11' }, { int: '22' }] }, { int: '33' }],
      },
      { prim: 'True' },
    ],
  };

  const javaScriptObject = new Schema(schema).Execute(michelineJson);

  it('Should decode mixed annotated pairs', () => {
    expect(javaScriptObject).toEqual({
      1: new BigNumber(33),
      2: true,
      A3: {
        0: new BigNumber(11),
        1: new BigNumber(22),
      },
    });
  });
});

describe('PairToken nested left-child field counting', () => {
  const nat = (annot?: string): MichelsonV1Expression =>
    annot ? { prim: 'nat', annots: [annot] } : { prim: 'nat' };
  const pair = (...args: MichelsonV1Expression[]): MichelsonV1Expression => ({
    prim: 'pair',
    args,
  });
  const Pair = (...args: MichelsonV1Expression[]): MichelsonV1Expression => ({
    prim: 'Pair',
    args,
  });
  const intVal = (n: number): MichelsonV1Expression => ({ int: String(n) });

  describe('distinct leaf types in pair (pair (pair nat string) bytes) bool', () => {
    const type = pair(
      pair(pair({ prim: 'nat' }, { prim: 'string' }), { prim: 'bytes' }),
      { prim: 'bool' }
    );
    const inputObj = { 0: 7, 1: 'hello', 2: 'cafe', 3: false };
    const expectedMicheline = Pair(
      Pair(Pair({ int: '7' }, { string: 'hello' }), { bytes: 'cafe' }),
      { prim: 'False' }
    );

    it('generates schema with all 4 distinct leaf types', () => {
      const schema = new Schema(type);
      expect(schema.generateSchema()).toEqual({
        __michelsonType: 'pair',
        schema: {
          0: { __michelsonType: 'nat', schema: 'nat' },
          1: { __michelsonType: 'string', schema: 'string' },
          2: { __michelsonType: 'bytes', schema: 'bytes' },
          3: { __michelsonType: 'bool', schema: 'bool' },
        },
      });
    });

    it('decodes all 4 distinct leaf values without overwriting field 2', () => {
      const schema = new Schema(type);
      expect(schema.Execute(expectedMicheline)).toEqual({
        0: new BigNumber(7),
        1: 'hello',
        2: 'cafe',
        3: false,
      });
    });

    it('encodes field 3 as False rather than reading truthy field 2', () => {
      const schema = new Schema(type);
      const paramSchema = new ParameterSchema(type);
      expect(schema.Encode(inputObj)).toEqual(expectedMicheline);
      expect(paramSchema.EncodeObject(inputObj)).toEqual(expectedMicheline);
      expect(paramSchema.EncodeObject(inputObj)).toEqual(
        paramSchema.Encode(7, 'hello', 'cafe', false)
      );
    });
  });

  describe.each([
    {
      name: 'pair a (pair b (pair c d))',
      type: pair(nat(), pair(nat(), pair(nat(), nat()))),
      micheline: Pair(intVal(1), Pair(intVal(2), Pair(intVal(3), intVal(4)))),
      expectedKeys: ['0', '1', '2', '3'],
      inputObj: { 0: 1, 1: 2, 2: 3, 3: 4 },
      expectedDecoded: {
        0: new BigNumber(1),
        1: new BigNumber(2),
        2: new BigNumber(3),
        3: new BigNumber(4),
      },
      flatArgs: [1, 2, 3, 4],
    },
    {
      name: 'pair (pair a b) c',
      type: pair(pair(nat(), nat()), nat()),
      micheline: Pair(Pair(intVal(1), intVal(2)), intVal(3)),
      expectedKeys: ['0', '1', '2'],
      inputObj: { 0: 1, 1: 2, 2: 3 },
      expectedDecoded: {
        0: new BigNumber(1),
        1: new BigNumber(2),
        2: new BigNumber(3),
      },
      flatArgs: [1, 2, 3],
    },
    {
      name: 'pair (pair a b) (pair c d)',
      type: pair(pair(nat(), nat()), pair(nat(), nat())),
      micheline: Pair(Pair(intVal(1), intVal(2)), Pair(intVal(3), intVal(4))),
      expectedKeys: ['0', '1', '2', '3'],
      inputObj: { 0: 1, 1: 2, 2: 3, 3: 4 },
      expectedDecoded: {
        0: new BigNumber(1),
        1: new BigNumber(2),
        2: new BigNumber(3),
        3: new BigNumber(4),
      },
      flatArgs: [1, 2, 3, 4],
    },
    {
      name: 'pair (pair (pair a b) c) d',
      type: pair(pair(pair(nat(), nat()), nat()), nat()),
      micheline: Pair(Pair(Pair(intVal(1), intVal(2)), intVal(3)), intVal(4)),
      expectedKeys: ['0', '1', '2', '3'],
      inputObj: { 0: 1, 1: 2, 2: 3, 3: 4 },
      expectedDecoded: {
        0: new BigNumber(1),
        1: new BigNumber(2),
        2: new BigNumber(3),
        3: new BigNumber(4),
      },
      flatArgs: [1, 2, 3, 4],
    },
    {
      name: 'pair (pair a (pair b c)) d',
      type: pair(pair(nat(), pair(nat(), nat())), nat()),
      micheline: Pair(Pair(intVal(1), Pair(intVal(2), intVal(3))), intVal(4)),
      expectedKeys: ['0', '1', '2', '3'],
      inputObj: { 0: 1, 1: 2, 2: 3, 3: 4 },
      expectedDecoded: {
        0: new BigNumber(1),
        1: new BigNumber(2),
        2: new BigNumber(3),
        3: new BigNumber(4),
      },
      flatArgs: [1, 2, 3, 4],
    },
    {
      name: 'pair (pair a b c) d (comb pair inside left child)',
      type: pair(pair(nat(), nat(), nat()), nat()),
      micheline: Pair(Pair(intVal(1), Pair(intVal(2), intVal(3))), intVal(4)),
      expectedKeys: ['0', '1', '2', '3'],
      inputObj: { 0: 1, 1: 2, 2: 3, 3: 4 },
      expectedDecoded: {
        0: new BigNumber(1),
        1: new BigNumber(2),
        2: new BigNumber(3),
        3: new BigNumber(4),
      },
      flatArgs: [1, 2, 3, 4],
    },
    {
      name: 'pair (pair (pair a b) (pair c d)) (pair e f)',
      type: pair(pair(pair(nat(), nat()), pair(nat(), nat())), pair(nat(), nat())),
      micheline: Pair(
        Pair(Pair(intVal(1), intVal(2)), Pair(intVal(3), intVal(4))),
        Pair(intVal(5), intVal(6))
      ),
      expectedKeys: ['0', '1', '2', '3', '4', '5'],
      inputObj: { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6 },
      expectedDecoded: {
        0: new BigNumber(1),
        1: new BigNumber(2),
        2: new BigNumber(3),
        3: new BigNumber(4),
        4: new BigNumber(5),
        5: new BigNumber(6),
      },
      flatArgs: [1, 2, 3, 4, 5, 6],
    },
    {
      name: 'pair (pair (pair (pair a b) c) d) e (depth-4 left comb)',
      type: pair(pair(pair(pair(nat(), nat()), nat()), nat()), nat()),
      micheline: Pair(
        Pair(Pair(Pair(intVal(1), intVal(2)), intVal(3)), intVal(4)),
        intVal(5)
      ),
      expectedKeys: ['0', '1', '2', '3', '4'],
      inputObj: { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 },
      expectedDecoded: {
        0: new BigNumber(1),
        1: new BigNumber(2),
        2: new BigNumber(3),
        3: new BigNumber(4),
        4: new BigNumber(5),
      },
      flatArgs: [1, 2, 3, 4, 5],
    },
    {
      name: 'pair a (pair (pair (pair b c) d) e) (non-zero starting offset + 3-field left child)',
      type: pair(nat(), pair(pair(pair(nat(), nat()), nat()), nat())),
      micheline: Pair(
        intVal(1),
        Pair(Pair(Pair(intVal(2), intVal(3)), intVal(4)), intVal(5))
      ),
      expectedKeys: ['0', '1', '2', '3', '4'],
      inputObj: { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 },
      expectedDecoded: {
        0: new BigNumber(1),
        1: new BigNumber(2),
        2: new BigNumber(3),
        3: new BigNumber(4),
        4: new BigNumber(5),
      },
      flatArgs: [1, 2, 3, 4, 5],
    },
    {
      name: 'pair (pair (pair %a %b) %c) %d',
      type: pair(pair(pair(nat('%a'), nat('%b')), nat('%c')), nat('%d')),
      micheline: Pair(Pair(Pair(intVal(1), intVal(2)), intVal(3)), intVal(4)),
      expectedKeys: ['a', 'b', 'c', 'd'],
      inputObj: { a: 1, b: 2, c: 3, d: 4 },
      expectedDecoded: {
        a: new BigNumber(1),
        b: new BigNumber(2),
        c: new BigNumber(3),
        d: new BigNumber(4),
      },
      flatArgs: [1, 2, 3, 4],
    },
    {
      name: 'pair (pair (pair %a %b) %c) d',
      type: pair(pair(pair(nat('%a'), nat('%b')), nat('%c')), nat()),
      micheline: Pair(Pair(Pair(intVal(1), intVal(2)), intVal(3)), intVal(4)),
      expectedKeys: ['3', 'a', 'b', 'c'],
      inputObj: { a: 1, b: 2, c: 3, 3: 4 },
      expectedDecoded: {
        a: new BigNumber(1),
        b: new BigNumber(2),
        c: new BigNumber(3),
        3: new BigNumber(4),
      },
      flatArgs: [1, 2, 3, 4],
    },
  ])('$name', ({ type, micheline, expectedKeys, inputObj, expectedDecoded, flatArgs }) => {
    it('generates expected schema keys', () => {
      const schema = new Schema(type);
      expect(Object.keys(schema.generateSchema().schema)).toEqual(expectedKeys);
    });

    it('decodes all fields with Execute and ToKey', () => {
      const schema = new Schema(type);
      const token = createToken(type, 0) as PairToken;
      expect(schema.Execute(micheline)).toEqual(expectedDecoded);
      expect(token.ToKey(micheline)).toEqual(expectedDecoded);
    });

    it('encodes all fields with Schema.Encode, ParameterSchema.EncodeObject, and ToBigMapKey', () => {
      const schema = new Schema(type);
      const paramSchema = new ParameterSchema(type);
      const token = createToken(type, 0) as PairToken;
      expect(schema.Encode(inputObj)).toEqual(micheline);
      expect(paramSchema.EncodeObject(inputObj)).toEqual(micheline);
      expect(paramSchema.EncodeObject(inputObj)).toEqual(paramSchema.Encode(...flatArgs));
      expect(token.ToBigMapKey(inputObj).key).toEqual(micheline);
    });
  });

  describe('compare() with >2-field left children', () => {
    it('compares trailing and earlier fields in pair (pair (pair a b) c) d', () => {
      const token = createToken(pair(pair(pair(nat(), nat()), nat()), nat()), 0) as PairToken;
      expect(token.compare({ 0: 1, 1: 2, 2: 3, 3: 4 }, { 0: 1, 1: 2, 2: 3, 3: 5 })).toEqual(-1);
      expect(token.compare({ 0: 1, 1: 2, 2: 3, 3: 5 }, { 0: 1, 1: 2, 2: 3, 3: 4 })).toEqual(1);
      expect(token.compare({ 0: 1, 1: 2, 2: 3, 3: 4 }, { 0: 1, 1: 2, 2: 3, 3: 4 })).toEqual(0);
      expect(token.compare({ 0: 1, 1: 2, 2: 2, 3: 9 }, { 0: 1, 1: 2, 2: 3, 3: 1 })).toEqual(-1);
    });

    it('compares trailing field with non-zero starting offset in pair a (pair (pair (pair b c) d) e)', () => {
      const token = createToken(
        pair(nat(), pair(pair(pair(nat(), nat()), nat()), nat())),
        0
      ) as PairToken;
      expect(
        token.compare({ 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 }, { 0: 1, 1: 2, 2: 3, 3: 4, 4: 6 })
      ).toEqual(-1);
      expect(
        token.compare({ 0: 1, 1: 2, 2: 3, 3: 4, 4: 6 }, { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 })
      ).toEqual(1);
      expect(
        token.compare({ 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 }, { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5 })
      ).toEqual(0);
    });
  });

  describe('OrToken inside PairToken field numbering', () => {
    let previousStrategy: typeof Token.fieldNumberingStrategy;

    beforeEach(() => {
      previousStrategy = Token.fieldNumberingStrategy;
    });

    afterEach(() => {
      Token.fieldNumberingStrategy = previousStrategy;
    });

    it('extracts complete signatures for 2-branch, 3-branch, and 4-branch left OrTokens in Legacy mode', () => {
      Token.fieldNumberingStrategy = 'Legacy';

      const twoBranchLeft = new ParameterSchema(
        pair(
          { prim: 'or', args: [{ prim: 'nat' }, { prim: 'string' }] },
          { prim: 'or', args: [{ prim: 'int' }, { prim: 'bytes' }] }
        )
      );
      expect(twoBranchLeft.ExtractSignatures()).toEqual([
        ['0', { __michelsonType: 'nat', schema: 'nat' }, '2', { __michelsonType: 'int', schema: 'int' }],
        ['0', { __michelsonType: 'nat', schema: 'nat' }, '3', { __michelsonType: 'bytes', schema: 'bytes' }],
        ['1', { __michelsonType: 'string', schema: 'string' }, '2', { __michelsonType: 'int', schema: 'int' }],
        ['1', { __michelsonType: 'string', schema: 'string' }, '3', { __michelsonType: 'bytes', schema: 'bytes' }],
      ]);

      const threeBranchLeft = new ParameterSchema(
        pair(
          {
            prim: 'or',
            args: [
              { prim: 'or', args: [{ prim: 'nat' }, { prim: 'string' }] },
              { prim: 'bool' },
            ],
          },
          { prim: 'or', args: [{ prim: 'int' }, { prim: 'bytes' }] }
        )
      );
      expect(threeBranchLeft.ExtractSignatures()).toEqual([
        ['0', { __michelsonType: 'nat', schema: 'nat' }, '3', { __michelsonType: 'int', schema: 'int' }],
        ['0', { __michelsonType: 'nat', schema: 'nat' }, '4', { __michelsonType: 'bytes', schema: 'bytes' }],
        ['1', { __michelsonType: 'string', schema: 'string' }, '3', { __michelsonType: 'int', schema: 'int' }],
        ['1', { __michelsonType: 'string', schema: 'string' }, '4', { __michelsonType: 'bytes', schema: 'bytes' }],
        ['2', { __michelsonType: 'bool', schema: 'bool' }, '3', { __michelsonType: 'int', schema: 'int' }],
        ['2', { __michelsonType: 'bool', schema: 'bool' }, '4', { __michelsonType: 'bytes', schema: 'bytes' }],
      ]);

      const fourBranchLeft = new ParameterSchema(
        pair(
          {
            prim: 'or',
            args: [
              { prim: 'or', args: [{ prim: 'nat' }, { prim: 'string' }] },
              { prim: 'or', args: [{ prim: 'bool' }, { prim: 'mutez' }] },
            ],
          },
          { prim: 'or', args: [{ prim: 'int' }, { prim: 'bytes' }] }
        )
      );
      expect(fourBranchLeft.ExtractSignatures()).toEqual([
        ['0', { __michelsonType: 'nat', schema: 'nat' }, '4', { __michelsonType: 'int', schema: 'int' }],
        ['0', { __michelsonType: 'nat', schema: 'nat' }, '5', { __michelsonType: 'bytes', schema: 'bytes' }],
        ['1', { __michelsonType: 'string', schema: 'string' }, '4', { __michelsonType: 'int', schema: 'int' }],
        ['1', { __michelsonType: 'string', schema: 'string' }, '5', { __michelsonType: 'bytes', schema: 'bytes' }],
        ['2', { __michelsonType: 'bool', schema: 'bool' }, '4', { __michelsonType: 'int', schema: 'int' }],
        ['2', { __michelsonType: 'bool', schema: 'bool' }, '5', { __michelsonType: 'bytes', schema: 'bytes' }],
        ['3', { __michelsonType: 'mutez', schema: 'mutez' }, '4', { __michelsonType: 'int', schema: 'int' }],
        ['3', { __michelsonType: 'mutez', schema: 'mutez' }, '5', { __michelsonType: 'bytes', schema: 'bytes' }],
      ]);

      const nonZeroOffsetThreeBranchLeft = new ParameterSchema(
        pair(
          { prim: 'nat' },
          pair(
            {
              prim: 'or',
              args: [
                { prim: 'or', args: [{ prim: 'nat' }, { prim: 'string' }] },
                { prim: 'bool' },
              ],
            },
            { prim: 'or', args: [{ prim: 'int' }, { prim: 'bytes' }] }
          )
        )
      );
      expect(nonZeroOffsetThreeBranchLeft.ExtractSignatures()).toEqual([
        [{ __michelsonType: 'nat', schema: 'nat' }, '1', { __michelsonType: 'nat', schema: 'nat' }, '4', { __michelsonType: 'int', schema: 'int' }],
        [{ __michelsonType: 'nat', schema: 'nat' }, '1', { __michelsonType: 'nat', schema: 'nat' }, '5', { __michelsonType: 'bytes', schema: 'bytes' }],
        [{ __michelsonType: 'nat', schema: 'nat' }, '2', { __michelsonType: 'string', schema: 'string' }, '4', { __michelsonType: 'int', schema: 'int' }],
        [{ __michelsonType: 'nat', schema: 'nat' }, '2', { __michelsonType: 'string', schema: 'string' }, '5', { __michelsonType: 'bytes', schema: 'bytes' }],
        [{ __michelsonType: 'nat', schema: 'nat' }, '3', { __michelsonType: 'bool', schema: 'bool' }, '4', { __michelsonType: 'int', schema: 'int' }],
        [{ __michelsonType: 'nat', schema: 'nat' }, '3', { __michelsonType: 'bool', schema: 'bool' }, '5', { __michelsonType: 'bytes', schema: 'bytes' }],
      ]);
    });

    it('resets OrToken child branch numbering under PairToken in Latest mode', () => {
      Token.fieldNumberingStrategy = 'Latest';
      const paramSchema = new ParameterSchema(
        pair(
          {
            prim: 'or',
            args: [
              { prim: 'or', args: [{ prim: 'nat' }, { prim: 'string' }] },
              { prim: 'bool' },
            ],
          },
          { prim: 'or', args: [{ prim: 'int' }, { prim: 'bytes' }] }
        )
      );
      expect(paramSchema.ExtractSignatures()).toEqual([
        ['0', { __michelsonType: 'nat', schema: 'nat' }, '0', { __michelsonType: 'int', schema: 'int' }],
        ['0', { __michelsonType: 'nat', schema: 'nat' }, '1', { __michelsonType: 'bytes', schema: 'bytes' }],
        ['1', { __michelsonType: 'string', schema: 'string' }, '0', { __michelsonType: 'int', schema: 'int' }],
        ['1', { __michelsonType: 'string', schema: 'string' }, '1', { __michelsonType: 'bytes', schema: 'bytes' }],
        ['2', { __michelsonType: 'bool', schema: 'bool' }, '0', { __michelsonType: 'int', schema: 'int' }],
        ['2', { __michelsonType: 'bool', schema: 'bool' }, '1', { __michelsonType: 'bytes', schema: 'bytes' }],
      ]);
    });

    it('passes the 3-field offset to a right OrToken in Legacy positional Encode() for both Left and Right branches', () => {
      Token.fieldNumberingStrategy = 'Legacy';
      const type = pair(
        pair(pair(nat(), nat()), nat()),
        {
          prim: 'or',
          args: [{ prim: 'nat' }, { prim: 'string' }],
        }
      );

      const paramSchema = new ParameterSchema(type);

      expect(paramSchema.Encode(1, 2, 3, '3', 99)).toEqual(
        Pair(Pair(Pair(intVal(1), intVal(2)), intVal(3)), {
          prim: 'Left',
          args: [intVal(99)],
        })
      );
      expect(paramSchema.Encode(1, 2, 3, '4', 'hello')).toEqual(
        Pair(Pair(Pair(intVal(1), intVal(2)), intVal(3)), {
          prim: 'Right',
          args: [{ string: 'hello' }],
        })
      );
    });
  });
});
