import {
  OperationContentsAndResult,
  OperationContentsAndResultReveal,
  OperationContentsReveal,
} from '@taquito/rpc';
import { ProhibitedActionError } from '@taquito/core';
import { BigNumber } from 'bignumber.js';
import { Context } from '../context';
import { flattenErrors, flattenOperationResult } from './errors';
import { Operation } from './operations';
import {
  FeeConsumingOperation,
  ForgedBytes,
  GasConsumingOperation,
  StorageConsumingOperation,
} from './types';

/**
 * @description Reveal operation provides utility functions to fetch a newly issued revelation
 */
export class RevealOperation
  extends Operation
  implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation
{
  constructor(
    hash: string,
    private readonly params: OperationContentsReveal,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const revealOp =
      Array.isArray(this.results) &&
      (this.results.find((op) => op.kind === 'reveal') as OperationContentsAndResultReveal);
    return revealOp ? [revealOp] : [];
  }

  get status() {
    const operationResults = this.operationResults;
    const txResult = operationResults[0];
    if (txResult) {
      return txResult.metadata.operation_result.status;
    } else {
      return 'unknown';
    }
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

  get publicKey() {
    return this.params.public_key;
  }

  get proof() {
    if (this.params.proof) {
      return this.params.proof;
    } else {
      throw new ProhibitedActionError('Only BLS key has proof');
    }
  }

  private sumProp(arr: any[], prop: string) {
    return arr.reduce((prev, current) => {
      return prop in current ? Number(current[prop]) + prev : prev;
    }, 0);
  }

  get consumedGas() {
    BigNumber.config({ DECIMAL_PLACES: 0, ROUNDING_MODE: BigNumber.ROUND_UP });
    return new BigNumber(this.consumedMilliGas).dividedBy(1000).toString();
  }

  get consumedMilliGas() {
    return String(
      this.sumProp(flattenOperationResult({ contents: this.operationResults }), 'consumed_milligas')
    );
  }

  get storageDiff() {
    return String(
      this.sumProp(
        flattenOperationResult({ contents: this.operationResults }),
        'paid_storage_size_diff'
      )
    );
  }

  get storageSize() {
    return String(
      this.sumProp(flattenOperationResult({ contents: this.operationResults }), 'storage_size')
    );
  }

  get errors() {
    return flattenErrors({ contents: this.operationResults });
  }
}
