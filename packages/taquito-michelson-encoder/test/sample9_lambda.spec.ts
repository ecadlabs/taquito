// KT1R3uoZ6W1ZxEwzqtv75Ro7DhVY6UAcxuK2 on mainnet

import { params as params9 } from '../data/sample9';
import { ParameterSchema } from '../src/schema/parameter';

describe('Schema test', () => {
  it('Should parse storage properly', () => {
    const schema = new ParameterSchema(params9);
    const storage = schema.ExtractSchema();
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
    expect({
      args: [
        {
          args: [
            {
              args: [
                {
                  string: '{PUSH string "hello"; CONCAT}',
                },
              ],
              prim: 'Right',
            },
          ],
          prim: 'Right',
        },
      ],
      prim: 'Right',
    }).toEqual(schema.Encode('3', `{PUSH string "hello"; CONCAT}`));
    expect(schema.isMultipleEntryPoint).toBeTruthy();
  });
});
