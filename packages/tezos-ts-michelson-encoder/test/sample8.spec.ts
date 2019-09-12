import { params as params8 } from '../data/sample8';
import { ParameterSchema } from '../src/schema/parameter';

describe('Schema test', () => {
  it('Should parse storage properly', () => {
    const schema = new ParameterSchema(params8);
    const storage = schema.ExtractSchema();
    expect(storage).toEqual('string');
    expect({ string: 'test' }).toEqual(schema.Encode('test'));
    expect(schema.isMultipleEntryPoint).toBeFalsy();
  });
});
