import { ForgedBytes } from '../../src/operations/types';
import { OperationContentsAndResult } from '@taquito/rpc';
import { IncreasePaidStorageOperation } from '../../src/operations/increase-paid-storage-operation';
import { defaultConfigConfirmation } from '../../src/context';

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

    console.log('operation: ', op);
    expect(op.status).toEqual('applied');
  });
});
