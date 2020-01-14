import {
  RPCOperation,
  GasConsumingOperation,
  StorageConsumingOperation,
  FeeConsumingOperation,
  ForgedBytes,
} from './types';
import { Operation } from './operations';
import { OperationContentsAndResult } from '@taquito/rpc';
import { Context } from '../context';
import { flattenOperationResult, flattenErrors } from './operation-errors';

export class BatchOperation extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation {
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
