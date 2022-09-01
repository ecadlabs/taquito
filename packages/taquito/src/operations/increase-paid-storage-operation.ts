import {
  OperationContentsAndResult,
  OperationContentsAndResultIncreasePaidStorage,
} from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  RPCIncreasePaidStorageOperation,
  StorageConsumingOperation,
} from './types';

/**
 *
 * @description IncreasePaidStorageOperation provides utility functions to fetch a new operation of kind increase_paid_storage
 *
 */

export class IncreasePaidStorageOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: RPCIncreasePaidStorageOperation,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const increasePaidStorageOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === 'increase_paid_storage'
      ) as OperationContentsAndResultIncreasePaidStorage);
    const result =
      increasePaidStorageOp &&
      increasePaidStorageOp.metadata &&
      increasePaidStorageOp.metadata.operation_result;
    return result ? result : undefined;
  }

  get status() {
    return this.operationResults?.status ?? 'unknown';
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

  get consumedMilliGas() {
    return this.operationResults?.consumed_milligas;
  }

  get amount() {
    return this.params.amount;
  }

  get destination() {
    return this.params.destination;
  }
}
