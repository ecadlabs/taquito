import { storage } from '../data/variant_contract';
import { Schema } from '../src/schema/storage';

describe('Variant contract test', () => {
  it('Should encode storage properly (Right)', () => {
    const schema = new Schema(storage);
    expect(schema.Encode({ test2: 1 })).toEqual({ prim: 'Right', args: [{ int: '1' }] });
  });
  it('Should encode storage properly (Left)', () => {
    const schema = new Schema(storage);
    expect(schema.Encode({ test: 'hello world' })).toEqual({
      prim: 'Left',
      args: [{ string: 'hello world' }],
    });
  });
});
