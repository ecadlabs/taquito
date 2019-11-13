import { OperationContentsAndResult, OperationContentsAndResultTransaction } from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import {
  ForgedBytes,
  GasConsumingOperation,
  StorageConsumingOperation,
  RPCTransferOperation,
  FeeConsumingOperation,
} from './types';
import BigNumber from 'bignumber.js';

/**
 * @description Transaction operation provide utility function to fetch newly issued transaction
 *
 * @warn Currently support only one transaction per operation
 */
export class TransactionOperation extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation {
  constructor(
    hash: string,
    private readonly params: RPCTransferOperation,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  private get operationResults() {
    const transactionOp =
      Array.isArray(this.results) &&
      (this.results.find(op => op.kind === 'transaction') as OperationContentsAndResultTransaction);
    return transactionOp && transactionOp.metadata && transactionOp.metadata.operation_result;
  }

  get amount() {
    return new BigNumber(this.params.amount);
  }

  get destination() {
    return this.params.destination;
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

  get storageDiff() {
    const storageDiff = this.operationResults && this.operationResults.paid_storage_size_diff;
    return storageDiff ? storageDiff : undefined;
  }

  get storageSize() {
    const storageSize = this.operationResults && this.operationResults.storage_size;
    return storageSize ? storageSize : undefined;
  }

  get errors() {
    return this.operationResults && this.operationResults.errors;
  }
}
