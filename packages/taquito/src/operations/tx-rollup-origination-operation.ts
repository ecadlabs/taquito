import {
  OperationContentsAndResult,
  OperationContentsAndResultTxRollupOrigination,
} from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  RPCTxRollupOriginationOperation,
  StorageConsumingOperation,
} from './types';

/**
 * @description TxRollupOriginationOperation provides utility functions to fetch a newly issued operation of kind tx_rollup_origination
 */
export class TxRollupOriginationOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  /**
   * @description Address the newly originate rollup
   */
  public readonly originatedRollup?: string;
  constructor(
    hash: string,
    private readonly params: RPCTxRollupOriginationOperation,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);

    this.originatedRollup = this.operationResults && this.operationResults.originated_rollup;
  }

  get operationResults() {
    const rollupOriginationOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === 'tx_rollup_origination'
      ) as OperationContentsAndResultTxRollupOrigination);
    const result =
      rollupOriginationOp &&
      rollupOriginationOp.metadata &&
      rollupOriginationOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get status() {
    const operationResults = this.operationResults;
    if (operationResults) {
      return operationResults.status;
    } else {
      return 'unknown';
    }
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

  get errors() {
    return this.operationResults && this.operationResults.errors;
  }
}
