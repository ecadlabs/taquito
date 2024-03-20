import {
  OperationContentsAndResult,
  OperationContentsAndResultUpdateConsensusKey,
  OperationContentsUpdateConsensusKey,
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
 * @description UpdateConsensusKeyOperation provides utility to fetch properties for Operation of kind UpdateConsensusKey
 *
 */
export class UpdateConsensusKeyOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: OperationContentsUpdateConsensusKey,
    public readonly source: string,
    raw: ForgedBytes,
    private readonly preResults: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, [], context);
  }

  get preapplyResults() {
    const updateConsensusKeyOp =
      Array.isArray(this.preResults) &&
      (this.preResults.find(
        (op) => op.kind === 'update_consensus_key'
      ) as OperationContentsAndResultUpdateConsensusKey);
    const result =
      updateConsensusKeyOp &&
      updateConsensusKeyOp.metadata &&
      updateConsensusKeyOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get operationResults() {
    const updateConsensusKeyOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === 'update_consensus_key'
      ) as OperationContentsAndResultUpdateConsensusKey);
    const result =
      updateConsensusKeyOp &&
      updateConsensusKeyOp.metadata &&
      updateConsensusKeyOp.metadata.operation_result;
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

  get pk() {
    return this.params.pk;
  }

  get consumedMilliGas() {
    return this.operationResults?.consumed_milligas;
  }

  get errors() {
    return this.operationResults?.errors;
  }
}
