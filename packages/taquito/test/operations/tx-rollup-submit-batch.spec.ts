import { ForgedBytes } from '../../src/operations/types';
import { OperationContentsAndResult } from '@taquito/rpc';
import { defaultConfigConfirmation } from '../../src/context';
import { RevealOperationBuilder, TxRollupSubmitBatchOperationBuilder } from '../helpers';
import { TxRollupBatchOperation } from '../../src/operations/tx-rollup-batch-operation';

describe('TxRollupBatchOperation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = [
    {
      kind: 'tx_rollup_submit_batch',
      source: 'tz2MRqRjuMz7i7GjFcwTGE3HF3cbh9sQavXX',
      fee: '580',
      counter: '249650',
      gas_limit: '2869',
      storage_limit: '0',
      rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
      content: '626c6f62',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz2MRqRjuMz7i7GjFcwTGE3HF3cbh9sQavXX',
            change: '-580',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '580',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [],
          consumed_gas: '2769',
          consumed_milligas: '2768514',
          paid_storage_size_diff: '0',
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
      operations: [[{ hash: 'oo51jb7sEvPkf7BaTSUW49QztcxgxufLVEj2PUfQ2uw6m61CKLc' }], [], [], []],
      header: {
        level: 185827,
      },
    });
  });

  it('should return the batch content', () => {
    const op = new TxRollupBatchOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      { content: '626c6f62' } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.content).toEqual('626c6f62');
  });

  it('should return the fee', () => {
    const op = new TxRollupBatchOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      { fee: 450 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.fee).toEqual(450);
  });

  it('should return the gasLimit', () => {
    const op = new TxRollupBatchOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      { gas_limit: 450 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.gasLimit).toEqual(450);
  });
  it('should return the storageLimit', () => {
    const op = new TxRollupBatchOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      { storage_limit: 450 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.storageLimit).toEqual(450);
  });

  it('should return the error if there is one', () => {
    const txBuilder = new TxRollupSubmitBatchOperationBuilder();

    const op = new TxRollupBatchOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      [
        txBuilder
          .withResult({
            status: 'backtracked',
            errors: [{ kind: 'temporary', id: 'proto.011-PtHangzH.storage_exhausted.operation' }],
          })
          .build(),
      ],
      fakeContext
    );
    expect(op.errors).toBeDefined();
    expect(op.errors?.[0]).toEqual({
      kind: 'temporary',
      id: 'proto.011-PtHangzH.storage_exhausted.operation',
    });
  });

  it('error should be undefined when no error', () => {
    const op = new TxRollupBatchOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.errors).toBeUndefined();
  });

  it('status should contains status for RegisterGlobalConstant operation only', () => {
    const txBuilder = new TxRollupSubmitBatchOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new TxRollupBatchOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      [
        revealBuilder.withResult({ status: 'applied' }).build(),
        txBuilder.withResult({ status: 'backtracked' }).build(),
      ],
      fakeContext
    );
    expect(op.revealStatus).toEqual('applied');
    expect(op.status).toEqual('backtracked');
  });

  it('status should contains status for RegisterGlobalConstant operation only', () => {
    const txBuilder = new TxRollupSubmitBatchOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new TxRollupBatchOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      [
        txBuilder.withResult({ status: 'backtracked' }).build(),
        revealBuilder.withResult({ status: 'applied' }).build(),
      ],
      fakeContext
    );
    expect(op.revealStatus).toEqual('applied');
    expect(op.status).toEqual('backtracked');
  });

  it('revealStatus should be unknown when there is no reveal operation', () => {
    const txBuilder = new TxRollupSubmitBatchOperationBuilder();

    const op = new TxRollupBatchOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      [txBuilder.withResult({ status: 'backtracked' }).build()],
      fakeContext
    );
    expect(op.revealStatus).toEqual('unknown');
    expect(op.status).toEqual('backtracked');
  });
});
