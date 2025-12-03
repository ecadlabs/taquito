import BigNumber from 'bignumber.js';
import { bigMapDiff, params, rpcContractResponse, storage, txParams } from '../data/sample1';
import { ParameterSchema } from '../src/schema/parameter';
import { Schema } from '../src/schema/storage';
import { MichelsonMap } from '../src/michelson-map';
import { expectMichelsonMap } from './utils';
import { Token } from '../src/taquito-michelson-encoder';

describe('Schema test', () => {
  it('Should extract schema properly', () => {
    const schema = new Schema(storage);
    const s = schema.generateSchema();
    expect(s).toEqual({
      accounts: {
        big_map: {
          key: 'address',
          value: {
            allowances: {
              map: {
                key: 'address',
                value: 'nat',
              },
            },
            balance: 'nat',
          },
        },
      },
      name: 'string',
      owner: 'address',
      symbol: 'string',
      totalSupply: 'nat',
      version: 'nat',
    });

    expect(schema.generateSchema()).toEqual({
      __michelsonType: 'pair',
      schema: {
        accounts: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'address',
              schema: 'address',
            },
            value: {
              __michelsonType: 'pair',
              schema: {
                allowances: {
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
        name: {
          __michelsonType: 'string',
          schema: 'string',
        },
        owner: {
          __michelsonType: 'address',
          schema: 'address',
        },
        symbol: {
          __michelsonType: 'string',
          schema: 'string',
        },
        totalSupply: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
        version: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
      },
    });
  });

  it('Should encode storage properly', () => {
    const schema = new Schema(storage);
    const result = schema.Encode({
      accounts: new MichelsonMap(),
      name: 'Token B',
      owner: 'tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS',
      symbol: 'B',
      totalSupply: new BigNumber('1000'),
      version: new BigNumber('1'),
    });
    expect(result).toEqual({
      args: [[], rpcContractResponse.script.storage.args[1]],
      prim: 'Pair',
    });
  });

  it('Should encode parameter schema properly', () => {
    const schema = new ParameterSchema(params);
    const result = schema.Encode('approve', 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn', '0');
    expect(schema.isMultipleEntryPoint).toBeTruthy();
    expect(result).toEqual({
      prim: 'Right',
      args: [
        {
          prim: 'Left',
          args: [
            {
              prim: 'Pair',
              args: [{ string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' }, { int: '0' }],
            },
          ],
        },
      ],
    });
  });

  it('Should encode parameter schema properly', () => {
    const schema = new ParameterSchema(params);
    const result = schema.Encode(
      'allowance',
      'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
      'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
      'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D'
    );
    expect(result).toEqual({
      prim: 'Right',
      args: [
        {
          prim: 'Right',
          args: [
            {
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
                            { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' },
                            {
                              prim: 'Pair',
                              args: [
                                { string: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn' },
                                { string: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D' },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });
  it('Should parse storage properly', () => {
    const schema = new Schema(storage);
    const s = schema.Execute(rpcContractResponse.script.storage);
    expect(s).toEqual({
      accounts: expectMichelsonMap(),
      name: 'Token B',
      owner: 'tz1ccqAEwfPgeoipnXtjAv1iucrpQv3DFmmS',
      symbol: 'B',
      totalSupply: new BigNumber('1000'),
      version: new BigNumber('1'),
    });
  });

  it('Should parse big map properly', () => {
    const schema = new Schema(storage);
    const s = schema.ExecuteOnBigMapDiff(bigMapDiff);
    expect(s).toEqual(
      expectMichelsonMap({
        tz1Ra8yQVQN4Nd7LpPQ6UT6t3bsWWqHZ9wa6: {
          allowances: MichelsonMap.fromLiteral({
            tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD: new BigNumber('60'),
          }),
          balance: new BigNumber('200'),
        },
      })
    );
  });

  it('Should build parameter schema properly', () => {
    const schema = new ParameterSchema(params);
    const extractSchema_Legacy = {
      allowance: {
        '4': 'address',
        '5': 'address',
        NatNatContract: 'contract',
      },
      approve: {
        '1': 'address',
        '2': 'nat',
      },
      balanceOf: {
        '3': 'address',
        NatContract: 'contract',
      },
      createAccount: {
        '5': 'address',
        '6': 'nat',
      },
      createAccounts: {
        list: {
          '6': 'address',
          '7': 'nat',
        },
      },
      transfer: {
        '0': 'address',
        '1': 'nat',
      },
      transferFrom: {
        '2': 'address',
        '3': 'address',
        '4': 'nat',
      },
    };
    const extractSchema_ResetFields = {
      allowance: {
        '0': 'address',
        '1': 'address',
        NatNatContract: 'contract',
      },
      approve: {
        '0': 'address',
        '1': 'nat',
      },
      balanceOf: {
        '0': 'address',
        NatContract: 'contract',
      },
      createAccount: {
        '0': 'address',
        '1': 'nat',
      },
      createAccounts: {
        list: {
          '0': 'address',
          '1': 'nat',
        },
      },
      transfer: {
        '0': 'address',
        '1': 'nat',
      },
      transferFrom: {
        '0': 'address',
        '1': 'address',
        '2': 'nat',
      },
    };

    const generateSchema_Legacy = {
      __michelsonType: 'or',
      schema: {
        allowance: {
          __michelsonType: 'pair',
          schema: {
            '4': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '5': {
              __michelsonType: 'address',
              schema: 'address',
            },
            NatNatContract: {
              __michelsonType: 'contract',
              schema: {
                parameter: {
                  __michelsonType: 'pair',
                  schema: {
                    '0': {
                      __michelsonType: 'nat',
                      schema: 'nat',
                    },
                    '1': {
                      __michelsonType: 'nat',
                      schema: 'nat',
                    },
                  },
                },
              },
            },
          },
        },
        approve: {
          __michelsonType: 'pair',
          schema: {
            '1': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '2': {
              __michelsonType: 'nat',
              schema: 'nat',
            },
          },
        },
        balanceOf: {
          __michelsonType: 'pair',
          schema: {
            '3': {
              __michelsonType: 'address',
              schema: 'address',
            },
            NatContract: {
              __michelsonType: 'contract',
              schema: {
                parameter: {
                  __michelsonType: 'nat',
                  schema: 'nat',
                },
              },
            },
          },
        },
        createAccount: {
          __michelsonType: 'pair',
          schema: {
            '5': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '6': {
              __michelsonType: 'nat',
              schema: 'nat',
            },
          },
        },
        createAccounts: {
          __michelsonType: 'list',
          schema: {
            __michelsonType: 'pair',
            schema: {
              '6': {
                __michelsonType: 'address',
                schema: 'address',
              },
              '7': {
                __michelsonType: 'nat',
                schema: 'nat',
              },
            },
          },
        },
        transfer: {
          __michelsonType: 'pair',
          schema: {
            '0': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '1': {
              __michelsonType: 'nat',
              schema: 'nat',
            },
          },
        },
        transferFrom: {
          __michelsonType: 'pair',
          schema: {
            '2': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '3': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '4': {
              __michelsonType: 'nat',
              schema: 'nat',
            },
          },
        },
      },
    };

    const generateSchema_ResetFields = {
      __michelsonType: 'or',
      schema: {
        allowance: {
          __michelsonType: 'pair',
          schema: {
            '0': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '1': {
              __michelsonType: 'address',
              schema: 'address',
            },
            NatNatContract: {
              __michelsonType: 'contract',
              schema: {
                parameter: {
                  __michelsonType: 'pair',
                  schema: {
                    '0': {
                      __michelsonType: 'nat',
                      schema: 'nat',
                    },
                    '1': {
                      __michelsonType: 'nat',
                      schema: 'nat',
                    },
                  },
                },
              },
            },
          },
        },
        approve: {
          __michelsonType: 'pair',
          schema: {
            '0': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '1': {
              __michelsonType: 'nat',
              schema: 'nat',
            },
          },
        },
        balanceOf: {
          __michelsonType: 'pair',
          schema: {
            '0': {
              __michelsonType: 'address',
              schema: 'address',
            },
            NatContract: {
              __michelsonType: 'contract',
              schema: {
                parameter: {
                  __michelsonType: 'nat',
                  schema: 'nat',
                },
              },
            },
          },
        },
        createAccount: {
          __michelsonType: 'pair',
          schema: {
            '0': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '1': {
              __michelsonType: 'nat',
              schema: 'nat',
            },
          },
        },
        createAccounts: {
          __michelsonType: 'list',
          schema: {
            __michelsonType: 'pair',
            schema: {
              '0': {
                __michelsonType: 'address',
                schema: 'address',
              },
              '1': {
                __michelsonType: 'nat',
                schema: 'nat',
              },
            },
          },
        },
        transfer: {
          __michelsonType: 'pair',
          schema: {
            '0': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '1': {
              __michelsonType: 'nat',
              schema: 'nat',
            },
          },
        },
        transferFrom: {
          __michelsonType: 'pair',
          schema: {
            '0': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '1': {
              __michelsonType: 'address',
              schema: 'address',
            },
            '2': {
              __michelsonType: 'nat',
              schema: 'nat',
            },
          },
        },
      },
    };

    Token.fieldNumberingStrategy = 'Legacy';
    expect(schema.generateSchema()).toEqual(extractSchema_Legacy);
    expect(schema.generateSchema()).toEqual(generateSchema_Legacy);
    Token.fieldNumberingStrategy = 'ResetFieldNumbersInNestedObjects';
    expect(schema.generateSchema()).toEqual(extractSchema_ResetFields);
    expect(schema.generateSchema()).toEqual(generateSchema_ResetFields);
    Token.fieldNumberingStrategy = 'Latest';
    expect(schema.generateSchema()).toEqual(extractSchema_ResetFields);
    expect(schema.generateSchema()).toEqual(generateSchema_ResetFields);
  });

  it('Should extract signature properly', () => {
    const schema = new ParameterSchema(params);
    const sig = schema.ExtractSignatures();
    expect(sig).toContainEqual(['allowance', 'address', 'address', 'contract']);
    expect(sig).toContainEqual(['approve', 'address', 'nat']);
    expect(sig).toContainEqual(['balanceOf', 'address', 'contract']);
    expect(sig).toContainEqual(['createAccount', 'address', 'nat']);
    const createAccount_Legacy = {
      list: {
        '6': 'address',
        '7': 'nat',
      },
    };
    const createAccount_ResetFields = {
      list: {
        '0': 'address',
        '1': 'nat',
      },
    };
    Token.fieldNumberingStrategy = 'Legacy';
    expect(schema.ExtractSignatures()).toContainEqual(['createAccounts', createAccount_Legacy]);
    Token.fieldNumberingStrategy = 'ResetFieldNumbersInNestedObjects';
    expect(schema.ExtractSignatures()).toContainEqual([
      'createAccounts',
      createAccount_ResetFields,
    ]);
    Token.fieldNumberingStrategy = 'Latest';
    expect(schema.ExtractSignatures()).toContainEqual([
      'createAccounts',
      createAccount_ResetFields,
    ]);
    expect(sig).toContainEqual(['transfer', 'address', 'nat']);
    expect(sig).toContainEqual(['transferFrom', 'address', 'address', 'nat']);
  });

  it('Should parse parameter properly', () => {
    const schema = new ParameterSchema(params);
    const execute_Legacy = {
      approve: {
        '1': 'tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD',
        '2': new BigNumber('60'),
      },
    };
    const execute_ResetFields = {
      approve: {
        '0': 'tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD',
        '1': new BigNumber('60'),
      },
    };
    Token.fieldNumberingStrategy = 'Legacy';
    expect(schema.Execute(txParams)).toEqual(execute_Legacy);
    Token.fieldNumberingStrategy = 'ResetFieldNumbersInNestedObjects';
    expect(schema.Execute(txParams)).toEqual(execute_ResetFields);
    Token.fieldNumberingStrategy = 'Latest';
    expect(schema.Execute(txParams)).toEqual(execute_ResetFields);
  });

  it(`Should find the value that corresponds to the type ({ prim: 'string', annots: ['%name'] }) in top-level pairs of the storage`, () => {
    const typeOfValueToFind = { prim: 'string', annots: ['%name'] };
    const storageSchema = new Schema(storage);
    const valueFound = storageSchema.FindFirstInTopLevelPair(
      rpcContractResponse.script.storage,
      typeOfValueToFind
    );
    expect(valueFound).toEqual({ string: 'Token B' });
  });
});
