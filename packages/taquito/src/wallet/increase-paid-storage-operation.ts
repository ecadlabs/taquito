import { WalletOperation, OperationStatus } from './operation';
import { Context } from '../context';
import { Observable } from 'rxjs';
import {
  BlockResponse,
  OpKind,
  OperationContentsAndResultReveal,
  OperationContentsAndResultIncreasePaidStorage,
} from '@taquito/rpc';
import { ObservableError } from '../errors';

export class IncreasePaidStorageWalletOperation extends WalletOperation {
  constructor(
    public readonly opHash: string,
    protected readonly context: Context,
    newHead$: Observable<BlockResponse>
  ) {
    super(opHash, context, newHead$);
  }

  public async revealOperation() {
    const operationResult = await this.operationResults();
    if (!operationResult) {
      throw new ObservableError('Unable to fetch operation result');
    } else {
      return operationResult.find((x) => x.kind === OpKind.REVEAL) as
        | OperationContentsAndResultReveal
        | undefined;
    }
  }

  public async increasePaidStorageOperation() {
    const operationResult = await this.operationResults();
    if (!operationResult) {
      throw new ObservableError('Unable to fetch operation result');
    } else {
      return operationResult.find((x) => x.kind === OpKind.INCREASE_PAID_STORAGE) as
        | OperationContentsAndResultIncreasePaidStorage
        | undefined;
    }
  }

  public async status(): Promise<OperationStatus> {
    if (!this._included) {
      return 'pending';
    }

    const op = await this.increasePaidStorageOperation();
    if (!op) {
      return 'unknown';
    }

    return op.metadata.operation_result.status;
  }
}
