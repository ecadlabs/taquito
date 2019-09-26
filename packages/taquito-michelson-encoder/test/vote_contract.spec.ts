import { params, storage } from '../data/vote_contract';
import { Schema } from '../src/schema/storage';

describe('Schema test', () => {
  it('Should parse storage properly', () => {
    const schema = new Schema(storage);
    expect(schema.ExtractSchema()).toEqual({});
  });
});
