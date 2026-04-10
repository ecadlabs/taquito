import {
  OperationContentsAndResult,
  OperationContentsAndResultDelegation,
  OperationContentsDelegation,
} from '@taquito/rpc';
import { BigNumber as BigNumberJs } from 'bignumber.js';
type BigNumber = InstanceType<typeof BigNumberJs>;
const BigNumber = BigNumberJs;
import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  StorageConsumingOperation,
} from './types';

/**
 * Delegation operation provide utility function to fetch newly issued delegation
 *
 * @remarks Currently support only one delegation per operation
 */
export class DelegateOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: OperationContentsDelegation,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const delegationOp =
      Array.isArray(this.results) &&
      (this.results.find((op) => op.kind === 'delegation') as OperationContentsAndResultDelegation);
    const result = delegationOp && delegationOp.metadata && delegationOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
  }

  get delegate() {
    return this.params.delegate;
  }

  get isRegisterOperation(): boolean {
    return this.delegate === this.source;
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

  get errors() {
    return this.operationResults?.errors;
  }
}
