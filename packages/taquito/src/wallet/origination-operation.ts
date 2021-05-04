import {
  BlockResponse,
  OperationContentsAndResultOrigination,
  OperationContentsAndResultReveal,
  OpKind,
} from '@taquito/rpc';
import { Observable } from 'rxjs';
import { Context } from '../context';
import { findWithKind } from '../operations/types';
import { WalletOperation, OperationStatus } from './operation';

export class OriginationWalletOperation extends WalletOperation {
  constructor(
    public readonly opHash: string,
    protected readonly context: Context,
    newHead$: Observable<BlockResponse>
  ) {
    super(opHash, context, newHead$);
  }

  public async originationOperation() {
    const operationResult = await this.operationResults();
    
    if(!operationResult) {
      throw new Error('Operation and result found to be undefined!');
    }

    return findWithKind(operationResult, OpKind.ORIGINATION) as
      | OperationContentsAndResultOrigination
      | undefined;
  }

  public async revealOperation() {
    const operationResult = await this.operationResults();
    
    if(!operationResult) {
      throw new Error('Operation and result found to be undefined!');
    }

    return findWithKind(operationResult, OpKind.REVEAL) as
      | OperationContentsAndResultReveal
      | undefined;
  }

  public async status(): Promise<OperationStatus> {
    if (!this._included) {
      return 'pending';
    }

    const op = await this.originationOperation();
    if (!op) {
      return 'unknown';
    }

    return op.metadata.operation_result.status;
  }

  public async contract() {
    const op = await this.originationOperation();
    const address = (op!.metadata.operation_result.originated_contracts || [])[0];
    return this.context.wallet.at(address);
  }
}
