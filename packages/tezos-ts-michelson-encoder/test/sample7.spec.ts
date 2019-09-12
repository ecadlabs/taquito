import { rpcContractResponse as rpcContractResponse7, storage as storage7 } from '../data/sample7';
import { Schema } from '../src/schema/storage';

describe('Schema test', () => {
  it('Should parse storage properly', () => {
    const schema = new Schema(storage7);
    const storage = schema.Execute(rpcContractResponse7.script.storage);
    expect(storage).toEqual({
      game: null,
      oracle_id: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
    });
  });
});
