// KT1R3uoZ6W1ZxEwzqtv75Ro7DhVY6UAcxuK2 on mainnet

import { params as params9 } from '../data/sample9';
import { ParameterSchema } from '../src/schema/parameter';
import { Token } from '../src/taquito-michelson-encoder';

describe('Schema test', () => {
  it('Should parse storage properly', () => {
    const schema = new ParameterSchema(params9);

    expect(schema.ExtractSignatures()).toContainEqual(['0', 'address', 'string', 'bytes']);
    expect(schema.ExtractSignatures()).toContainEqual(['1', 'mutez']);
    expect(schema.ExtractSignatures()).toContainEqual(['2', 'address', 'bool']);

    const extractSchema_Legacy = {
      '0': {
        '0': 'address',
        '1': 'string',
        '2': { Some: 'bytes' },
      },
      '1': 'mutez',
      '2': {
        '2': 'address',
        '3': 'bool',
      },
      '3': {
        lambda: {
          parameters: {
            5: { Some: 'bytes' },
            3: 'address',
            4: 'string',
          },
          returns: 'operation',
        },
      },
    };
    const extractSchema_ResetFields = {
      '0': {
        '0': 'address',
        '1': 'string',
        '2': { Some: 'bytes' },
      },
      '1': 'mutez',
      '2': {
        '0': 'address',
        '1': 'bool',
      },
      '3': {
        lambda: {
          parameters: {
            0: 'address',
            1: 'string',
            2: { Some: 'bytes' },
          },
          returns: 'operation',
        },
      },
    };

    Token.fieldNumberingStrategy = 'Legacy';
    expect(schema.generateSchema()).toEqual(extractSchema_Legacy);
    Token.fieldNumberingStrategy = 'ResetFieldNumbersInNestedObjects';
    expect(schema.generateSchema()).toEqual(extractSchema_ResetFields);
    Token.fieldNumberingStrategy = 'Latest';
    expect(schema.generateSchema()).toEqual(extractSchema_ResetFields);

    const generateSchema_Legacy = {
      __michelsonType: 'or',
      schema: {
        '0': {
          __michelsonType: 'pair',
          schema: {
            '0': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '1': {
              __michelsonType: 'string',
              schema: 'string',
            },
            '2': {
              __michelsonType: 'option',
              schema: {
                __michelsonType: 'bytes',
                schema: 'bytes',
              },
            },
          },
        },
        '1': {
          __michelsonType: 'mutez',
          schema: 'mutez',
        },
        '2': {
          __michelsonType: 'pair',
          schema: {
            '2': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '3': {
              __michelsonType: 'bool',
              schema: 'bool',
            },
          },
        },
        '3': {
          __michelsonType: 'lambda',
          schema: {
            parameters: {
              __michelsonType: 'pair',
              schema: {
                3: {
                  __michelsonType: 'address',
                  schema: 'address',
                },
                4: {
                  __michelsonType: 'string',
                  schema: 'string',
                },
                5: {
                  __michelsonType: 'option',
                  schema: {
                    __michelsonType: 'bytes',
                    schema: 'bytes',
                  },
                },
              },
            },
            returns: {
              __michelsonType: 'operation',
              schema: 'operation',
            },
          },
        },
      },
    };
    const generateSchema_ResetFields = {
      __michelsonType: 'or',
      schema: {
        '0': {
          __michelsonType: 'pair',
          schema: {
            '0': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '1': {
              __michelsonType: 'string',
              schema: 'string',
            },
            '2': {
              __michelsonType: 'option',
              schema: {
                __michelsonType: 'bytes',
                schema: 'bytes',
              },
            },
          },
        },
        '1': {
          __michelsonType: 'mutez',
          schema: 'mutez',
        },
        '2': {
          __michelsonType: 'pair',
          schema: {
            '0': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '1': {
              __michelsonType: 'bool',
              schema: 'bool',
            },
          },
        },
        '3': {
          __michelsonType: 'lambda',
          schema: {
            parameters: {
              __michelsonType: 'pair',
              schema: {
                0: {
                  __michelsonType: 'address',
                  schema: 'address',
                },
                1: {
                  __michelsonType: 'string',
                  schema: 'string',
                },
                2: {
                  __michelsonType: 'option',
                  schema: {
                    __michelsonType: 'bytes',
                    schema: 'bytes',
                  },
                },
              },
            },
            returns: {
              __michelsonType: 'operation',
              schema: 'operation',
            },
          },
        },
      },
    };

    Token.fieldNumberingStrategy = 'Legacy';
    expect(schema.generateSchema()).toEqual(generateSchema_Legacy);
    Token.fieldNumberingStrategy = 'ResetFieldNumbersInNestedObjects';
    expect(schema.generateSchema()).toEqual(generateSchema_ResetFields);
    Token.fieldNumberingStrategy = 'Latest';
    expect(schema.generateSchema()).toEqual(generateSchema_ResetFields);

    expect({
      args: [
        {
          args: [
            {
              args: [[{ prim: 'PUSH', args: [{ string: 'hello' }] }, { prim: 'CONCAT' }]],
              prim: 'Right',
            },
          ],
          prim: 'Right',
        },
      ],
      prim: 'Right',
    }).toEqual(
      schema.Encode('3', [{ prim: 'PUSH', args: [{ string: 'hello' }] }, { prim: 'CONCAT' }])
    );
    expect(schema.isMultipleEntryPoint).toBeTruthy();
  });
});
