import { OperationContentsAndResult, OperationContentsAndResultProposals } from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import { ForgedBytes, RPCProposalsOperation } from './types';

/**
 *
 * @description ProposalsOperation provides utility functions to fetch a new operation of kind proposals
 *
 */
export class ProposalsOperation extends Operation {
  constructor(
    hash: string,
    private readonly params: RPCProposalsOperation,
    public readonly source: string,
    raw: ForgedBytes,
    results: OperationContentsAndResult[],
    context: Context
  ) {
    super(hash, raw, results, context);
  }

  get operationResults() {
    const proposalsOp =
      Array.isArray(this.results) &&
      (this.results.find((op) => op.kind === 'proposals') as OperationContentsAndResultProposals);
    const result = proposalsOp;

    return result ? result : undefined;
  }

  get proposals() {
    return this.params.proposals;
  }

  get period() {
    return this.operationResults?.period;
  }
}
