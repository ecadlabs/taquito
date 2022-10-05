import { createToken } from '../../src/tokens/createToken';
import { expectMichelsonMap } from '../utils';

describe('BigMap', () => {
  const bigMap = createToken({ prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] }, 0);

  it('Should use custom semantic when provided', () => {
    const result = bigMap.Execute({ int: 1 } as any, { big_map: () => 'working' });
    expect(result).toBe('working');
  });

  it('Should use default semantic when omitted', () => {
    const result = bigMap.Execute([]);
    expect(result).toEqual(expectMichelsonMap());
  });

  it('Should use default semantic (return id) when omitted', () => {
    const result = bigMap.Execute({ int: 12 } as any);
    expect(result).toEqual(12);
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

});
