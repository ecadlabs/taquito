// KT1R3uoZ6W1ZxEwzqtv75Ro7DhVY6UAcxuK2 on mainnet

import { params as params9 } from '../data/sample9';
import { ParameterSchema } from '../src/schema/parameter';

describe('Schema test', () => {
  it('Should parse storage properly', () => {
    const schema = new ParameterSchema(params9);
    const storage = schema.ExtractSchema();

    expect(schema.ExtractSignatures()).toContainEqual(['0', 'address', 'string', 'bytes']);
    expect(schema.ExtractSignatures()).toContainEqual(['1', 'mutez']);
    expect(schema.ExtractSignatures()).toContainEqual(['2', 'address', 'bool']);

    expect(storage).toEqual({
      '0': {
        '0': 'address',
        '1': 'string',
        '2': 'bytes',
      },
      '1': 'mutez',
      '2': {
        '2': 'address',
        '3': 'bool',
      },
      '3': {
        lambda: {
          parameters: {
            5: 'bytes',
            3: 'address',
            4: 'string',
          },
          returns: 'operation',
        },
      },
    });

    expect(schema.generateSchema()).toEqual({
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
    });

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
