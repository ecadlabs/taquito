import { params } from '../../data/proto005/unit_contract';
import { ParameterSchema } from '../../src/schema/parameter';
import { UnitValue } from '../../src/taquito-michelson-encoder';

describe('Contract with unit encoding', () => {
  it('Should encode parameter properly', () => {
    const schema = new ParameterSchema(params);
    expect(schema.Encode('deposit', UnitValue)).toEqual({ prim: 'Left', args: [{ prim: 'Unit' }] });
  });

  it('Should extract signature properly', () => {
    const schema = new ParameterSchema(params);
    expect(schema.ExtractSignatures()).toContainEqual([
      'deposit',
      { __michelsonType: 'unit', schema: 'unit' },
    ]);
  });
});
