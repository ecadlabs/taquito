import {
  OperationContentsAndResult,
  OperationContentsAndResultSmartRollupExecuteOutboxMessage,
  OperationContentsSmartRollupExecuteOutboxMessage,
  OpKind,
} from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  StorageConsumingOperation,
} from './types';

/**
 *
 * @description SmartRollupExecuteOutboxMessage Operation provides utility to fetch properties for Operation of kind SmartRollupExecuteOutboxMessage
 *
 */

export class SmartRollupExecuteOutboxMessageOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: OperationContentsSmartRollupExecuteOutboxMessage,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const smartRollupExecuteOutboxMessageOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE
      ) as OperationContentsAndResultSmartRollupExecuteOutboxMessage);
    const result =
      smartRollupExecuteOutboxMessageOp &&
      smartRollupExecuteOutboxMessageOp.metadata &&
      smartRollupExecuteOutboxMessageOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
  }

  get rollup() {
    return this.params.rollup;
  }

  get cementedCommitment() {
    return this.params.cemented_commitment;
  }

  get outputProof() {
    return this.params.output_proof;
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

  get consumedMilliGas() {
    return this.operationResults?.consumed_milligas;
  }

  get errors() {
    return this.operationResults?.errors;
  }
}
