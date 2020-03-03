import { ForgedBytes } from '../../src/operations/types';
import { OperationContentsAndResult } from '@taquito/rpc';
import { BatchOperation } from '../../src/operations/batch-operation';
import { defaultConfig } from '../../src/context';

describe('Batch operation', () => {
  let fakeContext: any;
  let fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = ([
    {
      kind: 'transaction',
      source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
      fee: '1831',
      counter: '121636',
      gas_limit: '15385',
      storage_limit: '257',
      amount: '1000000',
      destination: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
      metadata: {
        balance_updates: [
          { kind: 'contract', contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys', change: '-1831' },
          {
            kind: 'freezer',
            category: 'fees',
            delegate: 'tz1VxS7ff4YnZRs8b4mMP4WaMVpoQjuo1rjf',
            cycle: 55,
            change: '1831',
          },
        ],
        operation_result: {
          status: 'applied',
          storage: { bytes: '00b2e19a9e74440d86c59f13dab8a18ff873e889ea' },
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
              change: '-1000000',
            },
            {
              kind: 'contract',
              contract: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
              change: '1000000',
            },
          ],
          consumed_gas: '15285',
          storage_size: '232',
        },
      },
    },
    {
      kind: 'transaction',
      source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
      fee: '2991',
      counter: '121637',
      gas_limit: '26260',
      storage_limit: '257',
      amount: '0',
      destination: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
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
            delegate: 'tz1VxS7ff4YnZRs8b4mMP4WaMVpoQjuo1rjf',
            cycle: 55,
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
            source: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
            nonce: 0,
            amount: '50',
            destination: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
            result: {
              status: 'applied',
              balance_updates: [
                {
                  kind: 'contract',
                  contract: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
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
    {
      kind: 'transaction',
      source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
      fee: '2947',
      counter: '121638',
      gas_limit: '25894',
      storage_limit: '257',
      amount: '0',
      destination: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
      parameters: {
        entrypoint: 'do',
        value: [
          { prim: 'DROP' },
          { prim: 'NIL', args: [{ prim: 'operation' }] },
          {
            prim: 'PUSH',
            args: [{ prim: 'key_hash' }, { string: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9' }],
          },
          { prim: 'SOME' },
          { prim: 'SET_DELEGATE' },
          { prim: 'CONS' },
        ],
      },
      metadata: {
        balance_updates: [
          { kind: 'contract', contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys', change: '-2947' },
          {
            kind: 'freezer',
            category: 'fees',
            delegate: 'tz1VxS7ff4YnZRs8b4mMP4WaMVpoQjuo1rjf',
            cycle: 55,
            change: '2947',
          },
        ],
        operation_result: {
          status: 'applied',
          storage: { bytes: '00b2e19a9e74440d86c59f13dab8a18ff873e889ea' },
          consumed_gas: '15794',
          storage_size: '232',
        },
        internal_operation_results: [
          {
            kind: 'delegation',
            source: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
            nonce: 1,
            delegate: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
            result: { status: 'applied', consumed_gas: '10000' },
          },
        ],
      },
    },
    {
      kind: 'transaction',
      source: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys',
      fee: '2897',
      counter: '121639',
      gas_limit: '25822',
      storage_limit: '257',
      amount: '0',
      destination: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
      parameters: {
        entrypoint: 'do',
        value: [
          { prim: 'DROP' },
          { prim: 'NIL', args: [{ prim: 'operation' }] },
          { prim: 'NONE', args: [{ prim: 'key_hash' }] },
          { prim: 'SET_DELEGATE' },
          { prim: 'CONS' },
        ],
      },
      metadata: {
        balance_updates: [
          { kind: 'contract', contract: 'tz1bwsEWCwSEXdRvnJxvegQZKeX5dj6oKEys', change: '-2897' },
          {
            kind: 'freezer',
            category: 'fees',
            delegate: 'tz1VxS7ff4YnZRs8b4mMP4WaMVpoQjuo1rjf',
            cycle: 55,
            change: '2897',
          },
        ],
        operation_result: {
          status: 'applied',
          storage: { bytes: '00b2e19a9e74440d86c59f13dab8a18ff873e889ea' },
          consumed_gas: '15722',
          storage_size: '232',
        },
        internal_operation_results: [
          {
            kind: 'delegation',
            source: 'KT1UMZuZRzgS9iZGC2LTQad6PHPaF3fmSo4p',
            nonce: 2,
            result: { status: 'applied', consumed_gas: '10000' },
          },
        ],
      },
    },
  ] as unknown) as OperationContentsAndResult[];

  beforeEach(() => {
    fakeContext = {
      rpc: {
        getBlock: jest.fn(),
      },
      config: { ...defaultConfig },
    };

    fakeContext.rpc.getBlock.mockResolvedValue({
      operations: [[{ hash: 'test_hash' }], [], [], []],
      header: {
        level: 200,
      },
    });
  });
  it('should contains compute the consummed gas, storage diff and storage size properly', () => {
    const op = new BatchOperation(
      'test_hash',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.storageDiff).toEqual('0');
    expect(op.consumedGas).toEqual(String(15285 + 15953 + 10207 + 15794 + 10000 + 15722 + 10000));
  });
});
