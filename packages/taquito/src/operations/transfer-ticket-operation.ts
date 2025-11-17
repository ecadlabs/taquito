import {
  OperationContentsAndResult,
  OperationContentsAndResultTransferTicket,
  OperationContentsTransferTicket,
  OpKind,
} from '@taquito/rpc';
import { BigNumber } from 'bignumber.js';
import { Context } from '../context';
import { Operation } from './operations';
import {
  GasConsumingOperation,
  StorageConsumingOperation,
  FeeConsumingOperation,
  ForgedBytes,
} from './types';

/**
 *
 * @description Transfer tickets from a Tezos address (tz1, tz2 or tz3) to a smart contract address (KT1) (everything on layer 1 at this step)
 *
 * @warn Currently only supports one L2 ticket holder transfer at once. ie. one collection of tickets owned by tz1, tz2 or tz3 to a smart contract.
 */
export class TransferTicketOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: OperationContentsTransferTicket,
    private readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const transferOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === OpKind.TRANSFER_TICKET
      ) as OperationContentsAndResultTransferTicket);
    const result = transferOp && transferOp.metadata && transferOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
  }

  get fee() {
    return Number(this.params.fee);
  }

  get gasLimit() {
    return Number(this.params.gas_limit);
  }

  get storageLimit() {
    return Number(this.params.storage_limit);
  }

  get consumedGas() {
    BigNumber.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: BigNumber.ROUND_UP });
    return this.consumedMilliGas
      ? new BigNumber(this.consumedMilliGas).dividedBy(1000).toString()
      : undefined;
  }

  get consumedMilliGas() {
    return this.operationResults?.consumed_milligas;
  }
}
