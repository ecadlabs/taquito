import {
  OpKind,
  OperationContentsAndResult,
  OperationContentsAndResultFailingNoOp,
  OperationContentsFailingNoOp,
} from '@taquito/rpc';
import { BigNumber } from 'bignumber.js';
import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  StorageConsumingOperation,
} from './types';

/**
 * @description FailingNoOpOperation provides utility functions to fetch a newly issued operation of kind failing_noop
 */
export class FailingNoOpOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: OperationContentsFailingNoOp,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const failingNoOpOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === OpKind.FAILING_NOOP
      ) as OperationContentsAndResultFailingNoOp);
    const result =
      failingNoOpOp && failingNoOpOp.metadata && failingNoOpOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
  }

  get payloadExpression() {
    return this.params.arbitrary;
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
