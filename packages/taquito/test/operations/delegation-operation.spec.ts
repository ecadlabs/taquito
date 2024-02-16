/* eslint-disable @typescript-eslint/no-explicit-any */
import { defaultConfigConfirmation } from '../../src/context';
import { DelegateOperation, ForgedBytes } from '@taquito/taquito';
import { RevealOperationBuilder, DelegationOperationBuilder } from '../helpers';

describe('Delegation operation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  beforeEach(() => {
    fakeContext = {
      rpc: {
        getBlock: jest.fn(),
      },
      config: { ...defaultConfigConfirmation },
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj' }], [], [], []],
      header: {
        level: 200,
      },
    });
  });

  it('status should contains status for delegation operation only', () => {
    const txBuilder = new DelegationOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new DelegateOperation(
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

  it('status should contains status for delegation operation only', () => {
    const txBuilder = new DelegationOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new DelegateOperation(
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
    const txBuilder = new DelegationOperationBuilder();

    const op = new DelegateOperation(
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

  it('should successfully retrieve all members of DelegateOperation', () => {
    const txBuilder = new DelegationOperationBuilder();

    const op = new DelegateOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {
        delegate: 'delegate',
        fee: 2991,
        gas_limit: 26260,
        storage_limit: 257,
      } as any,
      'source',
      fakeForgedBytes,
      [txBuilder.withResult({ status: 'applied' }).build()],
      fakeContext
    );
    expect(op.revealStatus).toEqual('unknown');
    expect(op.status).toEqual('applied');
    expect(op.consumedGas).toEqual('15953');
    expect(op.consumedMilliGas).toEqual('15952999');
    expect(op.delegate).toEqual('delegate');
    expect(op.errors).toBeUndefined();
    expect(op.fee).toEqual(2991);
    expect(op.gasLimit).toEqual(26260);
    expect(op.hash).toEqual('ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj');
    expect(op.isRegisterOperation).toBeFalsy();
    expect(op.operationResults).toEqual({ consumed_milligas: '15952999', status: 'applied' });
    expect(op.revealOperation).toBeUndefined();
    expect(op.source).toEqual('source');
    expect(op.storageLimit).toEqual(257);
  });
});
