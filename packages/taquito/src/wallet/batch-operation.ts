import { BlockResponse, OperationContentsAndResultReveal, OpKind } from '@taquito/rpc';
import { Observable } from 'rxjs';
import { BATCH_KINDS } from '../batch/rpc-batch-provider';
import { Context } from '../context';
import { hasMetadataWithResult } from '../operations/types';
import { WalletOperation, OperationStatus } from './operation';

export class BatchWalletOperation extends WalletOperation {
  constructor(
    public readonly opHash: string,
    protected readonly context: Context,
    newHead$: Observable<BlockResponse>
  ) {
    super(opHash, context, newHead$);
  }

  public async revealOperation() {
    const operationResult = await this.operationResults();
    return operationResult.find(x => x.kind === OpKind.REVEAL) as
      | OperationContentsAndResultReveal
      | undefined;
  }

  async status(): Promise<OperationStatus> {
    if (!this._included) {
      return 'pending';
    }

    const op = await this.operationResults();

    return (
      op
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
}
