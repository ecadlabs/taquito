import { BlockResponse } from '@taquito/rpc';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { TestScheduler } from 'rxjs/testing';
import { OriginationWalletOperation } from '../../src/wallet/origination-operation';
import { OriginationOperationBuilder } from '../helpers';
import { OriginationWalletOperationError } from '../../src/wallet/errors';

const createFakeBlock = (level: number, opHash?: string, contents: unknown[] = []): BlockResponse =>
  ({
    hash: `BLock_hash_${level}`,
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
      atExactBlock: jest.fn().mockResolvedValue('contract'),
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
      expect(wallet.atExactBlock).toHaveBeenCalledWith(
        'KT1UvU4PamD38HYWwG4UjgTKU2nHJ42DqVhX',
        undefined,
        'BLock_hash_200'
      );
    });
  });

  it('falls back to standard wallet lookup when the exact block read returns 404', async () => {
    const wallet = {
      atExactBlock: jest.fn(),
      at: jest.fn().mockResolvedValue('contract'),
    };

    wallet.atExactBlock.mockRejectedValue(
      new HttpResponseError('fail', STATUS_CODE.NOT_FOUND, 'err', 'test', 'https://test.com')
    );

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
        'BLock_hash_200'
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
            atExactBlock: jest.fn(),
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
