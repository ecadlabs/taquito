import BigNumber from 'bignumber.js';
import { bigMapValue, rpcContractResponse, storage } from '../data/sample18_ticket';
import { Schema } from '../src/schema/storage';

describe('Schema with a ticket of type nat inside a big map %tickets in storage', () => {
  // key of the big map is nat and value is ticket of type nat
  it('Should decode storage properly', () => {
    const schema = new Schema(storage);
    expect(schema.Execute(rpcContractResponse.script.storage)).toEqual({
      admin: 'tz1bwfmSYqrhUTAoybGdhWBBefsbuhNdcC2Y',
      current_id: new BigNumber(2),
      tickets: '142',
      token_metadata: '143',
    });
  });

  it('Should extract schema properly', () => {
    const schema = new Schema(storage);
    expect(schema.generateSchema()).toEqual({
      __michelsonType: 'pair',
      schema: {
        admin: {
          __michelsonType: 'address',
          schema: 'address',
        },
        current_id: {
          __michelsonType: 'nat',
          schema: 'nat',
        },
        tickets: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'nat',
              schema: 'nat',
            },
            value: {
              __michelsonType: 'ticket',
              schema: {
                amount: {
                  __michelsonType: 'int',
                  schema: 'int',
                },
                ticketer: {
                  __michelsonType: 'contract',
                  schema: 'contract',
                },
                value: {
                  __michelsonType: 'nat',
                  schema: 'nat',
                },
              },
            },
          },
        },
        token_metadata: {
          __michelsonType: 'big_map',
          schema: {
            key: {
              __michelsonType: 'nat',
              schema: 'nat',
            },
            value: {
              __michelsonType: 'pair',
              schema: {
                '0': {
                  __michelsonType: 'nat',
                  schema: 'nat',
                },
                '1': {
                  __michelsonType: 'map',
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
              },
            },
          },
        },
      },
    });
  });

  it('Should parse big map value properly', () => {
    const schema = new Schema({
      prim: 'big_map',
      args: [{ prim: 'nat' }, { prim: 'ticket', args: [{ prim: 'nat' }] }],
      annots: ['%tickets'],
    });
    const value = schema.ExecuteOnBigMapValue(bigMapValue);
    expect(value).toEqual({
      ticketer: 'KT1EAMUQC1yJ2sRPNPpLHVMGCzroYGe1C1ea',
      value: new BigNumber('0'),
      amount: new BigNumber('1'),
    });
  });
});
