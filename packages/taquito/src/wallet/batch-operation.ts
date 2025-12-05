import {
  BatchOperationResult,
  BlockResponse,
  OperationContentsAndResultOrigination,
  OperationContentsAndResultReveal,
  OpKind,
} from '@taquito/rpc';
import { Observable } from 'rxjs';
import { BATCH_KINDS } from '../batch/constants';
import { Context } from '../context';
import { hasMetadataWithResult } from '../operations/types';
import { WalletOperation, OperationStatus } from './operation';
import { ObservableError } from './errors';

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
    if (!operationResult) {
      throw new ObservableError('Unable to fetch operation results');
    } else {
      return operationResult.find((x) => x.kind === OpKind.REVEAL) as
        | OperationContentsAndResultReveal
        | undefined;
    }
  }

  public getOriginatedContractAddresses = async (): Promise<string[]> => {
    const opResult = await this.operationResults();
    if (!opResult) {
      throw new ObservableError('Unable to fetch operation results');
    } else {
      const originationOpResults = opResult.filter(
        (x) => x.kind === 'origination'
      ) as OperationContentsAndResultOrigination[];

      let addresses: string[] = [];
      for (const res of originationOpResults) {
        if (res.metadata.operation_result.originated_contracts) {
          addresses = [...addresses, ...res.metadata.operation_result.originated_contracts];
        }
      }

      return addresses;
    }
  };

  async status(): Promise<OperationStatus> {
    if (!this._included) {
      return 'pending';
    }

    const op = await this.operationResults();
    if (op) {
      return (
        op
          .filter((result) => BATCH_KINDS.indexOf(result.kind) !== -1)
          .map((result) => {
            if (hasMetadataWithResult(result)) {
              const opResult = result.metadata.operation_result as BatchOperationResult;
              return opResult.status;
            } else {
              return 'unknown';
            }
          })[0] || 'unknown'
      );
    } else {
      throw new ObservableError('Unable to fetch operation results');
    }
  }
}
