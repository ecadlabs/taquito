import { BlockResponse } from '@taquito/rpc';
import { concat, defer, from, Observable, of, range, SchedulerLike, throwError } from 'rxjs';
import { concatMap, shareReplay, startWith, switchMap, timeoutWith } from 'rxjs/operators';
import { Context } from '../context';
import { createObservableFromSubscription } from '../subscribe/create-observable-from-subscription';
import { BatchWalletOperation } from './batch-operation';
import { DelegationWalletOperation } from './delegation-operation';
import { WalletOperation } from './operation';
import { OriginationWalletOperation } from './origination-operation';
import { TransactionWalletOperation } from './transaction-operation';

export const createNewPollingBasedHeadObservable = (
  sharedHeadOb: Observable<BlockResponse>,
  context: Context,
  scheduler?: SchedulerLike
): Observable<BlockResponse> => {
  return sharedHeadOb.pipe(
    timeoutWith(
      context.config.confirmationPollingTimeoutSecond * 1000,
      throwError(new Error('Confirmation polling timed out')),
      scheduler
    ),
    shareReplay({
      refCount: true,
      scheduler,
    })
  );
};

export interface OperationFactoryConfig {
  blockIdentifier?: string;
}

export class OperationFactory {
  constructor(private context: Context) {}

  // Cache the last block for one second across all operations
  private sharedHeadObs = defer(() => {
    return createObservableFromSubscription(this.context.stream.subscribeBlock('head'));
  });

  private async createNewHeadObservable() {
    return createNewPollingBasedHeadObservable(this.sharedHeadObs, this.context);
  }

  private createPastBlockWalker(startBlock: string, count = 1) {
    return from(this.context.rpc.getBlock({ block: startBlock })).pipe(
      switchMap((block) => {
        if (count === 1) {
          return of(block);
        }

        return range(block.header.level, count - 1).pipe(
          startWith(block),
          concatMap(async (level) => {
            return this.context.rpc.getBlock({ block: String(level) });
          })
        );
      })
    );
  }

  private async createHeadObservableFromConfig({ blockIdentifier }: OperationFactoryConfig) {
    const observableSequence: Observable<BlockResponse>[] = [];

    if (blockIdentifier) {
      observableSequence.push(this.createPastBlockWalker(blockIdentifier));
    }

    observableSequence.push(await this.createNewHeadObservable());

    return concat(...observableSequence);
  }

  async createOperation(
    hash: string,
    config: OperationFactoryConfig = {}
  ): Promise<WalletOperation> {
    return new WalletOperation(
      hash,
      this.context.clone(),
      await this.createHeadObservableFromConfig(config)
    );
  }

  async createBatchOperation(
    hash: string,
    config: OperationFactoryConfig = {}
  ): Promise<BatchWalletOperation> {
    return new BatchWalletOperation(
      hash,
      this.context.clone(),
      await this.createHeadObservableFromConfig(config)
    );
  }

  async createTransactionOperation(
    hash: string,
    config: OperationFactoryConfig = {}
  ): Promise<TransactionWalletOperation> {
    return new TransactionWalletOperation(
      hash,
      this.context.clone(),
      await this.createHeadObservableFromConfig(config)
    );
  }

  async createDelegationOperation(
    hash: string,
    config: OperationFactoryConfig = {}
  ): Promise<DelegationWalletOperation> {
    return new DelegationWalletOperation(
      hash,
      this.context.clone(),
      await this.createHeadObservableFromConfig(config)
    );
  }

  async createOriginationOperation(
    hash: string,
    config: OperationFactoryConfig = {}
  ): Promise<OriginationWalletOperation> {
    return new OriginationWalletOperation(
      hash,
      this.context.clone(),
      await this.createHeadObservableFromConfig(config)
    );
  }
}
