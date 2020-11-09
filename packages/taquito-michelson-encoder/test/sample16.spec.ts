import { getAllowance, getBalance, getTotalSupply, parameter } from '../data/sample16';
import { ParameterSchema } from '../src/schema/parameter';

describe('Schema test when calling contract with complex object as param and null value', () => {

  it('Should encode parameter schema properly', () => {
    const schema = new ParameterSchema(getTotalSupply.args[0]);
    const result = schema.Encode(
      [['Unit']]
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual({ prim: 'Unit' });
  });

  it('Should encode parameter schema properly', () => {
    const schema = new ParameterSchema(getBalance.args[0]);
    const result = schema.Encode(
      'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1'
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual({ string: 'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1' });
  });

  it('Should encode parameter schema properly', () => {
    const schema = new ParameterSchema(getAllowance.args[0]);
    const result = schema.Encode(
      'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1',
      'tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE'
    );
    expect(schema).toBeTruthy();
    expect(result).toEqual(
        { prim: 'Pair',
            args:
                [ { string: 'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1' },
                { string: 'tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE' } ] }
    );
  });

});
