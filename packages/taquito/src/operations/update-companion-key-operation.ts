import {
  OperationContentsAndResult,
  OperationContentsAndResultUpdateCompanionKey,
  OperationContentsUpdateCompanionKey,
} from '@taquito/rpc';
import { ProhibitedActionError } from '@taquito/core';
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
 * @description UpdateCompanionKeyOperation provides utility to fetch properties for Operation of kind UpdateCompanionKey
 *
 */
export class UpdateCompanionKeyOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: OperationContentsUpdateCompanionKey,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const updateCompanionKeyOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === 'update_companion_key'
      ) as OperationContentsAndResultUpdateCompanionKey);
    const result =
      updateCompanionKeyOp &&
      updateCompanionKeyOp.metadata &&
      updateCompanionKeyOp.metadata.operation_result;
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

  get proof() {
    if (this.params.proof) {
      return this.params.proof;
    } else {
      throw new ProhibitedActionError('Only updating companion key to a BLS account has proof');
    }
  }

  get consumedMilliGas() {
    return this.operationResults?.consumed_milligas;
  }

  get errors() {
    return this.operationResults?.errors;
  }
}
