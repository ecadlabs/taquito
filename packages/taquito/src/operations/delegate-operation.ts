import { OperationContentsAndResult, OperationContentsAndResultDelegation } from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  RPCDelegateOperation,
  StorageConsumingOperation,
} from './types';

/**
 * @description Delegation operation provide utility function to fetch newly issued delegation
 *
 * @warn Currently support only one delegation per operation
 */
export class DelegateOperation extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation {
  constructor(
    hash: string,
    private readonly params: RPCDelegateOperation,
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
      (this.results.find(op => op.kind === 'delegation') as OperationContentsAndResultDelegation);
    const result = delegationOp && delegationOp.metadata && delegationOp.metadata.operation_result;
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

  get delegate(): string {
    return this.delegate;
  }

  get isRegisterOperation(): boolean {
    return this.delegate === this.source;
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

  get consumedGas() {
    const consumedGas = this.operationResults && this.operationResults.consumed_gas;
    return consumedGas ? consumedGas : undefined;
  }

  get errors() {
    return this.operationResults && this.operationResults.errors;
  }
}
