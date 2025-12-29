import { mapOperationsToTrezor } from '../src/utils';
import { OpKind, OperationContents } from '@taquito/rpc';

describe('mapOperationsToTrezor', () => {
  describe('transaction operations', () => {
    it('should map a simple transaction without parameters', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.TRANSACTION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          amount: '1000000',
          destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.transaction).toBeDefined();
      expect(result.transaction?.source).toBe('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn');
      expect(result.transaction?.destination).toBe('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb');
      expect(result.transaction?.amount).toBe(1000000);
      expect(result.transaction?.fee).toBe(10000);
      expect(result.transaction?.parameters).toBeUndefined();
    });

    it('should map a transaction with Unit parameter (default entrypoint)', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.TRANSACTION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          amount: '0',
          destination: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
          parameters: {
            entrypoint: 'default',
            value: { prim: 'Unit' },
          },
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.transaction).toBeDefined();
      // Unit parameter on default entrypoint returns null (no parameters needed)
      expect(result.transaction?.parameters).toBeUndefined();
    });

    it('should map a transaction with complex parameters (Pair)', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.TRANSACTION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          amount: '0',
          destination: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
          parameters: {
            entrypoint: 'transfer',
            value: {
              prim: 'Pair',
              args: [{ string: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' }, { int: '100' }],
            },
          },
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.transaction).toBeDefined();
      expect(result.transaction?.parameters).toBeDefined();
      expect(Array.isArray(result.transaction?.parameters)).toBe(true);
      // Should have encoded parameters as byte array
      expect(result.transaction!.parameters!.length).toBeGreaterThan(0);
    });

    it('should map a transaction with int parameter', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.TRANSACTION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          amount: '0',
          destination: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
          parameters: {
            entrypoint: 'increment',
            value: { int: '42' },
          },
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.transaction).toBeDefined();
      expect(result.transaction?.parameters).toBeDefined();
      expect(Array.isArray(result.transaction?.parameters)).toBe(true);
    });

    it('should map a transaction with string parameter', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.TRANSACTION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          amount: '0',
          destination: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
          parameters: {
            entrypoint: 'setName',
            value: { string: 'Hello World' },
          },
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.transaction).toBeDefined();
      expect(result.transaction?.parameters).toBeDefined();
      expect(Array.isArray(result.transaction?.parameters)).toBe(true);
    });

    it('should map a transaction with bytes parameter', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.TRANSACTION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          amount: '0',
          destination: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
          parameters: {
            entrypoint: 'setData',
            value: { bytes: 'deadbeef' },
          },
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.transaction).toBeDefined();
      expect(result.transaction?.parameters).toBeDefined();
      expect(Array.isArray(result.transaction?.parameters)).toBe(true);
    });

    it('should map a transaction with list parameter', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.TRANSACTION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          amount: '0',
          destination: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
          parameters: {
            entrypoint: 'setList',
            value: [{ int: '1' }, { int: '2' }, { int: '3' }],
          },
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.transaction).toBeDefined();
      expect(result.transaction?.parameters).toBeDefined();
      expect(Array.isArray(result.transaction?.parameters)).toBe(true);
    });

    it('should map a transaction with nested Pair parameters', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.TRANSACTION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          amount: '0',
          destination: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
          parameters: {
            entrypoint: 'complex',
            value: {
              prim: 'Pair',
              args: [
                {
                  prim: 'Pair',
                  args: [{ string: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb' }, { int: '100' }],
                },
                { prim: 'True' },
              ],
            },
          },
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.transaction).toBeDefined();
      expect(result.transaction?.parameters).toBeDefined();
      expect(Array.isArray(result.transaction?.parameters)).toBe(true);
    });
  });

  describe('delegation operations', () => {
    it('should map a delegation operation', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.DELEGATION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.delegation).toBeDefined();
      expect(result.delegation?.source).toBe('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn');
      expect(result.delegation?.delegate).toBe('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb');
    });

    it('should throw error for undelegation (no delegate)', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.DELEGATION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
        },
      ];

      expect(() => mapOperationsToTrezor(ops)).toThrow(
        'Undelegation (removing delegate) is not supported by Trezor'
      );
    });
  });

  describe('reveal operations', () => {
    it('should map a reveal operation', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.REVEAL,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          public_key: 'edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn',
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.reveal).toBeDefined();
      expect(result.reveal?.source).toBe('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn');
      expect(result.reveal?.public_key).toBe(
        'edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn'
      );
    });
  });

  describe('proposal operations', () => {
    it('should map a proposal operation', () => {
      const ops: OperationContents[] = [
        {
          kind: 'proposals' as any,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          period: 42,
          proposals: [
            'ProtoGenesisGenesisGenesisGenesisGenesisGenesk612im',
            'PtYuensgYBb3G3x1hLLbCmcav8ue8Kp2YzbbnTxBwn3Hbqgcct',
          ],
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.proposal).toBeDefined();
      expect(result.proposal?.source).toBe('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn');
      expect(result.proposal?.period).toBe(42);
      expect(result.proposal?.proposals).toHaveLength(2);
      expect(result.proposal?.proposals[0]).toBe(
        'ProtoGenesisGenesisGenesisGenesisGenesisGenesk612im'
      );
    });
  });

  describe('ballot operations', () => {
    it('should map a ballot operation with yay vote', () => {
      const ops: OperationContents[] = [
        {
          kind: 'ballot' as any,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          period: 42,
          proposal: 'ProtoGenesisGenesisGenesisGenesisGenesisGenesk612im',
          ballot: 'yay',
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.ballot).toBeDefined();
      expect(result.ballot?.source).toBe('tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn');
      expect(result.ballot?.period).toBe(42);
      expect(result.ballot?.proposal).toBe('ProtoGenesisGenesisGenesisGenesisGenesisGenesk612im');
      expect(result.ballot?.ballot).toBe(0); // yay = 0
    });

    it('should map a ballot operation with nay vote', () => {
      const ops: OperationContents[] = [
        {
          kind: 'ballot' as any,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          period: 42,
          proposal: 'ProtoGenesisGenesisGenesisGenesisGenesisGenesk612im',
          ballot: 'nay',
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.ballot?.ballot).toBe(1); // nay = 1
    });

    it('should map a ballot operation with pass vote', () => {
      const ops: OperationContents[] = [
        {
          kind: 'ballot' as any,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          period: 42,
          proposal: 'ProtoGenesisGenesisGenesisGenesisGenesisGenesk612im',
          ballot: 'pass',
        },
      ];

      const result = mapOperationsToTrezor(ops);

      expect(result.ballot?.ballot).toBe(2); // pass = 2
    });

    it('should throw error for invalid ballot value', () => {
      const ops: OperationContents[] = [
        {
          kind: 'ballot' as any,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          period: 42,
          proposal: 'ProtoGenesisGenesisGenesisGenesisGenesisGenesk612im',
          ballot: 'invalid' as any,
        },
      ];

      expect(() => mapOperationsToTrezor(ops)).toThrow('Invalid ballot value: invalid');
    });
  });

  describe('unsupported operations', () => {
    it('should throw error for origination operations', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.ORIGINATION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          balance: '1000000',
        },
      ];

      expect(() => mapOperationsToTrezor(ops)).toThrow(
        'Unsupported operation kind for Trezor signing: origination'
      );
    });

    it('should throw error for increase_paid_storage operations', () => {
      const ops: OperationContents[] = [
        {
          kind: 'increase_paid_storage' as any,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          amount: '1000',
          destination: 'KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn',
        },
      ];

      expect(() => mapOperationsToTrezor(ops)).toThrow(
        'Unsupported operation kind for Trezor signing'
      );
    });

    it('should throw error for duplicate operation kinds', () => {
      const ops: OperationContents[] = [
        {
          kind: OpKind.TRANSACTION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '1',
          gas_limit: '10',
          storage_limit: '10',
          amount: '1000000',
          destination: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        },
        {
          kind: OpKind.TRANSACTION,
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          counter: '2',
          gas_limit: '10',
          storage_limit: '10',
          amount: '2000000',
          destination: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
        },
      ];

      expect(() => mapOperationsToTrezor(ops)).toThrow(
        'Trezor does not support batch operations with multiple transaction operations'
      );
    });
  });
});
