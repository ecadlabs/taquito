import { OperationContentsAndResult, OperationContentsAndResultBallot } from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import { ForgedBytes, RPCBallotOperation } from './types';

/**
 *
 * @description BallotOperation provides utility functions to fetch a new operation of kind ballot
 *
 */
export class BallotOperation extends Operation {
  constructor(
    hash: string,
    private readonly params: RPCBallotOperation,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const ballotOp =
      Array.isArray(this.results) &&
      (this.results.find((op) => op.kind === 'ballot') as OperationContentsAndResultBallot);
    const result = ballotOp;

    return result ? result : undefined;
  }

  get period() {
    return this.operationResults?.period;
  }

  get proposal() {
    return this.params.proposal;
  }

  get ballot() {
    return this.params.ballot;
  }
}
