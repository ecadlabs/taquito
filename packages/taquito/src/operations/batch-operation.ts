import {
  BatchOperationResult,
  OperationContents,
  OperationContentsAndResult,
  OperationContentsAndResultOrigination,
} from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { BATCH_KINDS } from '../batch/constants';
import { Context } from '../context';
import { flattenErrors, flattenOperationResult } from './errors';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  StorageConsumingOperation,
  hasMetadataWithResult,
} from './types';

export class BatchOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: OperationContents[],
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

  public getOriginatedContractAddresses(): string[] {
    const originationOpResults = this.results.filter(
      (x) => x.kind === 'origination'
    ) as OperationContentsAndResultOrigination[];

    let addresses: string[] = [];
    for (const res of originationOpResults) {
      if (res.metadata.operation_result.originated_contracts) {
        addresses = [...addresses, ...res.metadata.operation_result.originated_contracts];
      }
    }

    return addresses;
  }

  public get status() {
    return (
      this.results
        .filter((result) => BATCH_KINDS.indexOf(result.kind) !== -1)
        .map((result) => {
          if (hasMetadataWithResult(result)) {
            const opResult = result.metadata.operation_result as BatchOperationResult;
            return opResult.status;
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
    BigNumber.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: BigNumber.ROUND_UP });
    return new BigNumber(this.consumedMilliGas).dividedBy(1000).toString();
  }

  get consumedMilliGas() {
    return String(
      this.sumProp(flattenOperationResult({ contents: this.results }), 'consumed_milligas')
    );
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
