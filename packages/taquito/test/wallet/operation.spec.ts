import { BlockResponse } from '@taquito/rpc';
import { rxSandbox } from 'rx-sandbox';
import { Context } from '../../src/context';
import { WalletOperation } from '../../src/wallet';
import { blockResponse } from './data';

describe('WalletOperation', () => {
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

  describe('confirmationObservable', () => {
    it('Should emit confirmation after seeing operation in block', async (done) => {
      const { cold, flush, getMessages, e, s } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new WalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
      );

      const messages = getMessages(op.confirmationObservable(1));

      flush();

      const expected = e('--(a|)', {
        a: expect.objectContaining({
          block: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
          expectedConfirmation: 1,
          currentConfirmation: 1,
          completed: true,
        }),
      });

      expect(messages).toEqual(expected);
      expect(blockObs.subscriptions).toEqual([s('^-!')]);

      done();
    });

    it('given 2 confirmation it should emit confirmation with complete false after seeing operation in a block', async (done) => {
      const { cold, flush, getMessages, e, s } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new WalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
      );

      const messages = getMessages(op.confirmationObservable(2));

      flush();

      const expected = e('--a', {
        a: expect.objectContaining({
          block: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
          expectedConfirmation: 2,
          currentConfirmation: 1,
          completed: false,
        }),
      });

      expect(messages).toEqual(expected);
      expect(blockObs.subscriptions).toEqual([s('^--')]);

      done();
    });

    it('Should emit 2 confirmation given the operation is included in the first block and a new head is applied on top', async (done) => {
      const { cold, flush, getMessages, e, s } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a--b', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
        b: createFakeBlock(2),
      });

      const op = new WalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
      );

      const messages = getMessages(op.confirmationObservable(2));

      flush();

      const expected = e('--a--(b|)', {
        a: expect.objectContaining({
          block: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
          expectedConfirmation: 2,
          currentConfirmation: 1,
          completed: false,
        }),
        b: expect.objectContaining({
          block: createFakeBlock(2),
          expectedConfirmation: 2,
          currentConfirmation: 2,
          completed: true,
        }),
      });

      expect(messages).toEqual(expected);
      expect(blockObs.subscriptions).toEqual([s('^----!')]);

      done();
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

    it('Should find operation in the missed block when 1 block was skipped', async (done) => {
      mockRpcClient.getBlock.mockResolvedValue(
        createFakeBlock(2, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj')
      );

      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a--c', {
        a: createFakeBlock(1),
        c: createFakeBlock(3),
      });

      const op = new WalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context(mockRpcClient as any),
        blockObs
      );

      flush();

      expect(await op.confirmation()).toEqual(
        expect.objectContaining({
          block: createFakeBlock(2, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
          expectedConfirmation: 1,
          currentConfirmation: 1,
          completed: true,
        })
      );

      expect(mockRpcClient.getBlock).toHaveBeenCalledTimes(1);
      expect(mockRpcClient.getBlock).toHaveBeenCalledWith({ block: '2' });

      done();
    });

    it('Should find operation in the first missed block when 2 blocks were skipped', async (done) => {
      mockRpcClient.getBlock.mockResolvedValueOnce(
        createFakeBlock(2, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj')
      );

      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a--d', {
        a: createFakeBlock(1),
        d: createFakeBlock(4),
      });

      const op = new WalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context(mockRpcClient as any),
        blockObs
      );

      flush();

      expect(await op.confirmation()).toEqual(
        expect.objectContaining({
          block: createFakeBlock(2, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
          expectedConfirmation: 1,
          currentConfirmation: 1,
          completed: true,
        })
      );

      expect(mockRpcClient.getBlock).toHaveBeenCalledTimes(1);
      expect(mockRpcClient.getBlock).toHaveBeenCalledWith({ block: '2' });

      done();
    });

    it('Should find operation in the second missed block when 2 blocks were skipped', async (done) => {
      mockRpcClient.getBlock.mockResolvedValueOnce(createFakeBlock(2));
      mockRpcClient.getBlock.mockResolvedValueOnce(
        createFakeBlock(3, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj')
      );

      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a--d', {
        a: createFakeBlock(1),
        d: createFakeBlock(4),
      });

      const op = new WalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context(mockRpcClient as any),
        blockObs
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

      done();
    });
  });

  describe('receipt', () => {
    it('should return a receipt after the operation is included in a block', async (done) => {
      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new WalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
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

      done();
    });

    it('should return a receipt from actual case values ​​after including the operation in a block', async (done) => {
      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: blockResponse as unknown as BlockResponse,
      });

      const op = new WalletOperation(
        'oot9JqetdfF5KtZS7VoepGvB18aQENcQVzJ3G7WsQnCfQo3wmms',
        new Context('url'),
        blockObs
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

      done();
    });
  });

  describe('operationResults', () => {
    it('should return operation result after the operation is included in a block', async (done) => {
      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new WalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
      );

      flush();
      const result = await op.operationResults();

      expect(result).toEqual([]);

      done();
    });
  });

  describe('getCurrentConfirmation', () => {
    it('should return 0 when operation is not included', async (done) => {
      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1),
      });

      const op = new WalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
      );

      flush();

      expect(await op.getCurrentConfirmation()).toEqual(0);

      done();
    });

    it('should return 1 when there is 1 confirmation', async (done) => {
      const { cold, flush, s } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new WalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {
          readProvider: {
            getBlock: jest.fn().mockResolvedValue(createFakeBlock(1)),
          },
        } as any,
        blockObs
      );

      flush();

      expect(blockObs.subscriptions).toEqual([s('^-!')]);
      expect(await op.getCurrentConfirmation()).toEqual(1);

      done();
    });

    it('should return 2 when there is 2 confirmation', async (done) => {
      const { cold, flush, s } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a-b', {
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
        blockObs
      );

      flush();

      expect(blockObs.subscriptions).toEqual([s('^-!')]);
      expect(await op.getCurrentConfirmation()).toEqual(2);

      done();
    });
  });
});
