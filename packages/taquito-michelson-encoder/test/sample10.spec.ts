// KT1R3uoZ6W1ZxEwzqtv75Ro7DhVY6UAcxuK2 on mainnet

import { params as params10 } from '../data/sample10';
import { ParameterSchema } from '../src/schema/parameter';

describe('Schema test', () => {
  it('Should parse storage properly', () => {
    const schema = new ParameterSchema(params10);
    expect({
      args: [
        {
          args: [
            {
              args: [
                {
                  args: [
                    [
                      {
                        args: [
                          {
                            int: 'atest',
                          },
                          {
                            string: 'btest',
                          },
                        ],
                        prim: 'Pair',
                      },
                      {
                        args: [
                          {
                            int: 'test',
                          },
                          {
                            string: 'test',
                          },
                        ],
                        prim: 'Pair',
                      },
                    ],
                    {
                      string: 'sig',
                    },
                  ],
                  prim: 'Pair',
                },
                {
                  args: [
                    {
                      string: 'test',
                    },
                    {
                      string: 'test',
                    },
                  ],
                  prim: 'Pair',
                },
              ],
              prim: 'Pair',
            },
          ],
          prim: 'Right',
        },
      ],
      prim: 'Some',
    }).toEqual(
      schema.Encode(
        'transfer',
        [{ amount: 'atest', beneficiary: 'btest' }, { amount: 'test', beneficiary: 'test' }],
        'sig',
        'test',
        'test'
      )
    );
    expect(schema.isMultipleEntryPoint).toBeTruthy();
  });
});
