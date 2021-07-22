import { Schema } from '../src/schema/storage';
import { storage, rpcContractResponse } from '../data/sample20';
import BigNumber from 'bignumber.js';
import { MichelsonMap } from '../src/michelson-map';
import { expectMichelsonMap } from './utils';

describe('Contract test where the value of the map "selling" is a big_map', () => {
  it('Test storage schema', () => {
    const schema = new Schema(storage);
    expect(schema.ExtractSchema()).toEqual({
      _euranov: 'address',
      admin: 'address',
      auctions: {
        big_map: {
          key: "address",
          value: {
            map: {
              key: 'nat',
              value: {
                assetId: 'nat',
                bidCount: 'nat',
                claimed: 'bool',
                creator: 'address',
                currentBidAmount: 'mutez',
                currentBidOwner: 'address',
                duration: 'int',
                startTime: 'timestamp',
              },
            },
          },
        },
      },
      authorizedSC: {
        big_map: {
          key: "address",
          value: "bool",
        },
      },
      balance: 'int',
      paused: 'bool',
      selling: {
        map: {
          key: 'address',
          value: {
            big_map: {
              key: "nat",
              value: {
                fee: 'nat',
                owner: 'address',
                price: 'mutez',
              },
            },
          },
        },
      },
      tokenAddress: 'address',
    });
  });

  it('Test storage parsing', () => {
    const schema = new Schema(storage);
    expect(schema.Execute(rpcContractResponse.script.storage)).toEqual({
      _euranov: 'tz1b3cJ4Vz9cERNN3mJVxSkf4ksXrRjpGwao',
      admin: 'tz1gi6qyzWuK2ciD2tAXDW2XdudmoQHy5YR9',
      auctions: '68953',
      authorizedSC: '68954',
      balance: new BigNumber('5000000000000000000'),
      paused: false,
      selling: expectMichelsonMap(),
      tokenAddress: 'KT1Dd8G6EVG3HTYZpp4wn8dnzKBEeE1eftTt',
    });
  });

  it('Test storage encoding', () => {
    const schema = new Schema(storage);
    const selling = new MichelsonMap();
    const nestedBigMap = new MichelsonMap();
    nestedBigMap.set(2, {
      fee: '3',
      owner: 'tz1b3cJ4Vz9cERNN3mJVxSkf4ksXrRjpGwao',
      price: '2',
    });
    selling.set('KT1LGGwuY8BVnnzuQCNmJgsY49VhqnxmnZh8', nestedBigMap);

    expect(
      schema.Encode({
        _euranov: 'tz1b3cJ4Vz9cERNN3mJVxSkf4ksXrRjpGwao',
        admin: 'tz1gi6qyzWuK2ciD2tAXDW2XdudmoQHy5YR9',
        auctions: new MichelsonMap(),
        authorizedSC: new MichelsonMap(),
        balance: new BigNumber('5000000000000000000'),
        paused: false,
        selling,
        tokenAddress: 'KT1Dd8G6EVG3HTYZpp4wn8dnzKBEeE1eftTt',
      })
    ).toEqual({
      prim: 'Pair',
      args: [
        {
          prim: 'Pair',
          args: [
            {
              prim: 'Pair',
              args: [
                { string: 'tz1b3cJ4Vz9cERNN3mJVxSkf4ksXrRjpGwao' },
                { string: 'tz1gi6qyzWuK2ciD2tAXDW2XdudmoQHy5YR9' },
              ],
            },
            {
              prim: 'Pair',
              args: [[], []],
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
                  int: '5000000000000000000',
                },
                {
                  prim: 'False',
                },
              ],
            },
            {
              prim: 'Pair',
              args: [
                [
                  {
                    prim: 'Elt',
                    args: [
                      {
                        string: 'KT1LGGwuY8BVnnzuQCNmJgsY49VhqnxmnZh8',
                      },
                      [
                        {
                          prim: 'Elt',
                          args: [
                            {
                              int: '2',
                            },
                            {
                              prim: 'Pair',
                              args: [
                                {
                                  int: '3',
                                },
                                {
                                  prim: 'Pair',
                                  args: [
                                    {
                                      string: 'tz1b3cJ4Vz9cERNN3mJVxSkf4ksXrRjpGwao',
                                    },
                                    {
                                      int: '2',
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    ],
                  },
                ],
                {
                  string: 'KT1Dd8G6EVG3HTYZpp4wn8dnzKBEeE1eftTt',
                },
              ],
            },
          ],
        },
      ],
    });
  });
});
