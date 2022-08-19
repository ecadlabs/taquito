
import { MichelsonMap } from '../../src/michelson-map';
import { BigMapToken, BigMapValidationError } from '../../src/tokens/bigmap';
import { createToken } from '../../src/tokens/createToken';
import { expectMichelsonMap } from '../utils';

describe('BigMap', () => {
  const bigMap = createToken({ prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] }, 0) as BigMapToken;

  it('Should use custom semantic when provided', () => {
    const result = bigMap.Execute({ int: '1' }, { big_map: () => 'working' });
    expect(result).toBe('working');
  });

  it('Should use default semantic when omitted', () => {
    const result = bigMap.Execute([]);
    expect(result).toEqual(expectMichelsonMap());
  });

  it('Should use default semantic (return id) when omitted', () => {
    const result = bigMap.Execute({ int: '12' });
    expect(result).toEqual('12');
  });

  it('Should generate the schema properly', () => {
    expect(bigMap.generateSchema()).toEqual({
      __michelsonType: 'big_map',
      schema: {
        key: {
          __michelsonType: 'address',
          schema: 'address'
        },
        value: {
          __michelsonType: 'int',
          schema: 'int'
        }
      }
    });
  });

  it('return should be void if successful', () => {
    const map = MichelsonMap.fromLiteral({
      '8': 8,
      '9': 9,
      '10': 10,
      '11': 11,
      '12': 12,
    });
    const result = bigMap.TypecheckValue(map)
    expect(result).toBeUndefined();
  })

  it('Typecheck should throw error with incorrect value', () => {
    expect(() => bigMap.TypecheckValue({something: "wrong"})).toThrowError(BigMapValidationError)
  })

});
