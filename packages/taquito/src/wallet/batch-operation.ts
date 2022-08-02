import {
  BlockResponse,
  OperationContentsAndResultOrigination,
  OperationContentsAndResultReveal,
  OpKind,
} from '@taquito/rpc';
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
    return operationResult.find((x) => x.kind === OpKind.REVEAL) as
      | OperationContentsAndResultReveal
      | undefined;
  }

  public getOriginatedContractAddresses = async (): Promise<string[]> => {
    const opResult = await this.operationResults();

    console.log(`DI DALEM: ${JSON.stringify(opResult)}`);
    const originationOpResults = opResult.filter(
      (x) => x.kind === 'origination'
    ) as OperationContentsAndResultOrigination[];

    console.log(`ABIS FILTER: ${JSON.stringify(originationOpResults)}`);
    let addresses: string[] = [];
    for (const res of originationOpResults) {
      if (res.metadata.operation_result.originated_contracts) {
        addresses = [...addresses, ...res.metadata.operation_result.originated_contracts];
      }
    }

    return addresses;
  };

  async status(): Promise<OperationStatus> {
    if (!this._included) {
      return 'pending';
    }

    const op = await this.operationResults();
    console.log(`OPERATION RESULTS: ${JSON.stringify(op)}`);

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
