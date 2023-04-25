import { InternalOperationResult } from '@taquito/rpc';
import { evaluateOpFilter, evaluateExpression, eventFilter } from '../../src/subscribe/filters';

const mockInternalOperationResult = {
  kind: 'event',
  source: 'KT1TzvwJxn8dNHc8M2FLvTiUg6LwjUfC4X94',
  nonce: 2,
  type: {
    prim: 'or',
    args: [
      {
        prim: 'nat',
      },
      {
        prim: 'string',
      },
    ],
  },
  tag: 'test',
  payload: {
    prim: 'Left',
    args: [
      {
        int: '10',
      },
    ],
  },
  result: {
    status: 'applied',
    consumed_milligas: '1000000',
  },
};

const mockFailedInternalOperationResult = {
  kind: 'event',
  source: 'KT1TzvwJxn8dNHc8M2FLvTiUg6LwjUfC4X94',
  nonce: 2,
  type: {
    prim: 'or',
    args: [
      {
        prim: 'nat',
      },
      {
        prim: 'string',
      },
    ],
  },
  tag: 'test',
  payload: {
    prim: 'Left',
    args: [
      {
        int: '10',
      },
    ],
  },
  result: {
    status: 'failed',
    consumed_milligas: '1000000',
  },
};

const mockNonEventInternalOperationResult = {
  kind: 'transaction',
  source: 'KT1TzvwJxn8dNHc8M2FLvTiUg6LwjUfC4X94',
  nonce: 2,
  type: {},
  result: {
    status: 'applied',
    consumed_milligas: '1000000',
  },
};

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

describe('Event filter', () => {
  it('should return true if it matches address property in event filter', () => {
    const result = eventFilter(
      mockInternalOperationResult as InternalOperationResult,
      'KT1TzvwJxn8dNHc8M2FLvTiUg6LwjUfC4X94',
      undefined
    );
    expect(result).toBeTruthy();
  });

  it('should return true if operationContent matches tag property in event filter', () => {
    const result = eventFilter(
      mockInternalOperationResult as InternalOperationResult,
      undefined,
      'test'
    );
    expect(result).toBeTruthy();
  });

  it('should return false if address property does not match in event filter', () => {
    const result = eventFilter(
      mockInternalOperationResult as InternalOperationResult,
      'invalid',
      'test'
    );
    expect(result).toBeFalsy();
  });

  it('should return false if tag property does not match in event filter', () => {
    const result = eventFilter(
      mockInternalOperationResult as InternalOperationResult,
      'KT1TzvwJxn8dNHc8M2FLvTiUg6LwjUfC4X94',
      'invalid'
    );
    expect(result).toBeFalsy();
  });

  it('should return true if both address and tag matches event filter', () => {
    const result = eventFilter(
      mockInternalOperationResult as InternalOperationResult,
      'KT1TzvwJxn8dNHc8M2FLvTiUg6LwjUfC4X94',
      'test'
    );
    expect(result).toBeTruthy();
  });

  it('should return all any event kind when address and tag params are undefined', () => {
    const result = eventFilter(mockInternalOperationResult as InternalOperationResult);
    expect(result).toBeTruthy();
  });

  it('should return false when both address and tag does not match', () => {
    const result = eventFilter(
      mockInternalOperationResult as InternalOperationResult,
      'invalid',
      'invalid'
    );
    expect(result).toBeFalsy();
  });

  it('should return false when internal_operation_result kind is not event', () => {
    const result = eventFilter(
      mockNonEventInternalOperationResult as InternalOperationResult,
      'tag',
      'test'
    );
    expect(result).toBeFalsy();
  });

  it('should return true for a failed operation when not filtering failed operations', () => {
    const result = eventFilter(
      mockFailedInternalOperationResult as InternalOperationResult,
      'KT1TzvwJxn8dNHc8M2FLvTiUg6LwjUfC4X94',
      'test',
    );
    expect(result).toBeTruthy();
  });

  it('should return true for a failed operation when passing false to excludeFailedOperations', () => {
    const result = eventFilter(
      mockFailedInternalOperationResult as InternalOperationResult,
      'KT1TzvwJxn8dNHc8M2FLvTiUg6LwjUfC4X94',
      'test',
      false
    );
    expect(result).toBeTruthy();
  });

  it('should return true for a successful operation when passing true to excludeFailedOperations', () => {
    const result = eventFilter(
      mockInternalOperationResult as InternalOperationResult,
      'KT1TzvwJxn8dNHc8M2FLvTiUg6LwjUfC4X94',
      'test',
      true
    );
    expect(result).toBeTruthy();
  });

  it('should return false for a failed operation when passing true to excludeFailedOperations', () => {
    const result = eventFilter(
      mockFailedInternalOperationResult as InternalOperationResult,
      'KT1TzvwJxn8dNHc8M2FLvTiUg6LwjUfC4X94',
      'test',
      true
    );
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
    const result = evaluateExpression({ hash: 'test1', source: 'test' } as any, {
      or: [{ source: 'test' }, { opHash: 'test' }],
    });
    expect(result).toBeTruthy();
  });

  it('and should require all filter to return true', () => {
    const result = evaluateExpression({ hash: 'test', source: 'test' } as any, {
      and: [{ source: 'test', opHash: 'test' }],
    });
    expect(result).toBeTruthy();
  });
});
