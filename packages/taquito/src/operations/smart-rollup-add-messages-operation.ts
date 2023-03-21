import {
  OperationContentsAndResult,
  OperationContentsAndResultSmartRollupAddMessages,
} from '@taquito/rpc';

import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  StorageConsumingOperation,
  RPCSmartRollupAddMessagesOperation,
} from './types';

/**
 * @description SmartRollupAddMessagesOperation provides utility to fetch properties of SmartRollupAddMessages
 */

export class SmartRollupAddMessagesOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: RPCSmartRollupAddMessagesOperation,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const smartRollupAddMessagesOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === 'smart_rollup_add_messages'
      ) as OperationContentsAndResultSmartRollupAddMessages);
    const result =
      smartRollupAddMessagesOp &&
      smartRollupAddMessagesOp.metadata &&
      smartRollupAddMessagesOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
  }

  get message() {
    return this.params.message;
  }

  get fee() {
    return this.params.fee;
  }

  get gasLimit() {
    return this.params.gas_limit;
  }

  get storageLimit() {
    return this.params.storage_limit;
  }

  get consumedMilliGas() {
    return this.operationResults?.consumed_milligas;
  }

  get errors() {
    return this.operationResults?.errors;
  }
}
