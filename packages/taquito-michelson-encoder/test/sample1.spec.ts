import BigNumber from 'bignumber.js';
import { bigMapDiff, params, rpcContractResponse, storage, txParams } from '../data/sample1';
import { ParameterSchema } from '../src/schema/parameter';
import { Schema } from '../src/schema/storage';

describe('Schema test', () => {
  it('Should extract schema properly', () => {
    const schema = new Schema(storage);
    const s = schema.ExtractSchema();
    expect(s).toEqual({
      accounts: {
        address: {
          allowances: {
            address: 'nat',
          },
          balance: 'nat',
        },
      },
      name: 'string',
      owner: 'address',
      symbol: 'string',
      totalSupply: 'nat',
      version: 'nat',
    });
  });

  it('Should encode parameter schema properly', () => {
    const schema = new ParameterSchema(params);
    const result = schema.Encode('approve', 'test', '0');
    expect(schema.isMultipleEntryPoint).toBeTruthy();
    expect(result).toEqual({
      prim: 'Right',
      args: [
        {
          prim: 'Left',
          args: [{ prim: 'Pair', args: [{ string: 'test' }, { int: '0' }] }],
        },
      ],
    });
  });

  it('Should encode parameter schema properly', () => {
    const schema = new ParameterSchema(params);
    const result = schema.Encode('allowance', 'test', 'test2', 'test3');
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
                            { string: 'test' },
                            {
                              prim: 'Pair',
                              args: [{ string: 'test2' }, { string: 'test3' }],
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
      accounts: {},
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
    expect(s).toEqual({
      tz1Ra8yQVQN4Nd7LpPQ6UT6t3bsWWqHZ9wa6: {
        allowances: {
          tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD: new BigNumber('60'),
        },
        balance: new BigNumber('200'),
      },
    });
  });

  it('Should build parameter schema properly', () => {
    const schema = new ParameterSchema(params);
    const s = schema.ExtractSchema();
    expect(s).toEqual({
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
      createAccounts: 'list',
      transfer: {
        '0': 'address',
        '1': 'nat',
      },
      transferFrom: {
        '2': 'address',
        '3': 'address',
        '4': 'nat',
      },
    });
  });

  it('Should parse parameter properly', () => {
    const schema = new ParameterSchema(params);
    const s = schema.Execute(txParams);
    expect(s).toEqual({
      approve: {
        '1': 'tz1fPjyo55HwUAkd1xcL5vo6DGzJrkxAMpiD',
        '2': new BigNumber('60'),
      },
    });
  });
});
