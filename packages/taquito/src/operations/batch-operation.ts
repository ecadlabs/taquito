import { OperationContentsAndResult } from '@taquito/rpc';
import { BATCH_KINDS } from '../batch/rpc-batch-provider';
import { Context } from '../context';
import { flattenErrors, flattenOperationResult } from './operation-errors';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  RPCOperation,
  StorageConsumingOperation,
  hasMetadataWithResult,
} from './types';

export class BatchOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: RPCOperation[],
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  private sumProp(arr: any[], prop: string) {
    return arr.reduce((prev, current) => {
      return prop in current ? Number(current[prop]) + prev : prev;
    }, 0);
  }

  public get status() {
    return (
      this.results
        .filter((result) => BATCH_KINDS.indexOf(result.kind) !== -1)
        .map((result) => {
          if (hasMetadataWithResult(result)) {
            return result.metadata.operation_result.status;
          } else {
            return 'unknown';
          }
        })[0] || 'unknown'
    );
  }

  get fee() {
    return this.sumProp(this.params, 'fee');
  }

  get gasLimit() {
    return this.sumProp(this.params, 'gas_limit');
  }

  get storageLimit() {
    return this.sumProp(this.params, 'storage_limit');
  }

  get consumedGas() {
    return String(this.sumProp(flattenOperationResult({ contents: this.results }), 'consumed_gas'));
  }

  get storageDiff() {
    return String(
      this.sumProp(flattenOperationResult({ contents: this.results }), 'paid_storage_size_diff')
    );
  }

  get errors() {
    return flattenErrors({ contents: this.results });
  }
}
