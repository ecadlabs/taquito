import { code } from '../../data/proto005/big_map_encoding';
import { Schema } from '../../src/schema/storage';
import { MichelsonMap } from '../../src/michelson-map';

describe('Contract with unit encoding', () => {
  it('Should encode storage properly when using empty big map', () => {
    const schema = new Schema(code[1].args[0] as any);
    expect(
      schema.Encode({
        owner: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        totalSupply: '100',
        accounts: new MichelsonMap(),
      })
    ).toEqual({
      prim: 'Pair',
      args: [
        {
          prim: 'Pair',
          args: [
            [],
            {
              string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            },
          ],
        },
        {
          int: '100',
        },
      ],
    });
  });

  it('Should encode storage properly when using big map with single entry', () => {
    const schema = new Schema(code[1].args[0] as any);
    expect(
      schema.Encode({
        owner: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        totalSupply: '100',
        accounts: MichelsonMap.fromLiteral({
          tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn: {
            balance: '0',
            allowances: new MichelsonMap(),
          },
        }),
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
                  { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' },
                  {
                    prim: 'Pair',
                    args: [[], { int: '0' }],
                  },
                ],
              },
            ],
            {
              string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
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
        owner: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
        totalSupply: '100',
        accounts: MichelsonMap.fromLiteral({
          tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn: {
            balance: '0',
            allowances: new MichelsonMap(),
          },
          tz1LhS2WFCinpwUTdUb991ocL2D9Uk6FJGJK: {
            balance: '0',
            allowances: MichelsonMap.fromLiteral({
              tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn: '2',
              tz1LhS2WFCinpwUTdUb991ocL2D9Uk6FJGJK: '3',
            }),
          },
        }),
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
                  { string: 'tz1LhS2WFCinpwUTdUb991ocL2D9Uk6FJGJK' },
                  {
                    prim: 'Pair',
                    args: [
                      [
                        {
                          prim: 'Elt',
                          args: [{ string: 'tz1LhS2WFCinpwUTdUb991ocL2D9Uk6FJGJK' }, { int: '3' }],
                        },
                        {
                          prim: 'Elt',
                          args: [{ string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }, { int: '2' }],
                        },
                      ],
                      { int: '0' },
                    ],
                  },
                ],
              },
              {
                prim: 'Elt',
                args: [
                  { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' },
                  {
                    prim: 'Pair',
                    args: [[], { int: '0' }],
                  },
                ],
              },
            ],
            {
              string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
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
