import { ForgedBytes } from '../../src/operations/types';
import { OperationContentsAndResult } from '@taquito/rpc';
import { TransactionOperation } from '../../src/operations/transaction-operation';
import { defaultConfigConfirmation, defaultConfigStreamer } from '../../src/context';
import { TransferOperationBuilder, RevealOperationBuilder } from '../helpers';

describe('Transfer operation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = [
    {
      kind: 'transaction',
      source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
      fee: '2991',
      counter: '121619',
      gas_limit: '26260',
      storage_limit: '257',
      amount: '0',
      destination: 'KT1AiWmfuCGSttuMBKbDUqZG6SzKQNrySFei',
      parameters: {
        entrypoint: 'do',
        value: [
          { prim: 'DROP' },
          { prim: 'NIL', args: [{ prim: 'operation' }] },
          {
            prim: 'PUSH',
            args: [{ prim: 'key_hash' }, { string: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh' }],
          },
          { prim: 'IMPLICIT_ACCOUNT' },
          { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '50' }] },
          { prim: 'UNIT' },
          { prim: 'TRANSFER_TOKENS' },
          { prim: 'CONS' },
        ],
      },
      metadata: {
        balance_updates: [
          { kind: 'contract', contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys', change: '-2991' },
          {
            kind: 'freezer',
            category: 'fees',
            delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
            cycle: 54,
            change: '2991',
          },
        ],
        operation_result: {
          status: 'applied',
          storage: { bytes: '00b2e19a9e74440d86c59f13dab8a18ff873e889ea' },
          consumed_gas: '15953',
          storage_size: '232',
        },
        internal_operation_results: [
          {
            kind: 'transaction',
            source: 'KT1AiWmfuCGSttuMBKbDUqZG6SzKQNrySFei',
            nonce: 0,
            amount: '50',
            destination: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
            result: {
              status: 'applied',
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'KT1AiWmfuCGSttuMBKbDUqZG6SzKQNrySFei',
                  change: '-50',
                },
                {
                  kind: 'contract',
                  contract: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
                  change: '50',
                },
              ],
              consumed_gas: '10207',
            },
          },
        ],
      },
    },
  ] as unknown as OperationContentsAndResult[];

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
  it('should contains compute the consummed gas, storage diff and storage size properly', () => {
    const op = new TransactionOperation(
      'test_hash',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.storageDiff).toEqual('0');
    expect(op.storageSize).toEqual(String(232));
    expect(op.consumedGas).toEqual(String(15953 + 10207));
  });

  it('status should contains status for transaction operation only', () => {
    const txBuilder = new TransferOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new TransactionOperation(
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

  it('status should contains status for transaction operation only', () => {
    const txBuilder = new TransferOperationBuilder();
    const revealBuilder = new RevealOperationBuilder();

    const op = new TransactionOperation(
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
    const txBuilder = new TransferOperationBuilder();

    const op = new TransactionOperation(
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
