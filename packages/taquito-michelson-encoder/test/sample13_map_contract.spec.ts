import { Schema } from '../src/schema/storage';
import { storage, rpcContractResponse } from '../data/sample13_map_contract';

describe('Schema with a map as root storage', () => {
  it('Should decode storage properly and do not remove top level annotation', () => {
    const schema = new Schema(storage);
    expect(schema.Execute(rpcContractResponse.script.storage)).toEqual({
      '1': 'test',
    });
  });

  it('Should extract schema properly and do not remove top level annotation', () => {
    const schema = new Schema(storage);
    expect(schema.ExtractSchema()).toEqual({
      nat: 'string',
    });
  });
});
