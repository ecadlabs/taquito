import { params, storage, rpcContractResponse } from '../data/vote_contract';
import { Schema } from '../src/schema/storage';

describe('Schema test', () => {
  it('Should parse storage schema properly', () => {
    const schema = new Schema(storage);
    expect(schema.ExtractSchema()).toEqual({
      "mgr1": {
        "addr": "address",
        "key": "key_hash",
      },
      "mgr2": {
        "addr": "address",
        "key": "key_hash",
      },
    });
  });

  it('Should parse storage properly', () => {
    const schema = new Schema(storage);
    expect(schema.Execute(rpcContractResponse.script.storage)).toEqual({
      "mgr1": {
        "addr": "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn",
        "key": null,
      },
      "mgr2": {
        "addr": "tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn",
        "key": null,
      },
    });
  });
});
