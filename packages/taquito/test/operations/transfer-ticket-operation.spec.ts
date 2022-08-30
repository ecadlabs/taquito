import { ForgedBytes, RPCTransferTicketOperation } from '../../src/operations/types';
import {
  METADATA_BALANCE_UPDATES_CATEGORY,
  OperationContentsAndResult,
  OperationContentsAndResultTransferTicket,
  OpKind,
} from '@taquito/rpc';
import { defaultConfigConfirmation } from '../../src/context';
import { TransferTicketOperation } from '../../src/operations/transfer-ticket-operation';

describe('Transfer Operation L2 Tx Rollup', () => {
  let fakeContext: any;
  const fakeForgedBytes = {} as ForgedBytes;

  const params: RPCTransferTicketOperation = {
    kind: OpKind.TRANSFER_TICKET,
    fee: 804,
    gas_limit: 5009,
    storage_limit: 130,
    ticket_contents: { string: 'foobar' },
    ticket_ty: { prim: 'string' },
    ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
    ticket_amount: 2,
    destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
    entrypoint: 'default',
  };

  const successfulResult = [
    {
      kind: OpKind.TRANSFER_TICKET,
      source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
      fee: '804',
      gas_limit: '5009',
      storage_limit: '130',
      counter: '145',
      ticket_contents: { string: 'foobar' },
      ticket_ty: { prim: 'string' },
      ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
      ticket_amount: '2',
      destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
      entrypoint: 'default',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
            change: '-804',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: METADATA_BALANCE_UPDATES_CATEGORY.BLOCK_FEES,
            change: '804',
            origin: 'block',
          },
        ],
        operation_result: {
          status: 'applied',
          balance_updates: [
            {
              kind: 'contract',
              contract: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
              change: '-16500',
              origin: 'block',
            },
            {
              kind: 'burned',
              category: METADATA_BALANCE_UPDATES_CATEGORY.STORAGE_FEES,
              change: '16500',
              origin: 'block',
            },
          ],
          consumed_milligas: '2122881',
          paid_storage_size_diff: '66',
        },
      },
    },
  ] as OperationContentsAndResult[];

  const successfulResultWithoutResults = [
    {
      kind: OpKind.TRANSFER_TICKET,
      source: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
      fee: '804',
      gas_limit: '5009',
      storage_limit: '130',
      counter: '145',
      ticket_contents: { string: 'foobar' },
      ticket_ty: { prim: 'string' },
      ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
      ticket_amount: '2',
      destination: 'KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg',
      entrypoint: 'default',
      metadata: {
        balance_updates: [
          {
            kind: 'contract',
            contract: 'tz1iedjFYksExq8snZK9MNo4AvXHBdXfTsGX',
            change: '-804',
            origin: 'block',
          },
          {
            kind: 'accumulator',
            category: METADATA_BALANCE_UPDATES_CATEGORY.BLOCK_FEES,
            change: '804',
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
      operations: [[{ hash: 'opaUJ25WPbB4D5wR7AB8XPYCn6Q9hTm5ZfkUd43tR2SR4CRCGPz' }], [], [], []],
      headers: {
        level: 1,
      },
    });
  });

  it('should return the fee', () => {
    const op = new TransferTicketOperation(
      'opaUJ25WPbB4D5wR7AB8XPYCn6Q9hTm5ZfkUd43tR2SR4CRCGPz',
      params,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.fee).toEqual(804);
  });
  it('should return the gas limit', () => {
    const op = new TransferTicketOperation(
      'opaUJ25WPbB4D5wR7AB8XPYCn6Q9hTm5ZfkUd43tR2SR4CRCGPz',
      params,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.gasLimit).toEqual(5009);
  });

  it('should return the consumed gas', () => {
    const op = new TransferTicketOperation(
      'opaUJ25WPbB4D5wR7AB8XPYCn6Q9hTm5ZfkUd43tR2SR4CRCGPz',
      params,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.consumedGas).toEqual('2123');
  });

  it('should return the consumed milligas', () => {
    const op = new TransferTicketOperation(
      'opaUJ25WPbB4D5wR7AB8XPYCn6Q9hTm5ZfkUd43tR2SR4CRCGPz',
      params,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.consumedMilliGas).toEqual('2122881');
  });

  it('should return the storage limit', () => {
    const op = new TransferTicketOperation(
      'opaUJ25WPbB4D5wR7AB8XPYCn6Q9hTm5ZfkUd43tR2SR4CRCGPz',
      params,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    expect(op.storageLimit).toEqual(130);
  });
  it('should return the content', () => {
    const op = new TransferTicketOperation(
      'opaUJ25WPbB4D5wR7AB8XPYCn6Q9hTm5ZfkUd43tR2SR4CRCGPz',
      params,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    const resultType = successfulResult[0] as OperationContentsAndResultTransferTicket;
    expect(op.operationResults).toEqual(resultType.metadata.operation_result);
  });
  it('should return the status with params', () => {
    const op = new TransferTicketOperation(
      'opaUJ25WPbB4D5wR7AB8XPYCn6Q9hTm5ZfkUd43tR2SR4CRCGPz',
      params,
      '',
      fakeForgedBytes,
      successfulResult,
      fakeContext
    );
    const resultType = successfulResult[0] as OperationContentsAndResultTransferTicket;
    expect(op.status).toEqual(resultType.metadata.operation_result.status);
  });
  it('should return the status unknown', () => {
    const op = new TransferTicketOperation(
      'opaUJ25WPbB4D5wR7AB8XPYCn6Q9hTm5ZfkUd43tR2SR4CRCGPz',
      {} as any,
      '',
      fakeForgedBytes,
      successfulResultWithoutResults,
      fakeContext
    );
    expect(op.status).toEqual('unknown');
  });
});
