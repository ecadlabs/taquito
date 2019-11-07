import { code } from '../../data/proto005/big_map_encoding';
import { Schema } from '../../src/schema/storage';

describe('Contract with unit encoding', () => {
  it('Should encode storage properly when using empty big map', () => {
    const schema = new Schema(code[1].args[0] as any);
    expect(
      schema.Encode({
        owner: '123',
        totalSupply: '100',
        accounts: {},
      })
    ).toEqual({
      prim: 'Pair',
      args: [
        {
          prim: 'Pair',
          args: [
            [],
            {
              string: '123',
            },
          ],
        },
        {
          int: '100',
        },
      ],
    });
  });

  it('Should encode storage properly when using complex big map initialisation', () => {
    const schema = new Schema(code[1].args[0] as any);
    expect(
      schema.Encode({
        owner: '123',
        totalSupply: '100',
        accounts: {
          '123': {
            balance: '0',
            allowances: {},
          },
        },
      })
    ).toEqual({
      prim: 'Pair',
      args: [
        {
          prim: 'Pair',
          args: [
            [
              {
                prim: 'Elt',
                args: [
                  { string: '123' },
                  {
                    prim: 'Pair',
                    args: [[], { int: '0' }],
                  },
                ],
              },
            ],
            {
              string: '123',
            },
          ],
        },
        {
          int: '100',
        },
      ],
    });
  });
});
