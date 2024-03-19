import {
  OperationContentsAndResult,
  OperationContentsAndResultBallot,
  OperationContentsBallot,
} from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import { ForgedBytes } from './types';

/**
 *
 * @description BallotOperation provides utility functions to fetch a new operation of kind ballot
 *
 */
export class BallotOperation extends Operation {
  constructor(
    hash: string,
    private readonly params: OperationContentsBallot,
    public readonly source: string,
    raw: ForgedBytes,
    private readonly preResults: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, [], context);
  }

  get preapplyResults() {
    const ballotOp =
      Array.isArray(this.preResults) &&
      (this.preResults.find((op) => op.kind === 'ballot') as OperationContentsAndResultBallot);
    const result = ballotOp;

    return result ? result : undefined;
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
