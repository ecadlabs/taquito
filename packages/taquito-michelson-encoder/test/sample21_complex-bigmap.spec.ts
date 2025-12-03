import { storage, complex_storage } from '../data/sample_complex_bigmap';
import { Schema } from '../src/schema/storage';

describe('Complex big_map storage', () => {
  it('Should extract correct bigmap schema', () => {
    const schema = new Schema(storage);

    expect(schema.generateSchema()).toEqual({
      administrator: 'address',
      balances: {
        big_map: {
          key: 'address',
          value: {
            approvals: {
              map: {
                key: 'address',
                value: 'nat',
              },
            },
            balance: 'nat',
          },
        },
      },
      counter: 'nat',
      default_expiry: 'nat',
      max_expiry: 'nat',
      metadata: {
        big_map: {
          key: 'string',
          value: 'bytes',
        },
      },
      paused: 'bool',
      permit_expiries: {
        big_map: {
          key: {
            '0': 'address',
            '1': 'bytes',
          },
          value: { Some: 'nat' },
        },
      },
      permits: {
        big_map: {
          key: {
            '0': 'address',
            '1': 'bytes',
          },
          value: 'timestamp',
        },
      },
      totalSupply: 'nat',
      user_expiries: {
        big_map: {
          key: 'address',
          value: { Some: 'nat' },
        },
      },
    });
    expect(schema.generateSchema()).toEqual({
      __michelsonType: 'pair',
      schema: {
        administrator: {
          __michelsonType: 'address',
          schema: 'address',
        },
        balances: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'address',
              schema: 'address',
            },
            value: {
              __michelsonType: 'pair',
              schema: {
                approvals: {
                  __michelsonType: 'map',
                  schema: {
                    key: {
                      __michelsonType: 'address',
                      schema: 'address',
                    },
                    value: {
                      __michelsonType: 'nat',
                      schema: 'nat',
                    },
                  },
                },
                balance: {
                  __michelsonType: 'nat',
                  schema: 'nat',
                },
              },
            },
          },
        },
        counter: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
        default_expiry: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
        max_expiry: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
        metadata: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'string',
              schema: 'string',
            },
            value: {
              __michelsonType: 'bytes',
              schema: 'bytes',
            },
          },
        },
        paused: {
          __michelsonType: 'bool',
          schema: 'bool',
        },
        permit_expiries: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'pair',
              schema: {
                '0': {
                  __michelsonType: 'address',
                  schema: 'address',
                },
                '1': {
                  __michelsonType: 'bytes',
                  schema: 'bytes',
                },
              },
            },
            value: {
              __michelsonType: 'option',
              schema: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
            },
          },
        },
        permits: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'pair',
              schema: {
                '0': {
                  __michelsonType: 'address',
                  schema: 'address',
                },
                '1': {
                  __michelsonType: 'bytes',
                  schema: 'bytes',
                },
              },
            },
            value: {
              __michelsonType: 'timestamp',
              schema: 'timestamp',
            },
          },
        },
        totalSupply: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
        user_expiries: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'address',
              schema: 'address',
            },
            value: {
              __michelsonType: 'option',
              schema: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
            },
          },
        },
      },
    });
  });

  it('Should extract correct bigmap schema for complex key-value pairs', () => {
    const schema = new Schema(complex_storage);

    expect(schema.generateSchema()).toEqual({
      administrator: 'address',
      balances: {
        big_map: {
          key: 'address',
          value: {
            approvals: {
              map: {
                key: 'address',
                value: 'nat',
              },
            },
            balance: 'nat',
          },
        },
      },
      counter: 'nat',
      default_expiry: 'nat',
      max_expiry: 'nat',
      metadata: {
        big_map: {
          key: 'string',
          value: 'bytes',
        },
      },
      paused: 'bool',
      permit_expiries: {
        big_map: {
          key: {
            big_map: {
              key: {
                '0': 'address',
                '1': 'bytes',
              },
              value: 'bytes',
            },
          },
          value: { Some: 'nat' },
        },
      },
      permits: {
        big_map: {
          key: {
            big_map: {
              key: 'address',
              value: {
                '0': 'address',
                '1': 'bytes',
              },
            },
          },
          value: 'timestamp',
        },
      },
      totalSupply: 'nat',
      user_expiries: {
        big_map: {
          key: 'address',
          value: { Some: 'nat' },
        },
      },
    });

    expect(schema.generateSchema()).toEqual({
      __michelsonType: 'pair',
      schema: {
        administrator: {
          __michelsonType: 'address',
          schema: 'address',
        },
        balances: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'address',
              schema: 'address',
            },
            value: {
              __michelsonType: 'pair',
              schema: {
                approvals: {
                  __michelsonType: 'map',
                  schema: {
                    key: {
                      __michelsonType: 'address',
                      schema: 'address',
                    },
                    value: {
                      __michelsonType: 'nat',
                      schema: 'nat',
                    },
                  },
                },
                balance: {
                  __michelsonType: 'nat',
                  schema: 'nat',
                },
              },
            },
          },
        },
        counter: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
        default_expiry: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
        max_expiry: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
        metadata: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'string',
              schema: 'string',
            },
            value: {
              __michelsonType: 'bytes',
              schema: 'bytes',
            },
          },
        },
        paused: {
          __michelsonType: 'bool',
          schema: 'bool',
        },
        permit_expiries: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'big_map',
              schema: {
                key: {
                  __michelsonType: 'pair',
                  schema: {
                    '0': {
                      __michelsonType: 'address',
                      schema: 'address',
                    },
                    '1': {
                      __michelsonType: 'bytes',
                      schema: 'bytes',
                    },
                  },
                },
                value: {
                  __michelsonType: 'bytes',
                  schema: 'bytes',
                },
              },
            },
            value: {
              __michelsonType: 'option',
              schema: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
            },
          },
        },
        permits: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'big_map',
              schema: {
                key: {
                  __michelsonType: 'address',
                  schema: 'address',
                },
                value: {
                  __michelsonType: 'pair',
                  schema: {
                    '0': {
                      __michelsonType: 'address',
                      schema: 'address',
                    },
                    '1': {
                      __michelsonType: 'bytes',
                      schema: 'bytes',
                    },
                  },
                },
              },
            },
            value: {
              __michelsonType: 'timestamp',
              schema: 'timestamp',
            },
          },
        },
        totalSupply: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
        user_expiries: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'address',
              schema: 'address',
            },
            value: {
              __michelsonType: 'option',
              schema: {
                __michelsonType: 'nat',
                schema: 'nat',
              },
            },
          },
        },
      },
    });
  });
});
