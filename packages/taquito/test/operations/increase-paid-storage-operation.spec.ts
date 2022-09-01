import { ForgedBytes } from '../../src/operations/types';
import { OperationContentsAndResult } from '@taquito/rpc';
import { IncreasePaidStorageOperation } from '../../src/operations/increase-paid-storage-operation';
import { defaultConfigConfirmation } from '../../src/context';
import { IncreasePaidStorageOperationBuilder } from '../helpers';

describe('IncreasePaidStorage operation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = [
    {
      kind: 'increase_paid_storage',
      source: 'tz2RVendfy3AQGEBwrhXF4kwyRiJUpa7qLnG',
      fee: '349',
      counter: '108123',
      gas_limit: '1000',
      storage_limit: '0',
      amount: '2',
      destination: 'KT1Vjr5PFC2Qm5XbSQZ8MdFZLgYMzwG5WZNh',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz2RVendfy3AQGEBwrhXF4kwyRiJUpa7qLnG',
            change: '-349',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '349',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz2RVendfy3AQGEBwrhXF4kwyRiJUpa7qLnG',
              change: '-500',
              origin: 'block',
            },
            {
              kind: 'burned',
              category: 'storage fees',
              change: '500',
              origin: 'block',
            },
          ],
          consumed_milligas: '1000000',
        },
      },
    },
  ] as OperationContentsAndResult[];

  beforeEach(() => {
    fakeContext = {
      rpc: {
        getBlock: jest.fn(),
      },
      config: { ...defaultConfigConfirmation },
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE' }], [], [], []],
      header: {
        level: 1,
      },
    });
  });

  it('should return status of IncreasePaidStorage operation', () => {
    const op = new IncreasePaidStorageOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.status).toEqual('applied');
  });

  it('should return the consumedMilligas', () => {
    const op = new IncreasePaidStorageOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.consumedMilliGas).toEqual('1000000');
  });

  it('should return the fee', () => {
    const op = new IncreasePaidStorageOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      { fee: 400 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.fee).toEqual(400);
  });

  it('should return the error if there is one', () => {
    const tx = new IncreasePaidStorageOperationBuilder();
    const op = new IncreasePaidStorageOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      {} as any,
      '',
      fakeForgedBytes,
      [
        tx
          .withResult({
            status: 'backtracked',
            errors: [{ kind: 'temporary', id: 'proto.014-PtKathma.tez.subtraction_underflow' }],
          })
          .build(),
      ],
      fakeContext
    );

    expect(op.errors).toBeDefined();
    expect(op.errors?.[0]).toEqual({
      kind: 'temporary',
      id: 'proto.014-PtKathma.tez.subtraction_underflow',
    });
  });

  it('should return the gasLimit', () => {
    const op = new IncreasePaidStorageOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      { gas_limit: 450 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.gasLimit).toEqual(450);
  });

  it('should return the storageLimit', () => {
    const op = new IncreasePaidStorageOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      { storage_limit: 450 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.storageLimit).toEqual(450);
  });

  it('error property should be undefined when no error occurs', () => {
    const op = new IncreasePaidStorageOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.errors).toBeUndefined();
  });

  it('should return amount of increased bytes', () => {
    const op = new IncreasePaidStorageOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      { amount: 1 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.amount).toEqual(1);
  });

  it('should return destination', () => {
    const op = new IncreasePaidStorageOperation(
      'ooBghN2ok5EpgEuMqYWqvfwNLBiK9eNFoPai91iwqk2nRCyUKgE',
      { destination: 'testDestination' } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.destination).toEqual('testDestination');
  });
});
