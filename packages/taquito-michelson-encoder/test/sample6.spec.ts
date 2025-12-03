import BigNumber from 'bignumber.js';
import {
  rpcContractResponse as rpcContractResponse6,
  storage as storage6,
  params as params6,
} from '../data/sample6';
import { Schema } from '../src/schema/storage';
import { ParameterSchema } from '../src/schema/parameter';

describe('Schema test', () => {
  it('Should extract schema properly', () => {
    const schema = new Schema(storage6);
    expect(schema.generateSchema()).toEqual({
      key_info: {
        key_groups: {
          list: {
            group_threshold: 'nat',
            signatories: {
              list: 'key',
            },
          },
        },
        overall_threshold: 'nat',
      },
      pour_info: {
        Some: {
          pour_authorizer: 'key',
          pour_dest: 'contract',
        },
      },
      vesting: {
        vesting_quantities: {
          vested_balance: 'mutez',
          vesting_increment: 'mutez',
        },
        vesting_schedule: {
          next_payout: 'timestamp',
          payout_interval: 'int',
        },
      },
      replay_counter: 'nat',
    });

    expect(schema.generateSchema()).toEqual({
      __michelsonType: 'pair',
      schema: {
        key_info: {
          __michelsonType: 'pair',
          schema: {
            key_groups: {
              __michelsonType: 'list',
              schema: {
                __michelsonType: 'pair',
                schema: {
                  group_threshold: {
                    __michelsonType: 'nat',
                    schema: 'nat',
                  },
                  signatories: {
                    __michelsonType: 'list',
                    schema: {
                      __michelsonType: 'key',
                      schema: 'key',
                    },
                  },
                },
              },
            },
            overall_threshold: {
              __michelsonType: 'nat',
              schema: 'nat',
            },
          },
        },
        pour_info: {
          __michelsonType: 'option',
          schema: {
            __michelsonType: 'pair',
            schema: {
              pour_authorizer: {
                __michelsonType: 'key',
                schema: 'key',
              },
              pour_dest: {
                __michelsonType: 'contract',
                schema: {
                  parameter: {
                    __michelsonType: 'unit',
                    schema: 'unit',
                  },
                },
              },
            },
          },
        },
        vesting: {
          __michelsonType: 'pair',
          schema: {
            vesting_quantities: {
              __michelsonType: 'pair',
              schema: {
                vested_balance: {
                  __michelsonType: 'mutez',
                  schema: 'mutez',
                },
                vesting_increment: {
                  __michelsonType: 'mutez',
                  schema: 'mutez',
                },
              },
            },
            vesting_schedule: {
              __michelsonType: 'pair',
              schema: {
                next_payout: {
                  __michelsonType: 'timestamp',
                  schema: 'timestamp',
                },
                payout_interval: {
                  __michelsonType: 'int',
                  schema: 'int',
                },
              },
            },
          },
        },
        replay_counter: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
      },
    });
  });

  it('Should encode storage properly', () => {
    const schema = new Schema(storage6);
    expect(
      schema.Encode({
        replay_counter: new BigNumber('8001'),
        key_info: {
          key_groups: [
            {
              signatories: [
                'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
                'edpktm3zeGMzfzFuqgyYftt7uNyVRANTjrJCdU7bURwgGb9bRZwmJq',
                'edpkucCnbeGPWNvGHeTQ5hENHPrc8txBBiQXNphu3jgv9KYbhQBovd',
                'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh',
              ],
              group_threshold: new BigNumber('2'),
            },
            {
              signatories: [
                'edpkukogJzCZSAfc5foRpEZGsryMjiXj77VxcFLzZoreB1vZWFeKc2',
                'edpkuSZ1GoM6MALh4fPZBrwDhGwY9vENEoyctcXuDK3yoiX4xWhMaA',
                'edpkvXL9B32DcEbMNiMangcSFMvAd8NBwH8AfmRb6iBbHxLgx3J59P',
                'edpkumCFhgS94cjZXiFnnq7MFsaWBz4Tp78AX2fZfhB9J9hcgcKxgy',
              ],
              group_threshold: new BigNumber('2'),
            },
            {
              signatories: [
                'edpkv9eiqPP8bxCPEem6BBUNokwwy64G7ARYov77oNyCfK6fP3H5hz',
                'edpktjDaR4gmEZNSnnuSWMmJ4fhYmMD4Lk1WkDCfWRWdbGHQ9eNT45',
                'edpkuapDV7oaWqK5fStnPbhEm2g7kvhhtbBNs9hhq3KWXS2qcWcdNQ',
                'edpkuzAzJ5yQeSHsfRqwkdGBELdJjAGGR6gw3Ar1iVVDvFef5e6Juk',
              ],
              group_threshold: new BigNumber('2'),
            },
            {
              signatories: [
                'edpkuhBM7RhVwtityNcxMZchDX8yAQejxe8qhBLBLKxuNtDYaBto7u',
                'edpkuALgGd9Y5SWLXPfUJV9EG2rv6EkCBA4C47mrt4cAmE11EHQrCs',
                'edpkvZRBMfmC2pcv6xnbHPzKpwH7U9sPgFieXGjQFdW2Tzu9vcd5f8',
                'edpkvZkwaGFpqU3aRuUedeGx1xah6wLMre4nNYMvNyvaDZgKicvFWe',
              ],
              group_threshold: new BigNumber('2'),
            },
            {
              signatories: [
                'edpkuBBAoSWWAUfRNGVZu5H4TBnCmRVhWW1sZApLA53pYfY3tKjnev',
                'edpkvQpud1huJmJqUfF84uHjkpR7AQ32uKP1wkEqnJhgH1nXPQheUh',
                'edpkuiacWZrSDn6LtkXkwq9mY7VPefGzoyZoL1PWGBj4EngM95D1Md',
                'edpkuXtt222Rdkg2dAQzcBkPL9EAn9e9RzjFSYr3MhG2NnjS7ihMxh',
              ],
              group_threshold: new BigNumber('2'),
            },
            {
              signatories: [
                'edpkv7k8jhUUuxHp4b2rrg2o9mZZB2SxM8i4bh1goebvQEporktRrr',
                'edpkvStZUa8YbsVuFQWHXWoBkJ8kyf4W26TXjRu2HXS7ymfeHrnquP',
                'edpktxdeLBghuHVyAq8q7SUKEJNMeFwPKVtWyJv9Pi51jWPXwhiFU4',
                'edpkvSC9HasAnmjfX3Qt5f88PVo24kx5LRzzpqNVzq5Q9Rm7Q71ubB',
              ],
              group_threshold: new BigNumber('2'),
            },
            {
              signatories: [
                'edpkvZ471mmT7nCrge44mzLwW6mmpLh5n2ykXX5zHunqgxMc4JcTgE',
                'edpktsM8qruHNaGKM5wor6UDmkn5YeH9rekmTayUMAP5zyL8RCvGic',
                'edpkuT8WzhehsZjyUqCYVQEvwUJ4Nez2mSjfrWxPvnUNCZjjYHbyMB',
                'edpktepTo31j8SYSBCupfRA8VEdTXXvgtbZEEejuumpAGU6xKEi4sf',
              ],
              group_threshold: new BigNumber('2'),
            },
          ],
          overall_threshold: new BigNumber('4'),
        },
        vesting: {
          vesting_quantities: {
            vested_balance: new BigNumber('0'),
            vesting_increment: new BigNumber('199041301565'),
          },
          vesting_schedule: {
            next_payout: '2018-07-30T05:30:00Z',
            payout_interval: new BigNumber('2629800'),
          },
        },
        pour_info: {
          pour_dest: 'tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K',
          pour_authorizer: 'edpkv4vUwGVVYnmmuafbEirXrXhT1bzcuJ2xQ3SHfeUVUr56YwgipC',
        },
      })
    ).toEqual(rpcContractResponse6.script.storage);
  });

  it('Should extract parameter schema properly', () => {
    const schema = new ParameterSchema(params6);
    expect(schema.generateSchema()).toEqual({
      Pour: {
        Some: {
          pour_amount: 'mutez',
          pour_auth: 'signature',
        },
      },
      Action: {
        action_input: {
          Set_delegate: { Some: 'key_hash' },
          Set_keys: {
            key_groups: {
              list: {
                group_threshold: 'nat',
                signatories: {
                  list: 'key',
                },
              },
            },
            overall_threshold: 'nat',
          },
          Set_pour: {
            Some: {
              pour_authorizer: 'key',
              pour_dest: 'contract',
            },
          },
          Transfer: {
            dest: 'contract',
            transfer_amount: 'mutez',
          },
        },
        signatures: {
          list: {
            list: { Some: 'signature' },
          },
        },
      },
    });

    expect(schema.generateSchema()).toEqual({
      __michelsonType: 'or',
      schema: {
        Pour: {
          __michelsonType: 'option',
          schema: {
            __michelsonType: 'pair',
            schema: {
              pour_amount: {
                __michelsonType: 'mutez',
                schema: 'mutez',
              },
              pour_auth: {
                __michelsonType: 'signature',
                schema: 'signature',
              },
            },
          },
        },
        Action: {
          __michelsonType: 'pair',
          schema: {
            action_input: {
              __michelsonType: 'or',
              schema: {
                Set_delegate: {
                  __michelsonType: 'option',
                  schema: {
                    __michelsonType: 'key_hash',
                    schema: 'key_hash',
                  },
                },
                Set_keys: {
                  __michelsonType: 'pair',
                  schema: {
                    key_groups: {
                      __michelsonType: 'list',
                      schema: {
                        __michelsonType: 'pair',
                        schema: {
                          group_threshold: {
                            __michelsonType: 'nat',
                            schema: 'nat',
                          },
                          signatories: {
                            __michelsonType: 'list',
                            schema: {
                              __michelsonType: 'key',
                              schema: 'key',
                            },
                          },
                        },
                      },
                    },
                    overall_threshold: {
                      __michelsonType: 'nat',
                      schema: 'nat',
                    },
                  },
                },
                Set_pour: {
                  __michelsonType: 'option',
                  schema: {
                    __michelsonType: 'pair',
                    schema: {
                      pour_authorizer: {
                        __michelsonType: 'key',
                        schema: 'key',
                      },
                      pour_dest: {
                        __michelsonType: 'contract',
                        schema: {
                          parameter: {
                            __michelsonType: 'unit',
                            schema: 'unit',
                          },
                        },
                      },
                    },
                  },
                },
                Transfer: {
                  __michelsonType: 'pair',
                  schema: {
                    dest: {
                      __michelsonType: 'contract',
                      schema: {
                        parameter: {
                          __michelsonType: 'unit',
                          schema: 'unit',
                        },
                      },
                    },
                    transfer_amount: {
                      __michelsonType: 'mutez',
                      schema: 'mutez',
                    },
                  },
                },
              },
            },
            signatures: {
              __michelsonType: 'list',
              schema: {
                __michelsonType: 'list',
                schema: {
                  __michelsonType: 'option',
                  schema: {
                    __michelsonType: 'signature',
                    schema: 'signature',
                  },
                },
              },
            },
          },
        },
      },
    });

    const signatures = schema.ExtractSignatures();
    expect(signatures).toContainEqual(['Pour', 'signature', 'mutez']);
    expect(signatures).toContainEqual([
      'Action',
      'Set_delegate',
      'key_hash',
      { list: { list: { Some: 'signature' } } },
    ]);
  });

  it('Should encode parameter properly', () => {
    // Taken from op2FiAKSRKJAEnEsm4LAfMNYrAKApkMomJWb3VJf7AstXcWAQ7e on mainnet
    const schema = new ParameterSchema(params6);
    expect(
      schema.Encode(
        'Pour',
        'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
        200
      )
    ).toEqual({
      args: [
        {
          args: [
            {
              args: [
                {
                  string:
                    'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
                },
                {
                  int: '200',
                },
              ],
              prim: 'Pair',
            },
          ],
          prim: 'Some',
        },
      ],
      prim: 'Right',
    });
  });

  it('Should parse storage properly', () => {
    const schema = new Schema(storage6);
    const storage = schema.Execute(rpcContractResponse6.script.storage);
    expect(storage).toEqual({
      replay_counter: new BigNumber('8001'),
      key_info: {
        key_groups: [
          {
            signatories: [
              'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
              'edpktm3zeGMzfzFuqgyYftt7uNyVRANTjrJCdU7bURwgGb9bRZwmJq',
              'edpkucCnbeGPWNvGHeTQ5hENHPrc8txBBiQXNphu3jgv9KYbhQBovd',
              'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkukogJzCZSAfc5foRpEZGsryMjiXj77VxcFLzZoreB1vZWFeKc2',
              'edpkuSZ1GoM6MALh4fPZBrwDhGwY9vENEoyctcXuDK3yoiX4xWhMaA',
              'edpkvXL9B32DcEbMNiMangcSFMvAd8NBwH8AfmRb6iBbHxLgx3J59P',
              'edpkumCFhgS94cjZXiFnnq7MFsaWBz4Tp78AX2fZfhB9J9hcgcKxgy',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkv9eiqPP8bxCPEem6BBUNokwwy64G7ARYov77oNyCfK6fP3H5hz',
              'edpktjDaR4gmEZNSnnuSWMmJ4fhYmMD4Lk1WkDCfWRWdbGHQ9eNT45',
              'edpkuapDV7oaWqK5fStnPbhEm2g7kvhhtbBNs9hhq3KWXS2qcWcdNQ',
              'edpkuzAzJ5yQeSHsfRqwkdGBELdJjAGGR6gw3Ar1iVVDvFef5e6Juk',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkuhBM7RhVwtityNcxMZchDX8yAQejxe8qhBLBLKxuNtDYaBto7u',
              'edpkuALgGd9Y5SWLXPfUJV9EG2rv6EkCBA4C47mrt4cAmE11EHQrCs',
              'edpkvZRBMfmC2pcv6xnbHPzKpwH7U9sPgFieXGjQFdW2Tzu9vcd5f8',
              'edpkvZkwaGFpqU3aRuUedeGx1xah6wLMre4nNYMvNyvaDZgKicvFWe',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkuBBAoSWWAUfRNGVZu5H4TBnCmRVhWW1sZApLA53pYfY3tKjnev',
              'edpkvQpud1huJmJqUfF84uHjkpR7AQ32uKP1wkEqnJhgH1nXPQheUh',
              'edpkuiacWZrSDn6LtkXkwq9mY7VPefGzoyZoL1PWGBj4EngM95D1Md',
              'edpkuXtt222Rdkg2dAQzcBkPL9EAn9e9RzjFSYr3MhG2NnjS7ihMxh',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkv7k8jhUUuxHp4b2rrg2o9mZZB2SxM8i4bh1goebvQEporktRrr',
              'edpkvStZUa8YbsVuFQWHXWoBkJ8kyf4W26TXjRu2HXS7ymfeHrnquP',
              'edpktxdeLBghuHVyAq8q7SUKEJNMeFwPKVtWyJv9Pi51jWPXwhiFU4',
              'edpkvSC9HasAnmjfX3Qt5f88PVo24kx5LRzzpqNVzq5Q9Rm7Q71ubB',
            ],
            group_threshold: new BigNumber('2'),
          },
          {
            signatories: [
              'edpkvZ471mmT7nCrge44mzLwW6mmpLh5n2ykXX5zHunqgxMc4JcTgE',
              'edpktsM8qruHNaGKM5wor6UDmkn5YeH9rekmTayUMAP5zyL8RCvGic',
              'edpkuT8WzhehsZjyUqCYVQEvwUJ4Nez2mSjfrWxPvnUNCZjjYHbyMB',
              'edpktepTo31j8SYSBCupfRA8VEdTXXvgtbZEEejuumpAGU6xKEi4sf',
            ],
            group_threshold: new BigNumber('2'),
          },
        ],
        overall_threshold: new BigNumber('4'),
      },
      vesting: {
        vesting_quantities: {
          vested_balance: new BigNumber('0'),
          vesting_increment: new BigNumber('199041301565'),
        },
        vesting_schedule: {
          next_payout: '2018-07-30T05:30:00.000Z',
          payout_interval: new BigNumber('2629800'),
        },
      },
      pour_info: {
        Some: {
          pour_dest: 'tz3WMqdzXqRWXwyvj5Hp2H7QEepaUuS7vd9K',
          pour_authorizer: 'edpkv4vUwGVVYnmmuafbEirXrXhT1bzcuJ2xQ3SHfeUVUr56YwgipC',
        },
      },
    });
  });
});
