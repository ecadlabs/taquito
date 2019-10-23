import { BigMapToken } from '../../src/tokens/bigmap';

describe('BigMap', () => {
  it('Should use custom semantic when provided', () => {
    const bigMap = new BigMapToken(
      { prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] },
      0,
      null as any
    );
    const result = bigMap.Execute({ int: 1 } as any, { big_map: () => 'working' });
    expect(result).toBe('working');
  });

  it('Should use default semantic when omitted', () => {
    const bigMap = new BigMapToken(
      { prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] },
      0,
      null as any
    );
    const result = bigMap.Execute([]);
    expect(result).toEqual({});
  });

  it('Should use default semantic (return id) when omitted', () => {
    const bigMap = new BigMapToken(
      { prim: 'big_map', args: [{ prim: 'address' }, { prim: 'int' }] },
      0,
      null as any
    );
    const result = bigMap.Execute({ int: 12 } as any);
    expect(result).toEqual(12);
  });
});
