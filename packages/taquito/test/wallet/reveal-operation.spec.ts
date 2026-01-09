import { TestScheduler } from 'rxjs/testing';
import { BlockResponse, OperationContentsAndResultReveal, OpKind } from '@taquito/rpc';
import { RevealWalletOperation } from '../../src/wallet/reveal-operation';

describe('RevealWalletOperation', () => {
  let testScheduler: TestScheduler;
  let fakeContext: any;

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

  const successfulResult: OperationContentsAndResultReveal = {
    kind: OpKind.REVEAL,
    source: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
    fee: '374',
    counter: '1',
    gas_limit: '1100',
    storage_limit: '0',
    public_key: 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t',
    metadata: {
      balance_updates: [],
      operation_result: {
        status: 'applied',
        consumed_milligas: '1000000',
      },
    },
  };

  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual[0]).toMatchObject(expected[0]);
    });

    fakeContext = {
      rpc: {
        getBlock: jest.fn(),
      },
      config: { confirmationPollingIntervalSecond: 10 },
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj' }], [], [], []],
      header: {
        level: 200,
      },
    });
  });

  it('should return the reveal operation result', async () => {
    testScheduler.run(async (helpers) => {
      const { cold, flush } = helpers;
      const blockObservable = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new RevealWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        fakeContext,
        blockObservable
      );

      jest.spyOn(op, 'operationResults').mockResolvedValue([successfulResult]);

      flush();
      const revealOp = await op.revealOperation();

      expect(revealOp).toBeDefined();
      expect(revealOp?.kind).toBe(OpKind.REVEAL);
      expect(revealOp?.public_key).toBe('edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t');
    });
  });

  it('should return applied status when operation is successful', async () => {
    testScheduler.run(async (helpers) => {
      const { cold, flush } = helpers;
      const blockObservable = cold<BlockResponse>('--a', {
        a: createFakeBlock(1, 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj'),
      });

      const op = new RevealWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        fakeContext,
        blockObservable
      );

      jest.spyOn(op, 'revealOperation').mockResolvedValue(successfulResult);

      flush();
      const status = await op.status();

      expect(status).toBe('applied');
    });
  });

  it('should return pending status when operation is not included', async () => {
    testScheduler.run(async (helpers) => {
      const { cold, flush } = helpers;
      const blockObservable = cold<BlockResponse>('--a', {
        a: createFakeBlock(1),
      });

      const op = new RevealWalletOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        fakeContext,
        blockObservable
      );

      flush();
      const status = await op.status();

      expect(status).toBe('pending');
    });
  });
});
