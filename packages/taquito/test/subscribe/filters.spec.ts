import { evaluateOpFilter, evaluateExpression } from '../../src/subscribe/filters';

describe('Evaluate OpFilter', () => {
  it('should return true if match hash filter', () => {
    const result = evaluateOpFilter({ hash: 'test' } as any, { opHash: 'test' });
    expect(result).toBeTruthy();
  });

  it('should return false if not match hash filter', () => {
    const result = evaluateOpFilter({ hash: 'test2' } as any, { opHash: 'test' });
    expect(result).toBeFalsy();
  });

  it('should return true if match source filter', () => {
    const result = evaluateOpFilter({ source: 'test' } as any, { source: 'test' });
    expect(result).toBeTruthy();
  });

  it('should return false if no contents on match source filter', () => {
    const result = evaluateOpFilter({} as any, { source: 'test' });
    expect(result).toBeFalsy();
  });

  it('should return false if no match source filter', () => {
    const result = evaluateOpFilter({ source: 'test1' } as any, {
      source: 'test',
    });
    expect(result).toBeFalsy();
  });
});

describe('Evaluate expression', () => {
  it('should expect an or/and parameter', () => {
    expect(() => {
      evaluateExpression({ source: 'test1' } as any, {} as any);
    }).toThrowError();
  });

  it('and should require all filter to return true', () => {
    const result = evaluateExpression(
      { hash: 'test1', contents: [{}, { source: 'test' }] } as any,
      { and: [{ source: 'test' }, { opHash: 'test' }] }
    );
    expect(result).toBeFalsy();
  });

  it('or should require all filter to return true', () => {
    const result = evaluateExpression(
      { hash: 'test1', source: 'test' } as any,
      { or: [{ source: 'test' }, { opHash: 'test' }] }
    );
    expect(result).toBeTruthy();
  });

  it('and should require all filter to return true', () => {
    const result = evaluateExpression({ hash: 'test', source: 'test' } as any, {
      and: [{ source: 'test', opHash: 'test' }],
    });
    expect(result).toBeTruthy();
  });
});
