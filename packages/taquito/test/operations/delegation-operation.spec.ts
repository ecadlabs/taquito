import { defaultConfigConfirmation, defaultConfigStreamer } from '../../src/context';
import { DelegateOperation } from '../../src/operations/delegate-operation';
import { ForgedBytes } from '../../src/operations/types';
import { RevealOperationBuilder, DelegationOperationBuilder } from '../helpers';

describe('Delegation operation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  beforeEach(() => {
    fakeContext = {
      rpc: {
        getBlock: jest.fn(),
      },
      config: { ...defaultConfigConfirmation, ...defaultConfigStreamer },
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'test_hash' }], [], [], []],
      header: {
        level: 200,
      },
    });
  });

  it('status should contains status for delegation operation only', () => {
    const txBuilder = new DelegationOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new DelegateOperation(
      'test_hash',
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
      'test_hash',
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
      'test_hash',
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
