import { OperationContentsAndResult, OperationContentsFailingNoop } from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import { ForgedBytes } from './types';

/**
 * @description FailingNoopOperation provides utility functions to fetch a newly issued operation of kind failing_noop
 */
export class FailingNoopOperation extends Operation {
  constructor(
    hash: string,
    private readonly params: OperationContentsFailingNoop,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get payloadExpression() {
    return this.params.arbitrary;
  }
}
