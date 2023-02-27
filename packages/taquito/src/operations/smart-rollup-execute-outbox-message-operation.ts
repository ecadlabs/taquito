import {
  OperationContentsAndResult,
  OperationContentsAndResultSmartRollupExecuteOutboxMessage,
  OpKind,
} from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  RPCSmartRollupExecuteOutboxMessageOperation,
  StorageConsumingOperation,
} from './types';

/**
 *
 * @description SmartRollupExecuteOutboxMessageOperation provides utility to fetch properties for Operation of kind SmartRollupExecuteOutboxMessage
 *
 */
export class SmartRollupExecuteOutboxMessageOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: RPCSmartRollupExecuteOutboxMessageOperation,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const smartRollupOriginateOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE
      ) as OperationContentsAndResultSmartRollupExecuteOutboxMessage);
    const result =
      smartRollupOriginateOp &&
      smartRollupOriginateOp.metadata &&
      smartRollupOriginateOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
  }

  get consumedMilliGas() {
    return this.operationResults?.consumed_milligas;
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

  get rollup() {
    return this.params.rollup;
  }

  get cementedCommitment() {
    return this.params.cemented_commitment;
  }

  get outputProof() {
    return this.params.output_proof;
  }

  get errors() {
    return this.operationResults?.errors;
  }
}
