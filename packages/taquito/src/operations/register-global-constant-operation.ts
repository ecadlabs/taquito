import {
  OperationContentsAndResult,
  OperationContentsAndResultRegisterGlobalConstant,
  OperationContentsRegisterGlobalConstant,
} from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  StorageConsumingOperation,
} from './types';

/**
 * @description RegisterGlobalConstantOperation provides utility functions to fetch a newly issued operation of kind register_global_constant
 */
export class RegisterGlobalConstantOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  /**
   * @description Hash (index) of the newly registered constant
   */
  public readonly globalConstantHash?: string;
  constructor(
    hash: string,
    private readonly params: OperationContentsRegisterGlobalConstant,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);

    this.globalConstantHash = this.operationResults && this.operationResults.global_address;
  }

  get operationResults() {
    const registerGlobalConstantOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === 'register_global_constant'
      ) as OperationContentsAndResultRegisterGlobalConstant);
    const result =
      registerGlobalConstantOp &&
      registerGlobalConstantOp.metadata &&
      registerGlobalConstantOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
  }

  get registeredExpression() {
    return this.params.value;
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
