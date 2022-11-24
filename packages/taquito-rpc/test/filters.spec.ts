import { eventFilter, InternalOperationResult } from '../src/taquito-rpc';

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
  });
