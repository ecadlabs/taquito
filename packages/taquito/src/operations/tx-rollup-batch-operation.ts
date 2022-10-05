import {
  OperationContentsAndResult,
  OperationContentsAndResultTxRollupSubmitBatch,
} from '@taquito/rpc';
import { BigNumber } from 'bignumber.js';
import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  RPCTxRollupBatchOperation,
  StorageConsumingOperation,
} from './types';

/**
 * @description TxRollupBatchOperation provides utility functions to fetch a newly issued operation of kind tx_rollup_submit_batch
 */
export class TxRollupBatchOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: RPCTxRollupBatchOperation,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const txrollupBatchOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === 'tx_rollup_submit_batch'
      ) as OperationContentsAndResultTxRollupSubmitBatch);
    const result =
      txrollupBatchOp && txrollupBatchOp.metadata && txrollupBatchOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
  }

  get content() {
    return this.params.content;
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
    return this.operationResults?.errors;
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
