import { Schema } from '../src/schema/storage';
import { ParameterSchema } from '../src/schema/parameter';
import { storage, params, rpcContractResponse, bigMapValue } from '../data/baker_registry';
import BigNumber from 'bignumber.js';
import { MichelsonMap } from '../src/michelson-map';
describe('Baker Registry contract test', () => {
  it('Test storage schema', () => {
    const schema = new Schema(storage);
    expect(schema.generateSchema()).toEqual({
      __michelsonType: 'pair',
      schema: {
        '0': {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'key_hash',
              schema: 'key_hash',
            },
            value: {
              __michelsonType: 'pair',
              schema: {
                data: {
                  __michelsonType: 'option',
                  schema: {
                    __michelsonType: 'bytes',
                    schema: 'bytes',
                  },
                },
                last_update: {
                  __michelsonType: 'timestamp',
                  schema: 'timestamp',
                },
                reporter: {
                  __michelsonType: 'option',
                  schema: {
                    __michelsonType: 'address',
                    schema: 'address',
                  },
                },
              },
            },
          },
        },
        owner: {
          __michelsonType: 'address',
          schema: 'address',
        },
        signup_fee: {
          __michelsonType: 'mutez',
          schema: 'mutez',
        },
        update_fee: {
          __michelsonType: 'mutez',
          schema: 'mutez',
        },
      },
    });
  });

  it('Decode storage properly', () => {
    const schema = new Schema(storage);
    expect(schema.Execute(rpcContractResponse.script.storage)).toEqual({
      '0': expect.objectContaining(new MichelsonMap()),
      owner: 'tz1aicu922KqrGxpdTpVdSD1Jrqz7fJiUu6L',
      signup_fee: new BigNumber('8000000'),
      update_fee: new BigNumber('1000000'),
    });
  });

  it('Encode big map key properly', () => {
    const schema = new Schema(storage);
    expect(schema.EncodeBigMapKey('tz1MXFrtZoaXckE41bjUCSjAjAap3AFDSr3N')).toEqual({
      key: {
        string: 'tz1MXFrtZoaXckE41bjUCSjAjAap3AFDSr3N',
      },
      type: {
        prim: 'key_hash',
      },
    });
  });

  it('Decode big map value properly', () => {
    const schema = new Schema(storage);
    expect(schema.ExecuteOnBigMapValue(bigMapValue)).toEqual({
      data: {
        Some: '7b2262616b65724e616d65223a2022457665727374616b65222c2262616b65724163636f756e74223a2022747a314d584672745a6f6158636b453431626a5543536a416a416170334146445372334e222c227265706f727465724163636f756e74223a2022222c226f70656e466f7244656c65676174696f6e223a202274727565222c2262616b65724f6666636861696e526567697374727955726c223a2022222c226665654d6f64656c223a207b227061796f75744163636f756e7473223a205b5d2c22666565223a20223130222c226d696e44656c65676174696f6e223a202230222c227061796f757444656c6179223a20362c227061796f75744672657175656e6379223a202231222c227061796f757446726571756e6563794d696e5061796f7574223a20302c226f76657244656c65676174696f6e223a203130302c226f76657244656c65676174696f6e5374616b6544696c7574696f6e223a20747275652c2262616b6572436861726765735061796f75745472616e73616374696f6e466565223a20747275652c227265776172647350616964223a207b22626c6f636b52657761726473223a20747275652c226d6973736564426c6f636b73223a2066616c73652c2273746f6c656e426c6f636b73223a20747275652c22656e646f72736552657761726473223a20747275652c226d6973736564456e646f7273656d656e7473223a2066616c73652c226c6f775072696f72697479456e646f72736550616964417346756c6c223a2066616c73652c227472616e73616374696f6e46656573223a20747275652c2261636375736174696f6e52657761726473223a20747275652c22616363757365644c6f73744465706f736974223a2066616c73652c22616363757365644c6f737452657761726473223a2066616c73652c22616363757365644c6f737446656573223a2066616c73652c22726576656c6174696f6e52657761726473223a20747275652c226d6973736564526576656c6174696f6e223a2066616c73652c226d6973736564526576656c6174696f6e46656573223a2066616c73657d7d7d',
      },
      last_update: '2019-09-24T07:23:56.000Z',
      reporter: null,
    });
  });

  it('Extract parameter schema properly', () => {
    const schema = new ParameterSchema(params);
    expect(schema.generateSchema()).toEqual({
      __michelsonType: 'or',
      schema: {
        set_data: {
          __michelsonType: 'pair',
          schema: {
            delegate: {
              __michelsonType: 'key_hash',
              schema: 'key_hash',
            },
            data: {
              __michelsonType: 'option',
              schema: {
                __michelsonType: 'bytes',
                schema: 'bytes',
              },
            },
            reporter: {
              __michelsonType: 'option',
              schema: {
                __michelsonType: 'address',
                schema: 'address',
              },
            },
          },
        },
        set_fees: {
          __michelsonType: 'pair',
          schema: {
            signup_fee: {
              __michelsonType: 'mutez',
              schema: 'mutez',
            },
            update_fee: {
              __michelsonType: 'mutez',
              schema: 'mutez',
            },
          },
        },
        withdraw: {
          __michelsonType: 'contract',
          schema: {
            parameter: {
              __michelsonType: 'unit',
              schema: 'unit',
            },
          },
        },
      },
    });

    expect(schema.ExtractSignatures()).toContainEqual([
      'set_data',
      { __michelsonType: 'key_hash', schema: 'key_hash' },
      { __michelsonType: 'bytes', schema: 'bytes' },
      { __michelsonType: 'address', schema: 'address' },
    ]);
    expect(schema.ExtractSignatures()).toContainEqual([
      'set_fees',
      { __michelsonType: 'mutez', schema: 'mutez' },
      { __michelsonType: 'mutez', schema: 'mutez' },
    ]);
    expect(schema.ExtractSignatures()).toContainEqual([
      'withdraw',
      {
        __michelsonType: 'contract',
        schema: {
          parameter: { __michelsonType: 'unit', schema: 'unit' },
        },
      },
    ]);
  });

  it('Encode parameter schema properly', () => {
    const schema = new ParameterSchema(params);
    expect(
      schema.Encode(
        'set_data',
        'tz1PPPYChg5xXHpGzygnNkmzPd1hyVRMxvJf',
        '0123',
        'tz1PPPYChg5xXHpGzygnNkmzPd1hyVRMxvJf'
      )
    ).toEqual({
      args: [
        {
          args: [
            {
              string: 'tz1PPPYChg5xXHpGzygnNkmzPd1hyVRMxvJf',
            },
            {
              args: [
                {
                  args: [
                    {
                      bytes: '0123',
                    },
                  ],
                  prim: 'Some',
                },
                {
                  args: [
                    {
                      string: 'tz1PPPYChg5xXHpGzygnNkmzPd1hyVRMxvJf',
                    },
                  ],
                  prim: 'Some',
                },
              ],
              prim: 'Pair',
            },
          ],
          prim: 'Pair',
        },
      ],
      prim: 'Left',
    });

    expect(schema.Encode('set_fees', '123', '123')).toEqual({
      args: [
        {
          args: [
            {
              args: [
                {
                  int: '123',
                },
                {
                  int: '123',
                },
              ],
              prim: 'Pair',
            },
          ],
          prim: 'Left',
        },
      ],
      prim: 'Right',
    });

    expect(schema.Encode('withdraw', 'KT1M66xx9xTEb16LtHEN975KPHnBpSkDXhpw')).toEqual({
      args: [
        {
          args: [
            {
              string: 'KT1M66xx9xTEb16LtHEN975KPHnBpSkDXhpw',
            },
          ],
          prim: 'Right',
        },
      ],
      prim: 'Right',
    });
  });
});
