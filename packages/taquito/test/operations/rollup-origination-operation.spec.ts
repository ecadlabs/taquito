import { ForgedBytes } from '../../src/operations/types';
import { OperationContentsAndResult } from '@taquito/rpc';
import { defaultConfigConfirmation } from '../../src/context';
import { RevealOperationBuilder, RollupOriginationOperationBuilder } from '../helpers';
import { TxRollupOriginationOperation } from '../../src/operations/rollup-origination-operation';

describe('RollupOriginationOperation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = [
    {
      kind: 'tx_rollup_origination',
      source: 'tz2Np59GwL7s4NapRiPmU48Nhz65q1kxVmks',
      fee: '417',
      counter: '236200',
      gas_limit: '1521',
      storage_limit: '4000',
      tx_rollup_origination: {},
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz2Np59GwL7s4NapRiPmU48Nhz65q1kxVmks',
            change: '-417',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '417',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz2Np59GwL7s4NapRiPmU48Nhz65q1kxVmks',
              change: '-1000000',
              origin: 'block',
            },
            {
              kind: 'burned',
              category: 'storage fees',
              change: '1000000',
              origin: 'block',
            },
          ],
          consumed_gas: '1421',
          consumed_milligas: '1420108',
          originated_rollup: 'txr1WAEQXaXsM1n4R77G5BDfr8pwiFS5SEbBE',
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
  it('should contains the address of the newly created rollup given a successful result', () => {
    const op = new TxRollupOriginationOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.originatedRollup).toEqual('txr1WAEQXaXsM1n4R77G5BDfr8pwiFS5SEbBE');
  });

  it('originatedRollup is undefined given an wrong result', () => {
    const wrongResults: any[] = [
      {},
      [{ kind: 'tx_rollup_origination' }],
      [{ kind: 'tx_rollup_origination', metadata: {} }],
    ];

    wrongResults.forEach((result) => {
      const op = new TxRollupOriginationOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        '',
        fakeForgedBytes,
        result,
        fakeContext
      );
      expect(op.originatedRollup).toBeUndefined();
    });
  });

  it('should return the fee', () => {
    const op = new TxRollupOriginationOperation(
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
    const op = new TxRollupOriginationOperation(
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
    const op = new TxRollupOriginationOperation(
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
    const txBuilder = new RollupOriginationOperationBuilder();

    const op = new TxRollupOriginationOperation(
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
    const op = new TxRollupOriginationOperation(
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
    const txBuilder = new RollupOriginationOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new TxRollupOriginationOperation(
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
    const txBuilder = new RollupOriginationOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new TxRollupOriginationOperation(
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
    const txBuilder = new RollupOriginationOperationBuilder();

    const op = new TxRollupOriginationOperation(
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
