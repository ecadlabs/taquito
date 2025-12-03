import { rpcContractResponse, storage } from '../data/sample13_map_contract';
import { Schema } from '../src/schema/storage';
import { expectMichelsonMap } from './utils';

describe('Schema with a map as root storage', () => {
  it('Should decode storage properly and do not remove top level annotation', () => {
    const schema = new Schema(storage);
    expect(schema.Execute(rpcContractResponse.script.storage)).toEqual(
      expectMichelsonMap({
        '1': 'test',
      })
    );
  });

  it('Should extract schema properly and do not remove top level annotation', () => {
    const schema = new Schema(storage);
    expect(schema.generateSchema()).toEqual({
      map: {
        key: 'nat',
        value: 'string',
      },
    });

    expect(schema.generateSchema()).toEqual({
      __michelsonType: "map",
      schema: {
        key: {
          __michelsonType: "nat",
          schema: 'nat'
        },
        value: {
          __michelsonType: "string",
          schema: 'string'
        }
      },
    });
  });
});
