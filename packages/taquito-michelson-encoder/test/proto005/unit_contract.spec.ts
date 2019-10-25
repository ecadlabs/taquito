import { params } from '../../data/proto005/unit_contract';
import { ParameterSchema } from '../../src/schema/parameter';

describe('Contract with unit encoding', () => {
  it('Should encode parameter properly', () => {
    const schema = new ParameterSchema(params);
    expect(schema.Encode('deposit', null)).toEqual({ prim: 'Left', args: [{ prim: 'Unit' }] });
  });
});
