import { ForgedBytes, UpdateConsensusKeyOperation } from '@taquito/taquito';
import { OperationContentsAndResult } from '@taquito/rpc';
import { defaultConfigConfirmation } from '../../src/context';
import { UpdateConsensusKeyOperationBuilder } from '../helpers';

describe('Update Consensus Key operation', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  const successfulResult = [
    {
      kind: 'update_consensus_key',
      source: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
      fee: '369',
      counter: '19043',
      gas_limit: '1100',
      storage_limit: '0',
      pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
            change: '-369',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: 'block fees',
            change: '369',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          consumed_milligas: '1000000',
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
      operations: [[{ hash: 'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh' }], [], [], []],
      header: {
        level: 200,
      },
    });
  });

  it('should return status of update consensus operation', () => {
    const op = new UpdateConsensusKeyOperation(
      'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.status).toEqual('applied');
  });

  it('should return source of update consensus operation', () => {
    const op = new UpdateConsensusKeyOperation(
      'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh',
      {} as any,
      'tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.source).toEqual('tz1MY8g5UqVmQtpAp7qs1cUwEof1GjZCHgVv');
  });

  it('should return fee of update consensus operation', () => {
    const op = new UpdateConsensusKeyOperation(
      'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh',
      { fee: 500 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.fee).toEqual(500);
  });

  it('should return consumedMilligas of update consensus operation', () => {
    const op = new UpdateConsensusKeyOperation(
      'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.consumedMilliGas).toEqual('1000000');
  });

  it('should return gasLimit of update consensus operation', () => {
    const op = new UpdateConsensusKeyOperation(
      'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh',
      { gas_limit: 1100 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.gasLimit).toEqual(1100);
  });

  it('should return storageLimit of update consensus operation', () => {
    const op = new UpdateConsensusKeyOperation(
      'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh',
      { storage_limit: 0 } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.storageLimit).toEqual(0);
  });

  it('should return pk (public key) of update consensus operation', () => {
    const op = new UpdateConsensusKeyOperation(
      'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh',
      { pk: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7' } as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.pk).toEqual('edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7');
  });

  it('error property should be undefined when no error occurs', () => {
    const op = new UpdateConsensusKeyOperation(
      'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );

    expect(op.errors).toBeUndefined();
  });

  it('should return error property if error occurs', () => {
    const tx = new UpdateConsensusKeyOperationBuilder();

    const op = new UpdateConsensusKeyOperation(
      'opNzjyNGHBAgvsVMyezUAPSZKbFcXZmTh6GTjcTjAGtGMpVG3Eh',
      {} as any,
      '',
      fakeForgedBytes,
      [
        tx
          .withResult({
            status: 'failed',
            errors: [
              {
                kind: 'temporary',
                id: 'proto.015-PtLimaPt.operation.update_consensus_key_on_unregistered_delegate',
                delegate: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
              },
            ],
          })
          .build(),
      ],
      fakeContext
    );

    expect(op.errors).toBeDefined();
    expect(op.errors?.[0]).toEqual({
      kind: 'temporary',
      id: 'proto.015-PtLimaPt.operation.update_consensus_key_on_unregistered_delegate',
      delegate: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
    });
  });
});
