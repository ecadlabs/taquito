import { DrainDelegateOperation } from '../../src/operations';
import {
  OperationContentsAndResult,
  OpKind,
  OperationContentsAndResultDrainDelegate,
} from '@taquito/rpc';
import { ForgedBytes } from '../../src/operations/types';
import { defaultConfigConfirmation } from '../../src/context';

describe('DrainDelegate operation', () => {
  let fakeContext: any;

  const fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = [
    {
      kind: 'drain_delegate',
      consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
      delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
      destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
            change: '-15525772494',
            origin: 'block',
          },
          {
            kind: 'contract',
            contract: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
            change: '15525772494',
            origin: 'block',
          },
          {
            kind: 'contract',
            contract: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
            change: '-156825984',
            origin: 'block',
          },
          {
            kind: 'contract',
            contract: 'tz1hoyMUiJYYr4FRPMU8Z7WJzYkqgjygjaTy',
            change: '156825984',
            origin: 'block',
          },
        ],
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
      operations: [[{ hash: 'oo7gLAnWgTe7XtoYjgnkNBXDDvUy2e1DVcVwtvALxajx6KRzkXb' }], [], [], []],
      header: {
        level: 1,
      },
    });
  });

  it('should return OperationMetadataBalanceUpdates of DrainDelegate operation', () => {
    const op = new DrainDelegateOperation(
      'oo7gLAnWgTe7XtoYjgnkNBXDDvUy2e1DVcVwtvALxajx6KRzkXb',
      {
        kind: OpKind.DRAIN_DELEGATE,
        consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
        delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
        destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
      },
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.operationResults).toEqual(
      (successfulResult[0] as OperationContentsAndResultDrainDelegate).metadata.balance_updates
    );
  });

  it('should return consensusKey of DrainDelegate operation', () => {
    const op = new DrainDelegateOperation(
      'oo7gLAnWgTe7XtoYjgnkNBXDDvUy2e1DVcVwtvALxajx6KRzkXb',
      {
        kind: OpKind.DRAIN_DELEGATE,
        consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
        delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
        destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
      },
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.consensusKey).toEqual('tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj');
  });

  it('should return delegate of DrainDelegate operation', () => {
    const op = new DrainDelegateOperation(
      'oo7gLAnWgTe7XtoYjgnkNBXDDvUy2e1DVcVwtvALxajx6KRzkXb',
      {
        kind: OpKind.DRAIN_DELEGATE,
        consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
        delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
        destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
      },
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.delegate).toEqual('tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv');
  });

  it('should return destination of DrainDelegate operation', () => {
    const op = new DrainDelegateOperation(
      'oo7gLAnWgTe7XtoYjgnkNBXDDvUy2e1DVcVwtvALxajx6KRzkXb',
      {
        kind: OpKind.DRAIN_DELEGATE,
        consensus_key: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
        delegate: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
        destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
      },
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.destination).toEqual('tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj');
  });
});
