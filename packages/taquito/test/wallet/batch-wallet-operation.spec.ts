import { BlockResponse } from '@taquito/rpc';
import { TestScheduler } from 'rxjs/testing';
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
  let testScheduler: TestScheduler;
  // TODO: investigate how expectSubscription() works

  it('should emit confirmation after receiving seeing operation in block ', async () => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual[0]).toMatchObject(expected[0]);
    });

    testScheduler.run(({ cold, flush, expectObservable }) => {
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new BatchWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
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

  it('should emit complete false confirmation when given 2 confirmations', async () => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual[0]).toMatchObject(expected[0]);
    });

    testScheduler.run(({ cold, flush, expectObservable }) => {
      const blockObs = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new BatchWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
      );

      const messages = op.confirmationObservable(2);

      flush();

      expectObservable(messages).toBe('----a', {
        a: {
          block: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
          expectedConfirmation: 2,
          currentConfirmation: 1,
          completed: false,
        },
      });
    });
  });

  it('should emit 2 confirmations given the operation is included in the 1st block and a new head is applied on top', async () => {
    testScheduler = new TestScheduler((actual, expected) => {
      // TODO: expectObservable() only receives the last value of the observable, investigate why
      expect(actual[1]).toMatchObject(expected[1]);
    });

    testScheduler.run(({ cold, flush, expectObservable }) => {
      const blockObs = cold<BlockResponse>('--a--b', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
        b: createFakeBlock(2),
      });

      const op = new BatchWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        new Context('url'),
        blockObs
      );

      const messages = op.confirmationObservable(2);

      flush();

      expectObservable(messages).toBe('----a--b', {
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

  describe('Receipt', () => {
    it('should return operation result after the operation is included in a block', async () => {
      testScheduler.run(async ({ cold, flush }) => {
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
      });
    });
  });

  describe('getCurrentConfirmation', () => {
    it('should return 0 when operation is not included', async () => {
      testScheduler.run(async ({ cold, flush }) => {
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
      });
    });

    it('should return 1 when there is 1 confirmation', async () => {
      testScheduler.run(async ({ cold, flush }) => {
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
        expect(await op.getCurrentConfirmation()).toEqual(1);
      });
    });

    it('should return 2 when there is 2 confirmation', async () => {
      testScheduler.run(async ({ cold, flush }) => {
        const blockObs = cold<BlockResponse>('--a--b', {
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
        expect(await op.getCurrentConfirmation()).toEqual(2);
      });
    });
  });

  describe('getOriginatedContractAddresses', () => {
    it('should be able to retrieve originated contract addresses', async () => {
      testScheduler.run(async ({ cold, flush }) => {
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
      });
    });

    it('should be able to retrieve multiple originated contract addresses', async () => {
      testScheduler.run(async ({ cold, flush }) => {
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
      });
    });

    it('should be able to handle empty undefined originated_contracts elegantly', async () => {
      testScheduler.run(async ({ cold, flush }) => {
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
      });
    });
  });
});
