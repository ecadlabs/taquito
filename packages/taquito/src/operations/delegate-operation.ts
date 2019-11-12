import { OperationContentsAndResult, OperationContentsAndResultDelegation } from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import { FeeConsumingOperation, ForgedBytes, GasConsumingOperation, RPCDelegateOperation, StorageConsumingOperation } from './types';

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

  public get operationResults() {
    const delegationOp = Array.isArray(this.results) ? this.results?.find(op => op.kind === 'delegation') as OperationContentsAndResultDelegation | undefined : undefined;
    return delegationOp?.metadata?.operation_result
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
    return this.operationResults?.consumed_gas;
  }

  get errors() {
    return this.operationResults?.errors;
  }
}
