import { ForgedBytes, RegisterGlobalConstantOperation } from '@taquito/taquito';
import { OperationContentsAndResult } from '@taquito/rpc';
import { defaultConfigConfirmation } from '../../src/context';
import { RegisterGlobalConstantOperationBuilder, RevealOperationBuilder } from '../helpers';

describe('RegisterGlobalConstant operation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = [
    {
      kind: 'register_global_constant',
      source: 'tz1TJGsZxvr6aBGUqfQVxufesTtA7QGi696D',
      fee: '372',
      counter: '7423375',
      gas_limit: '1330',
      storage_limit: '93',
      value: {
        prim: 'Pair',
        args: [
          {
            int: '999',
          },
          {
            int: '999',
          },
        ],
      },
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1TJGsZxvr6aBGUqfQVxufesTtA7QGi696D',
            change: '-372',
            origin: 'block',
          },
          {
            kind: 'freezer',
            category: 'fees',
            delegate: 'tz1foXHgRzdYdaLgX6XhpZGxbBv42LZ6ubvE',
            cycle: 17,
            change: '372',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz1TJGsZxvr6aBGUqfQVxufesTtA7QGi696D',
              change: '-18250',
              origin: 'block',
            },
          ],
          consumed_milligas: '1230000',
          storage_size: '73',
          global_address: 'exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2',
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
      operations: [[{ hash: 'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj' }], [], [], []],
      header: {
        level: 200,
      },
    });
  });
  it('should contains the global address of the newly registered constant given a successful result', () => {
    const op = new RegisterGlobalConstantOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.globalConstantHash).toEqual('exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2');
  });

  it('global address is undefined given an wrong result', () => {
    const wrongResults: any[] = [
      {},
      [{ kind: 'register_global_constant' }],
      [{ kind: 'register_global_constant', metadata: {} }],
    ];

    wrongResults.forEach((result) => {
      const op = new RegisterGlobalConstantOperation(
        'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
        {} as any,
        '',
        fakeForgedBytes,
        result,
        fakeContext
      );
      expect(op.globalConstantHash).toBeUndefined();
    });
  });

  it('should return the registered expression', () => {
    const op = new RegisterGlobalConstantOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      { value: { int: '0' } } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.registeredExpression).toEqual({ int: '0' });
  });

  it('should return the fee', () => {
    const op = new RegisterGlobalConstantOperation(
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
    const op = new RegisterGlobalConstantOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      { gas_limit: 450 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.gasLimit).toEqual(450);
  });

  it('should return the consumed gas', () => {
    const op = new RegisterGlobalConstantOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.consumedGas).toEqual('1230');
  });

  it('should return the consumed milligas', () => {
    const op = new RegisterGlobalConstantOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.consumedMilliGas).toEqual('1230000');
  });

  it('should return the storageLimit', () => {
    const op = new RegisterGlobalConstantOperation(
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
    const txBuilder = new RegisterGlobalConstantOperationBuilder();

    const op = new RegisterGlobalConstantOperation(
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
    const op = new RegisterGlobalConstantOperation(
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
    const txBuilder = new RegisterGlobalConstantOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new RegisterGlobalConstantOperation(
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
    const txBuilder = new RegisterGlobalConstantOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new RegisterGlobalConstantOperation(
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

  it('status should be unknown if no status', () => {
    const revealBuilder = new RevealOperationBuilder();

    const op = new RegisterGlobalConstantOperation(
      'ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj',
      {} as any,
      '',
      fakeForgedBytes,
      [revealBuilder.withResult({}).build()],
      fakeContext
    );
    expect(op.status).toEqual('unknown');
  });

  it('revealStatus should be unknown when there is no reveal operation', () => {
    const txBuilder = new RegisterGlobalConstantOperationBuilder();

    const op = new RegisterGlobalConstantOperation(
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
