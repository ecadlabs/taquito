import { TestScheduler } from 'rxjs/testing';
import { BlockResponse } from '@taquito/rpc';
import { Context } from '../../src/context';
import { WalletOperation } from '../../src/wallet';
import { blockResponse } from './data';

describe('WalletOperation', () => {
  let testScheduler: TestScheduler;

  const toJSON = (x: any) => JSON.parse(JSON.stringify(x));
  const createFakeBlock = (level: number, opHash?: string) => {
    const op = {
      hash: `block_hash_${level}`,
      header: {
        level: level,
      },
      operations: [],
    } as unknown as BlockResponse;

    if (opHash) {
      op.operations.push([{ hash: opHash, contents: [] }] as any);
    }
    return op;
  };

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual[0]).toMatchObject(expected[0]);
    });
  });

  describe('confirmationObservable', () => {
    it('should emit confirmation after seeing operation in block', async () => {
      testScheduler.run((helpers) => {
        const { cold, flush, expectObservable } = helpers;
        const blockObservable = cold<BlockResponse>('--a', {
          a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          new Context('url'),
          blockObservable
        );

        const confirmation = op.confirmationObservable(1);
        flush();

        expectObservable(confirmation).toBe('----a', {
          a: {
            block: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
            expectedConfirmation: 1,
            currentConfirmation: 1,
            completed: true,
          },
        });
      });
    });

    it('should emit a false completed confirmation when given 2 confirmation', async () => {
      testScheduler.run((helpers) => {
        const { cold, flush, expectObservable } = helpers;
        const blockObservable = cold<BlockResponse>('--a', {
          a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          new Context('url'),
          blockObservable
        );

        const confirmation = op.confirmationObservable(2);
        flush();

        expectObservable(confirmation).toBe('----a', {
          a: {
            block: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
            expectedConfirmation: 2,
            currentConfirmation: 1,
            completed: false,
          },
        });
      });
    });

    it('should emit 2 confirmations given that operation is included in the first block and a new head is applied on top', async () => {
      testScheduler = new TestScheduler((actual, expected) => {
        // TODO: expectObservable() only receives the last value of the observable, investigate why
        expect(actual[1]).toMatchObject(expected[1]);
      });

      testScheduler.run((helpers) => {
        const { cold, flush, expectObservable } = helpers;
        const blockObservable = cold<BlockResponse>('--a--b', {
          a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
          b: createFakeBlock(2),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          new Context('url'),
          blockObservable
        );

        const confirmation = op.confirmationObservable(2);
        flush();

        expectObservable(confirmation).toBe('----a--(b|)', {
          a: {
            block: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
            expectedConfirmation: 2,
            currentConfirmation: 1,
            completed: false,
          },
          b: {
            block: createFakeBlock(2),
            expectedConfirmation: 2,
            currentConfirmation: 2,
            completed: true,
          },
        });
      });
    });
  });

  describe('confirmation handles skipped blocks', () => {
    let mockRpcClient: {
      getBlock: jest.Mock<any, any>;
    };

    beforeEach(() => {
      mockRpcClient = {
        getBlock: jest.fn(),
      };
    });

    it('should find operation in the missed block when 1 block was skipped', async () => {
      mockRpcClient.getBlock.mockResolvedValueOnce(
        createFakeBlock(2, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj')
      );

      testScheduler.run(async (helpers) => {
        const { cold, flush } = helpers;
        const blockObservable = cold<BlockResponse>('--a--c', {
          a: createFakeBlock(1),
          c: createFakeBlock(3),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          new Context(mockRpcClient as any),
          blockObservable
        );

        const confirmation = await op.confirmation();
        flush();

        expect(confirmation).toEqual(
          expect.objectContaining({
            block: createFakeBlock(2, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
            expectedConfirmation: 1,
            currentConfirmation: 1,
            completed: true,
          })
        );

        expect(mockRpcClient.getBlock).toHaveBeenCalledTimes(1);
        expect(mockRpcClient.getBlock).toHaveBeenCalledWith({ block: '2' });
      });
    });

    it('should find operation in the first missed block when 2 blocks were skipped', async () => {
      mockRpcClient.getBlock.mockResolvedValueOnce(
        createFakeBlock(2, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj')
      );

      testScheduler.run(async (helpers) => {
        const { cold, flush } = helpers;
        const blockObservable = cold<BlockResponse>('--a--d', {
          a: createFakeBlock(1),
          d: createFakeBlock(4),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          new Context(mockRpcClient as any),
          blockObservable
        );

        const confirmation = await op.confirmation();
        flush();

        expect(confirmation).toEqual(
          expect.objectContaining({
            block: createFakeBlock(2, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
            expectedConfirmation: 1,
            currentConfirmation: 1,
            completed: true,
          })
        );
      });

      expect(mockRpcClient.getBlock).toHaveBeenCalledTimes(1);
      expect(mockRpcClient.getBlock).toHaveBeenCalledWith({ block: '2' });
    });

    it('should find operation in the second missed block when 2 blocks were skipped', async () => {
      mockRpcClient.getBlock.mockResolvedValueOnce(createFakeBlock(2));
      mockRpcClient.getBlock.mockResolvedValueOnce(
        createFakeBlock(3, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj')
      );

      testScheduler.run(async (helpers) => {
        const { cold, flush } = helpers;
        const blockObservable = cold<BlockResponse>('--a--d', {
          a: createFakeBlock(1),
          d: createFakeBlock(4),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          new Context(mockRpcClient as any),
          blockObservable
        );

        flush();

        expect(await op.confirmation()).toEqual(
          expect.objectContaining({
            block: createFakeBlock(3, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
            expectedConfirmation: 1,
            currentConfirmation: 1,
            completed: true,
          })
        );

        expect(mockRpcClient.getBlock).toHaveBeenCalledTimes(2);
        expect(mockRpcClient.getBlock).toHaveBeenCalledWith({ block: '2' });
        expect(mockRpcClient.getBlock).toHaveBeenLastCalledWith({ block: '3' });
      });
    });
  });

  describe('receipt', () => {
    it('should return a receipt after the operation is included in block', async () => {
      testScheduler.run(async (helpers) => {
        const { cold, flush } = helpers;

        const blockObservable = cold<BlockResponse>('--a', {
          a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          new Context('url'),
          blockObservable
        );

        flush();
        const receipt = await op.receipt();

        expect(toJSON(receipt)).toEqual({
          totalAllocationBurn: '0',
          totalFee: '0',
          totalGas: '0',
          totalMilliGas: '0',
          totalOriginationBurn: '0',
          totalPaidStorageDiff: '0',
          totalStorage: '0',
          totalStorageBurn: '0',
        });
      });
    });

    it('should return a receipt from actual case values after including the operation in a block', async () => {
      testScheduler.run(async (helpers) => {
        const { cold, flush } = helpers;

        const blockObservable = cold<BlockResponse>('--a', {
          a: blockResponse as unknown as BlockResponse,
        });

        const op = new WalletOperation(
          'oot9JqetdfF5KtZS7VoepGvB18aQENcQVzJ3G7WsQnCfQo3wmms',
          new Context('url'),
          blockObservable
        );

        flush();
        const receipt = await op.receipt();

        expect(toJSON(receipt)).toEqual({
          totalFee: '6317',
          totalGas: '4056',
          totalMilliGas: '4055338',
          totalOriginationBurn: '257',
          totalPaidStorageDiff: '5334',
          totalStorage: '5591',
          totalStorageBurn: '1397750',
          totalAllocationBurn: '0',
        });
      });
    });
  });

  describe('operationResults', () => {
    it('should return operation result after the operation is included in a block', async () => {
      testScheduler.run(async (helpers) => {
        const { cold, flush } = helpers;
        const blockObservable = cold<BlockResponse>('--a', {
          a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          new Context('url'),
          blockObservable
        );

        flush();
        const result = await op.operationResults();

        expect(result).toEqual([]);
      });
    });
  });

  describe('getCurrentConfirmation', () => {
    it('should return 0 when operation is not included', async () => {
      testScheduler.run(async (helpers) => {
        const { cold, flush } = helpers;
        const blockObservable = cold<BlockResponse>('--a', {
          a: createFakeBlock(1),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          new Context('url'),
          blockObservable
        );

        flush();
        expect(await op.getCurrentConfirmation()).toEqual(0);
      });
    });

    it('should return 1 when there is 1 confirmation', async () => {
      testScheduler.run(async (helpers) => {
        const { cold, flush } = helpers;
        const blockObservable = cold<BlockResponse>('--a', {
          a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          {
            readProvider: {
              getBlock: jest.fn().mockResolvedValue(createFakeBlock(1)),
            },
          } as any,
          blockObservable
        );
        flush();

        expect(await op.getCurrentConfirmation()).toEqual(1);
      });
    });

    it('should return 2 when there is 2 confirmation', async () => {
      testScheduler.run(async (helpers) => {
        const { cold, flush } = helpers;
        const blockObservable = cold<BlockResponse>('--a', {
          a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
          b: createFakeBlock(2),
        });

        const op = new WalletOperation(
          'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
          {
            readProvider: {
              getBlock: jest.fn().mockResolvedValue(createFakeBlock(2)),
            },
          } as any,
          blockObservable
        );

        flush();
        expect(await op.getCurrentConfirmation()).toEqual(2);
      });
    });
  });
});
