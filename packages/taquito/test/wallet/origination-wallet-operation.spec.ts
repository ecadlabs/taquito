import { BlockResponse } from '@taquito/rpc';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { Subject } from 'rxjs';
import { OriginationWalletOperation } from '../../src/wallet/origination-operation';
import { OriginationOperationBuilder } from '../helpers';
import { OriginationWalletOperationError } from '../../src/wallet/errors';

const createFakeBlock = (level: number, opHash?: string, contents: unknown[] = []): BlockResponse =>
  ({
    hash: 'BMEdgRZbJJqUrtByoA5Jyuvy8mzp8mefbcrno82nQCAEbBCUhog',
    header: {
      level,
    },
    operations: opHash ? [[{ hash: opHash, contents }], [], [], []] : [[], [], [], []],
  }) as unknown as BlockResponse;

describe('OriginationWalletOperation', () => {
  it('resolves the originated contract at the inclusion block', async () => {
    const wallet = {
      atExactBlock: vi.fn().mockResolvedValue('contract'),
    };
    const operationHash = 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
    const blockObservable = new Subject<BlockResponse>();
    const includedBlock = createFakeBlock(200, operationHash, [
      new OriginationOperationBuilder().withResult({ status: 'applied' }).build(),
    ]);

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

    const originationPromise = op.originationOperation();

    blockObservable.next(includedBlock);

    await expect(originationPromise).resolves.toMatchObject({
      metadata: {
        operation_result: {
          originated_contracts: ['KT1UvU4PamD38HYWwG4UjgTKU2nHJ42DqVhX'],
        },
      },
    });

    const confirmationSpy = vi.spyOn(op, 'confirmation');
    const contractPromise = op.contract();

    await vi.waitFor(() => {
      expect(confirmationSpy).toHaveBeenCalledTimes(1);
    });
    blockObservable.next(createFakeBlock(201));

    await expect(contractPromise).resolves.toBe('contract');
    expect(wallet.atExactBlock).toHaveBeenCalledWith(
      'KT1UvU4PamD38HYWwG4UjgTKU2nHJ42DqVhX',
      undefined,
      'BMEdgRZbJJqUrtByoA5Jyuvy8mzp8mefbcrno82nQCAEbBCUhog'
    );
  });

  it('falls back to standard wallet lookup when the exact block read returns 404', async () => {
    const wallet = {
      atExactBlock: vi.fn(),
      at: vi.fn().mockResolvedValue('contract'),
    };
    const operationHash = 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
    const blockObservable = new Subject<BlockResponse>();

    wallet.atExactBlock.mockRejectedValue(
      new HttpResponseError('fail', STATUS_CODE.NOT_FOUND, 'err', 'test', 'https://test.com')
    );

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

    const originationPromise = op.originationOperation();

    blockObservable.next(
      createFakeBlock(200, operationHash, [
        new OriginationOperationBuilder().withResult({ status: 'applied' }).build(),
      ])
    );

    await expect(originationPromise).resolves.toMatchObject({
      metadata: {
        operation_result: {
          originated_contracts: ['KT1UvU4PamD38HYWwG4UjgTKU2nHJ42DqVhX'],
        },
      },
    });

    const confirmationSpy = vi.spyOn(op, 'confirmation');
    const contractPromise = op.contract();

    await vi.waitFor(() => {
      expect(confirmationSpy).toHaveBeenCalledTimes(1);
    });
    blockObservable.next(createFakeBlock(201));

    await expect(contractPromise).resolves.toBe('contract');
    expect(wallet.atExactBlock).toHaveBeenCalledTimes(1);
    expect(wallet.at).toHaveBeenCalledWith(
      'KT1UvU4PamD38HYWwG4UjgTKU2nHJ42DqVhX',
      undefined,
      'BMEdgRZbJJqUrtByoA5Jyuvy8mzp8mefbcrno82nQCAEbBCUhog'
    );
  });

  it('throws when no contract was originated', async () => {
    const operationHash = 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
    const blockObservable = new Subject<BlockResponse>();

    const op = new OriginationWalletOperation(
      operationHash,
      {
        wallet: {
          atExactBlock: vi.fn(),
        },
        config: {
          defaultConfirmationCount: 1,
        },
      } as any,
      blockObservable
    );

    const contractPromise = op.contract();

    blockObservable.next(createFakeBlock(200, operationHash, []));

    await expect(contractPromise).rejects.toEqual(
      new OriginationWalletOperationError('No contract was originated in this operation')
    );
  });
});
