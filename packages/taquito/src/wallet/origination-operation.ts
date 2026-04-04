import {
  BlockResponse,
  OperationContentsAndResultOrigination,
  OperationContentsAndResultReveal,
  OpKind,
} from '@taquito/rpc';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { Observable } from 'rxjs';
import { Context } from '../context';
import { DefaultWalletType } from '../contract/contract';
import { isBlockHashIdentifier } from '../read-provider/interface';
import { findWithKind } from '../operations/types';
import { WalletOperation, OperationStatus } from './operation';
import { ObservableError, OriginationWalletOperationError } from './errors';

export class OriginationWalletOperation<
  TWallet extends DefaultWalletType = DefaultWalletType,
> extends WalletOperation {
  constructor(
    public readonly opHash: string,
    protected readonly context: Context,
    newHead$: Observable<BlockResponse>
  ) {
    super(opHash, context, newHead$);
  }

  public async originationOperation() {
    const operationResult = await this.operationResults();
    if (operationResult) {
      return findWithKind(operationResult, OpKind.ORIGINATION) as
        | OperationContentsAndResultOrigination
        | undefined;
    } else {
      throw new ObservableError('Unable to fetch operation result');
    }
  }

  public async revealOperation() {
    const operationResult = await this.operationResults();
    if (operationResult) {
      return findWithKind(operationResult, OpKind.REVEAL) as
        | OperationContentsAndResultReveal
        | undefined;
    } else {
      throw new ObservableError('Unable to fetch operation result');
    }
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
    const address = (op?.metadata.operation_result.originated_contracts || [])[0];
    if (!address) {
      throw new OriginationWalletOperationError('No contract was originated in this operation');
    }

    await this.confirmation();
    const inclusionBlock = await this.getInclusionBlock();
    if (!isBlockHashIdentifier(inclusionBlock.hash)) {
      throw new OriginationWalletOperationError('Inclusion block hash is invalid');
    }

    try {
      return await this.context.wallet.atExactBlock<TWallet>(
        address,
        undefined,
        inclusionBlock.hash
      );
    } catch (error) {
      if (error instanceof HttpResponseError && error.status === STATUS_CODE.NOT_FOUND) {
        return this.context.wallet.at<TWallet>(address, undefined, inclusionBlock.hash);
      }

      throw error;
    }
  }
}
