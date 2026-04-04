import { BlockResponse } from '@taquito/rpc';
import { TestScheduler } from 'rxjs/testing';
import { OriginationWalletOperation } from '../../src/wallet/origination-operation';
import { OriginationOperationBuilder } from '../helpers';
import { OriginationWalletOperationError } from '../../src/wallet/errors';

const createFakeBlock = (level: number, opHash?: string, contents: unknown[] = []): BlockResponse =>
  ({
    hash: `block_hash_${level}`,
    header: {
      level,
    },
    operations: opHash ? [[{ hash: opHash, contents }], [], [], []] : [[], [], [], []],
  }) as unknown as BlockResponse;

describe('OriginationWalletOperation', () => {
  let testScheduler: TestScheduler;

  beforeEach(() => {
    testScheduler = new TestScheduler(() => undefined);
  });

  it('resolves the originated contract at the inclusion block', async () => {
    const wallet = {
      at: jest.fn().mockResolvedValue('contract'),
    };

    testScheduler.run(async ({ cold, flush }) => {
      const operationHash = 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
      const blockObservable = cold<BlockResponse>('--a', {
        a: createFakeBlock(200, operationHash, [
          new OriginationOperationBuilder().withResult({ status: 'applied' }).build(),
        ]),
      });

      const op = new OriginationWalletOperation(
        operationHash,
        {
          wallet,
          config: {
            defaultConfirmationCount: 1,
          },
        } as any,
        blockObservable
      );

      flush();

      await expect(op.contract()).resolves.toBe('contract');
      expect(wallet.at).toHaveBeenCalledWith(
        'KT1UvU4PamD38HYWwG4UjgTKU2nHJ42DqVhX',
        undefined,
        200
      );
    });
  });

  it('throws when no contract was originated', async () => {
    testScheduler.run(async ({ cold, flush }) => {
      const operationHash = 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
      const blockObservable = cold<BlockResponse>('--a', {
        a: createFakeBlock(200, operationHash, []),
      });

      const op = new OriginationWalletOperation(
        operationHash,
        {
          wallet: {
            at: jest.fn(),
          },
          config: {
            defaultConfirmationCount: 1,
          },
        } as any,
        blockObservable
      );

      flush();

      await expect(op.contract()).rejects.toEqual(
        new OriginationWalletOperationError('No contract was originated in this operation')
      );
    });
  });
});
