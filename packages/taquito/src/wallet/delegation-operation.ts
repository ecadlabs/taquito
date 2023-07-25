import {
  BlockResponse,
  OperationContentsAndResultDelegation,
  OperationContentsAndResultReveal,
  OpKind,
} from '@taquito/rpc';
import { Observable } from 'rxjs';
import { Context } from '../context';
import { WalletOperation, OperationStatus } from './operation';
import { ObservableError } from './errors';

export class DelegationWalletOperation extends WalletOperation {
  constructor(
    public readonly opHash: string,
    protected readonly context: Context,
    newHead$: Observable<BlockResponse>
  ) {
    super(opHash, context, newHead$);
  }

  public async revealOperation() {
    const operationResult = await this.operationResults();
    if (operationResult) {
      return operationResult.find((x) => x.kind === OpKind.REVEAL) as
        | OperationContentsAndResultReveal
        | undefined;
    } else {
      throw new ObservableError('Unable to fetch operation result');
    }
  }

  public async delegationOperation() {
    const operationResult = await this.operationResults();
    if (operationResult) {
      return operationResult.find((x) => x.kind === OpKind.DELEGATION) as
        | OperationContentsAndResultDelegation
        | undefined;
    } else {
      throw new ObservableError('Unable to fetch operation result');
    }
  }

  public async status(): Promise<OperationStatus> {
    if (!this._included) {
      return 'pending';
    }

    const op = await this.delegationOperation();
    if (!op) {
      return 'unknown';
    }

    return op.metadata.operation_result.status;
  }
}
