import { OperationContentsAndResult, OperationContentsAndResultDrainDelegate } from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import { ForgedBytes, RPCDrainDelegateOperation } from './types';

/**
 *
 * @description DrainDelegateOperation provides utility functions to fetch a new operation of kind drain_delegate
 *
 */

export class DrainDelegateOperation extends Operation {
  constructor(
    hash: string,
    private readonly params: RPCDrainDelegateOperation,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const drainDelegateOp =
      Array.isArray(this.results) &&
      (this.results.find(
        (op) => op.kind === 'drain_delegate'
      ) as OperationContentsAndResultDrainDelegate);
    const result =
      drainDelegateOp && drainDelegateOp.metadata && drainDelegateOp.metadata.balance_updates;
    return result ? result : undefined;
  }

  get consensusKey() {
    return this.params.consensus_key;
  }

  get delegate() {
    return this.params.delegate;
  }

  get destination() {
    return this.params.destination;
  }
}
