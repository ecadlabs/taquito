import { BlockResponse } from '@taquito/rpc';
import { rxSandbox } from 'rx-sandbox';
import { Context } from '../../src/context';
import { BatchWalletOperation } from '../../src/wallet/batch-operation';
import {
  resultOriginations,
  resultWithoutOrigination,
  resultSingleOrigination,
} from '../data/batch-results';

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

describe('BatchWalletOperation', () => {
  it('Should emit confirmation after receiving seeing operation in block ', async (done) => {
    const { cold, flush, getMessages, e, s } = rxSandbox.create();
    const blockObs = cold<BlockResponse>('--a', {
      a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
    });

    const op = new BatchWalletOperation(
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

    const op = new BatchWalletOperation(
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

    const op = new BatchWalletOperation(
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

  describe('Receipt', () => {
    it('should return operation result after the operation is included in a block', async (done) => {
      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new BatchWalletOperation(
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

      const op = new BatchWalletOperation(
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

      const op = new BatchWalletOperation(
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

      const op = new BatchWalletOperation(
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

  describe('getOriginatedContractAddresses', () => {
    it('should be able to retrieve originated contract addresses', async (done) => {
      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new BatchWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
      );

      jest.spyOn(op, 'operationResults').mockResolvedValue(resultSingleOrigination);

      flush();
      const result = await op.operationResults();

      expect(result).toEqual(resultSingleOrigination);

      expect(await op.getOriginatedContractAddresses()).toEqual([
        'KT1Em8ALyerHtZd1s5s6quJDZrTRxnmdKcKd',
      ]);

      done();
    });

    it('should be able to retrieve multiple originated contract addresses', async (done) => {
      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new BatchWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
      );

      jest.spyOn(op, 'operationResults').mockResolvedValue(resultOriginations);

      flush();
      const result = await op.operationResults();

      expect(result).toEqual(resultOriginations);
      expect(await op.getOriginatedContractAddresses()).toEqual([
        'KT1Wr1xjQAzb44AcPRV9F9oyPurkFz7y2otC',
        'KT1SG1LfkoMoEqR5srtiYeYcciaZfBTGzTgY',
      ]);
      done();
    });

    it('should be able to handle empty undefined originated_contracts elegantly', async (done) => {
      const { cold, flush } = rxSandbox.create();
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new BatchWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
      );

      jest.spyOn(op, 'operationResults').mockResolvedValue(resultWithoutOrigination);

      flush();
      const result = await op.operationResults();

      expect(result).toEqual(resultWithoutOrigination);
      expect(await op.getOriginatedContractAddresses()).toEqual([]);
      done();
    });
  });
});
