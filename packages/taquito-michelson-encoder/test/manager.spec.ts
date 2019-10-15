import { doSchema, rpcContractResponse, storage } from '../data/manager';
import { ParameterSchema } from '../src/schema/parameter';
import { Schema } from '../src/schema/storage';

describe('Schema test', () => {
  it('Should parse storage schema properly', () => {
    const schema = new Schema(storage);
    expect(schema.ExtractSchema()).toEqual('key_hash');
  });

  it('Should parse storage properly', () => {
    const schema = new Schema(storage);
    expect(schema.Execute(rpcContractResponse.script.storage)).toEqual(
      'tz1UbbpwwefHU7N7EiHr6hiyFA2sDJi5vXkq'
    );
  });

  it('Should parse parameter properly', () => {
    const schema = new ParameterSchema(doSchema);
    expect(
      schema.Encode([
        { prim: 'DROP' },
        { prim: 'NIL', args: [{ prim: 'operation' }] },
        {
          prim: 'PUSH',
          args: [{ prim: 'key_hash' }, { string: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh' }],
        },
        { prim: 'SOME' },
        { prim: 'SET_DELEGATE' },
        { prim: 'CONS' },
      ])
    ).toEqual([
      { prim: 'DROP' },
      { prim: 'NIL', args: [{ prim: 'operation' }] },
      {
        prim: 'PUSH',
        args: [{ prim: 'key_hash' }, { string: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh' }],
      },
      { prim: 'SOME' },
      { prim: 'SET_DELEGATE' },
      { prim: 'CONS' },
    ]);
  });
});
