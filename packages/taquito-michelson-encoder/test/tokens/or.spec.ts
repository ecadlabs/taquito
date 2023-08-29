import BigNumber from 'bignumber.js';
import {
  token,
  token2LevelOrMixedAnnots,
  token3LevelOrMixedAnnots,
  tokenComplex,
  tokenComplexNoAnnots,
  tokenNestedOr,
  tokenNestedOrWithoutAnnot,
  tokenNoAnnots,
  tokenOrWithOption,
} from '../data/or-tokens';

describe('Or token', () => {
  describe('EncodeObject', () => {
    it('Should throw unless input is an object with single key', () => {
      expect(() => tokenNoAnnots.EncodeObject(undefined)).toThrow(
        'EncodeObject expects an object with a single key but got:'
      );
      expect(() => tokenNoAnnots.EncodeObject(null)).toThrow(
        'EncodeObject expects an object with a single key but got:'
      );
      expect(() => tokenNoAnnots.EncodeObject([])).toThrow(
        'EncodeObject expects an object with a single key but got:'
      );
      expect(() => tokenNoAnnots.EncodeObject([10, 0])).toThrow(
        'EncodeObject expects an object with a single key but got:'
      );
      expect(() => tokenNoAnnots.EncodeObject({})).toThrow(
        'EncodeObject expects an object with a single key but got:'
      );
      expect(() => tokenNoAnnots.EncodeObject({ '0': 10, '1': '10' })).toThrow(
        'EncodeObject expects an object with a single key but got:'
      );
    });

    it('For nested or with mixed annots, generateSchema, encodeObject and execute should be consistent', () => {
      const schema2LevelMixedAnnots = token2LevelOrMixedAnnots.generateSchema();
      expect(schema2LevelMixedAnnots).toEqual({
        __michelsonType: 'or',
        schema: {
          '0': { __michelsonType: 'int', schema: 'int' },
          '2': { __michelsonType: 'bool', schema: 'bool' },
          A: { __michelsonType: 'nat', schema: 'nat' },
        },
      });

      const leftLeft = {
        prim: 'Left',
        args: [{ prim: 'Left', args: [{ int: '10' }] }],
      };
      expect(token2LevelOrMixedAnnots.EncodeObject({ 0: 10 })).toEqual(leftLeft);
      expect(token2LevelOrMixedAnnots.Execute(leftLeft)).toEqual({
        0: BigNumber(10),
      });

      const leftRight = {
        prim: 'Left',
        args: [{ prim: 'Right', args: [{ int: '10' }] }],
      };
      expect(token2LevelOrMixedAnnots.EncodeObject({ A: 10 })).toEqual(leftRight);
      expect(token2LevelOrMixedAnnots.Execute(leftRight)).toEqual({
        A: BigNumber(10),
      });

      const right = {
        prim: 'Right',
        args: [{ prim: 'True' }],
      };
      expect(token2LevelOrMixedAnnots.EncodeObject({ 2: true })).toEqual(right);
      expect(token2LevelOrMixedAnnots.Execute(right)).toEqual({ 2: true });

      let schema3LevelMixedAnnots = token3LevelOrMixedAnnots.generateSchema();
      expect(schema3LevelMixedAnnots).toEqual({
        __michelsonType: 'or',
        schema: {
          0: { __michelsonType: 'bytes', schema: 'bytes' },
          1: { __michelsonType: 'int', schema: 'int' },
          2: { __michelsonType: 'nat', schema: 'nat' },
          3: { __michelsonType: 'bool', schema: 'bool' },
        },
      });
      schema3LevelMixedAnnots = token3LevelOrMixedAnnots.ExtractSchema();
      expect(schema3LevelMixedAnnots).toEqual({
        0: 'bytes',
        1: 'int',
        2: 'nat',
        3: 'bool',
      });
      schema3LevelMixedAnnots = token3LevelOrMixedAnnots.ExtractSignature();
      expect(schema3LevelMixedAnnots).toEqual([
        ['0', 'bytes'],
        ['1', 'int'],
        ['2', 'nat'],
        ['3', 'bool'],
      ]);

      const left = { prim: 'Left', args: [{ bytes: '5674' }] };
      expect(token3LevelOrMixedAnnots.EncodeObject({ 0: '5674' })).toEqual(left);
      expect(token3LevelOrMixedAnnots.Execute(left)).toEqual({
        0: '5674',
      });

      const rightLeftLeft = {
        prim: 'Right',
        args: [{ prim: 'Left', args: [{ prim: 'Left', args: [{ int: '10' }] }] }],
      };
      expect(token3LevelOrMixedAnnots.EncodeObject({ 1: 10 })).toEqual(rightLeftLeft);
      expect(token3LevelOrMixedAnnots.Execute(rightLeftLeft)).toEqual({
        1: BigNumber(10),
      });

      const rightLeftRight = {
        prim: 'Right',
        args: [{ prim: 'Left', args: [{ prim: 'Right', args: [{ int: '10' }] }] }],
      };
      expect(token3LevelOrMixedAnnots.EncodeObject({ 2: 10 })).toEqual(rightLeftRight);
      expect(token3LevelOrMixedAnnots.Execute(rightLeftRight)).toEqual({
        2: BigNumber(10),
      });

      const rightRight = {
        prim: 'Right',
        args: [{ prim: 'Right', args: [{ prim: 'True' }] }],
      };
      expect(token3LevelOrMixedAnnots.EncodeObject({ 3: true })).toEqual(rightRight);
      expect(token3LevelOrMixedAnnots.Execute(rightRight)).toEqual({ 3: true });
    });

    it('Should encode properly', () => {
      expect(token.EncodeObject({ intTest: 10 })).toEqual({
        prim: 'Left',
        args: [{ int: '10' }],
      });
      expect(token.EncodeObject({ stringTest: '10' })).toEqual({
        prim: 'Right',
        args: [{ string: '10' }],
      });

      expect(tokenNoAnnots.EncodeObject({ 0: 10 })).toEqual({
        prim: 'Left',
        args: [{ int: '10' }],
      });
      expect(tokenNoAnnots.EncodeObject({ 1: '10' })).toEqual({
        prim: 'Right',
        args: [{ string: '10' }],
      });

      expect(
        tokenComplexNoAnnots.EncodeObject({
          0: { 0: 4, 1: 3, 2: '2019-09-06T15:08:29.000Z' },
        })
      ).toEqual({
        prim: 'Left',
        args: [
          {
            prim: 'Left',
            args: [
              {
                prim: 'Pair',
                args: [
                  { int: '4' },
                  {
                    prim: 'Pair',
                    args: [{ int: '3' }, { string: '2019-09-06T15:08:29.000Z' }],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(
        tokenComplexNoAnnots.EncodeObject({
          1: { 1: 3, 2: 4, 3: 31, 4: '2019-09-06T15:08:29.000Z' },
        })
      ).toEqual({
        prim: 'Left',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Pair',
                args: [
                  { prim: 'Pair', args: [{ int: '3' }, { int: '4' }] },
                  {
                    prim: 'Pair',
                    args: [{ int: '31' }, { string: '2019-09-06T15:08:29.000Z' }],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(tokenComplexNoAnnots.EncodeObject({ 2: { 2: 3, 3: 'test' } })).toEqual({
        prim: 'Right',
        args: [
          {
            prim: 'Left',
            args: [{ prim: 'Pair', args: [{ int: '3' }, { string: 'test' }] }],
          },
        ],
      });
      expect(
        tokenComplexNoAnnots.EncodeObject({
          3: { 3: 4, 4: 3, 5: '2019-09-06T15:08:29.000Z' },
        })
      ).toEqual({
        prim: 'Right',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Left',
                args: [
                  {
                    prim: 'Pair',
                    args: [
                      { int: '4' },
                      {
                        prim: 'Pair',
                        args: [{ int: '3' }, { string: '2019-09-06T15:08:29.000Z' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(tokenComplexNoAnnots.EncodeObject({ 4: 4 })).toEqual({
        prim: 'Right',
        args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '4' }] }] }],
      });

      expect(
        tokenComplex.EncodeObject({
          option0: { 0: 4, 1: 3, 2: '2019-09-06T15:08:29.000Z' },
        })
      ).toEqual({
        prim: 'Left',
        args: [
          {
            prim: 'Left',
            args: [
              {
                prim: 'Pair',
                args: [
                  { int: '4' },
                  {
                    prim: 'Pair',
                    args: [{ int: '3' }, { string: '2019-09-06T15:08:29.000Z' }],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(
        tokenComplex.EncodeObject({
          option1: { 1: 3, 2: 4, 3: 31, 4: '2019-09-06T15:08:29.000Z' },
        })
      ).toEqual({
        prim: 'Left',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Pair',
                args: [
                  { prim: 'Pair', args: [{ int: '3' }, { int: '4' }] },
                  {
                    prim: 'Pair',
                    args: [{ int: '31' }, { string: '2019-09-06T15:08:29.000Z' }],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(tokenComplex.EncodeObject({ option2: { 2: 3, 3: 'test' } })).toEqual({
        prim: 'Right',
        args: [
          {
            prim: 'Left',
            args: [{ prim: 'Pair', args: [{ int: '3' }, { string: 'test' }] }],
          },
        ],
      });
      expect(
        tokenComplex.EncodeObject({
          option3: { 3: 4, 4: 3, 5: '2019-09-06T15:08:29.000Z' },
        })
      ).toEqual({
        prim: 'Right',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Left',
                args: [
                  {
                    prim: 'Pair',
                    args: [
                      { int: '4' },
                      {
                        prim: 'Pair',
                        args: [{ int: '3' }, { string: '2019-09-06T15:08:29.000Z' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(tokenComplex.EncodeObject({ option4: 4 })).toEqual({
        prim: 'Right',
        args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '4' }] }] }],
      });

      expect(tokenOrWithOption.EncodeObject({ 3: { 1: 'test' } })).toEqual({
        prim: 'Right',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Right',
                args: [
                  {
                    prim: 'Some',
                    args: [{ prim: 'Right', args: [{ string: 'test' }] }],
                  },
                ],
              },
            ],
          },
        ],
      });
    });
  });

  describe('Encode', () => {
    it('Should encode properly', () => {
      expect(token.Encode([10, 'intTest'])).toEqual({
        prim: 'Left',
        args: [{ int: '10' }],
      });
      expect(token.Encode(['10', 'stringTest'])).toEqual({
        prim: 'Right',
        args: [{ string: '10' }],
      });

      expect(tokenNoAnnots.Encode([10, 0])).toEqual({
        prim: 'Left',
        args: [{ int: '10' }],
      });
      expect(tokenNoAnnots.Encode(['10', 1])).toEqual({
        prim: 'Right',
        args: [{ string: '10' }],
      });

      //last element of the array is the index
      expect(tokenComplexNoAnnots.Encode(['2019-09-06T15:08:29.000Z', 3, 4, 0])).toEqual({
        prim: 'Left',
        args: [
          {
            prim: 'Left',
            args: [
              {
                prim: 'Pair',
                args: [
                  { int: '4' },
                  {
                    prim: 'Pair',
                    args: [{ int: '3' }, { string: '2019-09-06T15:08:29.000Z' }],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(tokenComplexNoAnnots.Encode(['2019-09-06T15:08:29.000Z', 31, 4, 3, 1])).toEqual({
        prim: 'Left',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Pair',
                args: [
                  { prim: 'Pair', args: [{ int: '3' }, { int: '4' }] },
                  {
                    prim: 'Pair',
                    args: [{ int: '31' }, { string: '2019-09-06T15:08:29.000Z' }],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(tokenComplexNoAnnots.Encode(['test', 3, 2])).toEqual({
        prim: 'Right',
        args: [
          {
            prim: 'Left',
            args: [{ prim: 'Pair', args: [{ int: '3' }, { string: 'test' }] }],
          },
        ],
      });
      expect(tokenComplexNoAnnots.Encode(['2019-09-06T15:08:29.000Z', 3, 4, 3])).toEqual({
        prim: 'Right',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Left',
                args: [
                  {
                    prim: 'Pair',
                    args: [
                      { int: '4' },
                      {
                        prim: 'Pair',
                        args: [{ int: '3' }, { string: '2019-09-06T15:08:29.000Z' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(tokenComplexNoAnnots.Encode([4, 4])).toEqual({
        prim: 'Right',
        args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '4' }] }] }],
      });

      //last element of the array is the annots
      expect(tokenComplex.Encode(['2019-09-06T15:08:29.000Z', 3, 4, 'option0'])).toEqual({
        prim: 'Left',
        args: [
          {
            prim: 'Left',
            args: [
              {
                prim: 'Pair',
                args: [
                  { int: '4' },
                  {
                    prim: 'Pair',
                    args: [{ int: '3' }, { string: '2019-09-06T15:08:29.000Z' }],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(tokenComplex.Encode(['2019-09-06T15:08:29.000Z', 31, 4, 3, 'option1'])).toEqual({
        prim: 'Left',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Pair',
                args: [
                  { prim: 'Pair', args: [{ int: '3' }, { int: '4' }] },
                  {
                    prim: 'Pair',
                    args: [{ int: '31' }, { string: '2019-09-06T15:08:29.000Z' }],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(tokenComplex.Encode(['test', 3, 'option2'])).toEqual({
        prim: 'Right',
        args: [
          {
            prim: 'Left',
            args: [{ prim: 'Pair', args: [{ int: '3' }, { string: 'test' }] }],
          },
        ],
      });
      expect(tokenComplex.Encode(['2019-09-06T15:08:29.000Z', 3, 4, 'option3'])).toEqual({
        prim: 'Right',
        args: [
          {
            prim: 'Right',
            args: [
              {
                prim: 'Left',
                args: [
                  {
                    prim: 'Pair',
                    args: [
                      { int: '4' },
                      {
                        prim: 'Pair',
                        args: [{ int: '3' }, { string: '2019-09-06T15:08:29.000Z' }],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      });
      expect(tokenComplex.Encode([4, 'option4'])).toEqual({
        prim: 'Right',
        args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '4' }] }] }],
      });
    });
  });

  describe('ExtractSchema', () => {
    it('Should extract schema properly', () => {
      expect(token.ExtractSchema()).toEqual({
        intTest: 'int',
        stringTest: 'string',
      });

      expect(token.generateSchema()).toEqual({
        __michelsonType: 'or',
        schema: {
          intTest: {
            __michelsonType: 'int',
            schema: 'int',
          },
          stringTest: {
            __michelsonType: 'string',
            schema: 'string',
          },
        },
      });

      expect(tokenNoAnnots.ExtractSchema()).toEqual({
        0: 'int',
        1: 'string',
      });

      expect(tokenNoAnnots.generateSchema()).toEqual({
        __michelsonType: 'or',
        schema: {
          0: {
            __michelsonType: 'int',
            schema: 'int',
          },
          1: {
            __michelsonType: 'string',
            schema: 'string',
          },
        },
      });

      expect(tokenComplexNoAnnots.ExtractSchema()).toEqual({
        0: { 0: 'nat', 1: 'nat', 2: 'timestamp' },
        1: { 1: 'nat', 2: 'mutez', 3: 'nat', 4: 'timestamp' },
        2: { 2: 'nat', 3: 'timestamp' },
        3: { 3: 'nat', 4: 'mutez', 5: 'timestamp' },
        4: 'nat',
      });

      expect(tokenComplexNoAnnots.generateSchema()).toEqual({
        __michelsonType: 'or',
        schema: {
          0: {
            __michelsonType: 'pair',
            schema: {
              0: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              1: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              2: {
                __michelsonType: 'timestamp',
                schema: 'timestamp',
              },
            },
          },
          1: {
            __michelsonType: 'pair',
            schema: {
              1: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              2: {
                __michelsonType: 'mutez',
                schema: 'mutez',
              },
              3: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              4: {
                __michelsonType: 'timestamp',
                schema: 'timestamp',
              },
            },
          },
          2: {
            __michelsonType: 'pair',
            schema: {
              2: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              3: {
                __michelsonType: 'timestamp',
                schema: 'timestamp',
              },
            },
          },
          3: {
            __michelsonType: 'pair',
            schema: {
              3: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              4: {
                __michelsonType: 'mutez',
                schema: 'mutez',
              },
              5: {
                __michelsonType: 'timestamp',
                schema: 'timestamp',
              },
            },
          },
          4: {
            __michelsonType: 'nat',
            schema: 'nat',
          },
        },
      });

      expect(tokenComplex.ExtractSchema()).toEqual({
        option0: { 0: 'nat', 1: 'nat', 2: 'timestamp' },
        option1: { 1: 'nat', 2: 'mutez', 3: 'nat', 4: 'timestamp' },
        option2: { 2: 'nat', 3: 'timestamp' },
        option3: { 3: 'nat', 4: 'mutez', 5: 'timestamp' },
        option4: 'nat',
      });

      expect(tokenComplex.generateSchema()).toEqual({
        __michelsonType: 'or',
        schema: {
          option0: {
            __michelsonType: 'pair',
            schema: {
              0: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              1: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              2: {
                __michelsonType: 'timestamp',
                schema: 'timestamp',
              },
            },
          },
          option1: {
            __michelsonType: 'pair',
            schema: {
              1: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              2: {
                __michelsonType: 'mutez',
                schema: 'mutez',
              },
              3: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              4: {
                __michelsonType: 'timestamp',
                schema: 'timestamp',
              },
            },
          },
          option2: {
            __michelsonType: 'pair',
            schema: {
              2: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              3: {
                __michelsonType: 'timestamp',
                schema: 'timestamp',
              },
            },
          },
          option3: {
            __michelsonType: 'pair',
            schema: {
              3: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
              4: {
                __michelsonType: 'mutez',
                schema: 'mutez',
              },
              5: {
                __michelsonType: 'timestamp',
                schema: 'timestamp',
              },
            },
          },
          option4: {
            __michelsonType: 'nat',
            schema: 'nat',
          },
        },
      });

      expect(tokenOrWithOption.generateSchema()).toEqual({
        __michelsonType: 'or',
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
            __michelsonType: 'mutez',
            schema: 'mutez',
          },
          3: {
            __michelsonType: 'option',
            schema: {
              __michelsonType: 'or',
              schema: {
                0: {
                  __michelsonType: 'int',
                  schema: 'int',
                },
                1: {
                  __michelsonType: 'string',
                  schema: 'string',
                },
              },
            },
          },
        },
      });
    });
  });

  describe('Execute', () => {
    it(`Should properly transform Michelson data of type 'or' to json object`, () => {
      expect(token.Execute({ prim: 'Left', args: [{ int: '34' }] })).toEqual({
        intTest: new BigNumber(34),
      }); // { intTest: '34' }
      expect(token.Execute({ prim: 'Right', args: [{ string: '34' }] })).toEqual({
        stringTest: '34',
      }); // '34'

      expect(
        tokenNestedOr.Execute({
          prim: 'Left',
          args: [
            {
              prim: 'Left',
              args: [
                {
                  prim: 'Left',
                  args: [{ bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd' }],
                },
              ],
            },
          ],
        })
      ).toEqual({ myAddress: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }); // '{ 0: { 0: { "myAddress": 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'} } }
      expect(
        tokenNestedOr.Execute({
          prim: 'Left',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Right', args: [{ bytes: 'aaaa' }] }],
            },
          ],
        })
      ).toEqual({ myBytes: 'aaaa' }); // { 0: { 0: 'aaaa' } }
      expect(
        tokenNestedOr.Execute({
          prim: 'Left',
          args: [
            {
              prim: 'Right',
              args: [{ prim: 'Left', args: [{ int: '34' }] }],
            },
          ],
        })
      ).toEqual({ myInt: new BigNumber(34) }); // { 0: { "myInt": new BigNumber(34) } }
      expect(
        tokenNestedOr.Execute({
          prim: 'Left',
          args: [
            {
              prim: 'Right',
              args: [{ prim: 'Right', args: [{ int: '6' }] }],
            },
          ],
        })
      ).toEqual({ myNat: new BigNumber(6) }); // { 0: '6'  }
      expect(
        tokenNestedOr.Execute({
          prim: 'Right',
          args: [
            {
              prim: 'Left',
              args: [
                {
                  prim: 'Left',
                  args: [{ prim: 'Pair', args: [{ int: '3' }, { int: '4' }] }],
                },
              ],
            },
          ],
        })
      ).toEqual({ myPair: { 4: new BigNumber(3), 5: new BigNumber(4) } }); // { 4: { myPair: { 4: '3', 5: '4'} } }
      expect(
        tokenNestedOr.Execute({
          prim: 'Right',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Right', args: [{ string: 'test' }] }],
            },
          ],
        })
      ).toEqual({ myString: 'test' }); // { 4: 'test' }
      expect(
        tokenNestedOr.Execute({
          prim: 'Right',
          args: [{ prim: 'Right', args: [{ int: '4' }] }],
        })
      ).toEqual({ myTez: new BigNumber(4) }); // '4'

      expect(
        tokenNestedOrWithoutAnnot.Execute({
          prim: 'Left',
          args: [
            {
              prim: 'Left',
              args: [
                {
                  prim: 'Left',
                  args: [{ bytes: '000035e993d8c7aaa42b5e3ccd86a33390ececc73abd' }],
                },
              ],
            },
          ],
        })
      ).toEqual({ 0: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }); // '{ 0: { 0: { "myAddress": 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'} } }
      expect(
        tokenNestedOrWithoutAnnot.Execute({
          prim: 'Left',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Right', args: [{ bytes: 'aaaa' }] }],
            },
          ],
        })
      ).toEqual({ 1: 'aaaa' }); // { 0: { 0: 'aaaa' } }
      expect(
        tokenNestedOrWithoutAnnot.Execute({
          prim: 'Left',
          args: [
            {
              prim: 'Right',
              args: [{ prim: 'Left', args: [{ int: '34' }] }],
            },
          ],
        })
      ).toEqual({ 2: new BigNumber(34) }); // { 0: { "myInt": new BigNumber(34) } }
      expect(
        tokenNestedOrWithoutAnnot.Execute({
          prim: 'Left',
          args: [
            {
              prim: 'Right',
              args: [{ prim: 'Right', args: [{ int: '6' }] }],
            },
          ],
        })
      ).toEqual({ 3: new BigNumber(6) }); // { 0: '6'  }
      expect(
        tokenNestedOrWithoutAnnot.Execute({
          prim: 'Right',
          args: [
            {
              prim: 'Left',
              args: [
                {
                  prim: 'Left',
                  args: [{ prim: 'Pair', args: [{ int: '3' }, { int: '4' }] }],
                },
              ],
            },
          ],
        })
      ).toEqual({ 4: { 4: new BigNumber(3), 5: new BigNumber(4) } }); // { 4: { myPair: { 4: '3', 5: '4'} } }
      expect(
        tokenNestedOrWithoutAnnot.Execute({
          prim: 'Right',
          args: [
            {
              prim: 'Left',
              args: [{ prim: 'Right', args: [{ string: 'test' }] }],
            },
          ],
        })
      ).toEqual({ 5: 'test' }); // { 4: 'test' }
      expect(
        tokenNestedOrWithoutAnnot.Execute({
          prim: 'Right',
          args: [{ prim: 'Right', args: [{ int: '4' }] }],
        })
      ).toEqual({ 6: new BigNumber(4) }); // '4'
    });
  });

  describe('ToKey', () => {
    it(`Should properly transform Michelson data of type 'or' to json object`, () => {
      expect(token.ToKey({ prim: 'Left', args: [{ int: '34' }] })).toEqual({
        intTest: new BigNumber(34),
      });
      expect(token.ToKey({ prim: 'Right', args: [{ string: '34' }] })).toEqual({
        stringTest: '34',
      });
    });
  });

  describe('ToBigMapKey', () => {
    it(`Should properly transform json object to Michelson big map key`, () => {
      expect(token.ToBigMapKey({ intTest: 34 })).toEqual({
        key: { prim: 'Left', args: [{ int: '34' }] },
        type: { prim: 'or', args: [{ prim: 'int' }, { prim: 'string' }] },
      });
      expect(token.ToBigMapKey({ stringTest: 'test' })).toEqual({
        key: { prim: 'Right', args: [{ string: 'test' }] },
        type: { prim: 'or', args: [{ prim: 'int' }, { prim: 'string' }] },
      });
    });
  });
});
