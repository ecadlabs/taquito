import { BlockResponse } from '@taquito/rpc';
import {
  BehaviorSubject,
  concat,
  defer,
  from,
  Observable,
  of,
  range,
  ReplaySubject,
  SchedulerLike,
  throwError,
} from 'rxjs';
import { concatMap, mergeMap, share, startWith, switchMap, timeout } from 'rxjs/operators';
import { Context } from '../context';
import { BlockIdentifier } from '../read-provider/interface';
import { createObservableFromSubscription } from '../subscribe/create-observable-from-subscription';
import { BatchWalletOperation } from './batch-operation';
import { DelegationWalletOperation } from './delegation-operation';
import { IncreasePaidStorageWalletOperation } from './increase-paid-storage-operation';
import { WalletOperation } from './operation';
import { OriginationWalletOperation } from './origination-operation';
import { TransactionWalletOperation } from './transaction-operation';
import { TransferTicketWalletOperation } from './transfer-ticket-operation';
import { ConfirmationTimeoutError } from '../errors';
import { RegisterGlobalConstantWalletOperation } from './register-global-constant-operation';
import { RevealWalletOperation } from './reveal-operation';

export function timeoutAfter<T>(timeoutMillisec: number): (source: Observable<T>) => Observable<T> {
  return function inner(source: Observable<T>): Observable<T> {
    return new BehaviorSubject(null).pipe(
      timeout({
        each: timeoutMillisec,
        with: () =>
          throwError(() => new ConfirmationTimeoutError(`Confirmation polling timed out`)),
      }),
      mergeMap(() => source)
    );
  };
}

export const createNewPollingBasedHeadObservable = (
  sharedHeadOb: Observable<BlockResponse>,
  context: Context,
  _scheduler?: SchedulerLike
): Observable<BlockResponse> => {
  return sharedHeadOb.pipe(
    timeoutAfter(context.config.confirmationPollingTimeoutSecond * 1000),
    share({
      connector: () => new ReplaySubject(1),
      resetOnError: false,
      resetOnComplete: false,
      resetOnRefCountZero: true,
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
    return from(this.context.readProvider.getBlock(startBlock as BlockIdentifier)).pipe(
      switchMap((block) => {
        if (count === 1) {
          return of(block);
        }

        return range(block.header.level, count - 1).pipe(
          startWith(block),
          concatMap(async (level) => {
            return this.context.readProvider.getBlock(
              typeof level === 'number' ? level : level.header.level
            );
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

  async createTransferTicketOperation(
    hash: string,
    config: OperationFactoryConfig = {}
  ): Promise<TransferTicketWalletOperation> {
    return new TransferTicketWalletOperation(
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

  async createIncreasePaidStorageOperation(
    hash: string,
    config: OperationFactoryConfig = {}
  ): Promise<IncreasePaidStorageWalletOperation> {
    return new IncreasePaidStorageWalletOperation(
      hash,
      this.context.clone(),
      await this.createHeadObservableFromConfig(config)
    );
  }

  async createRegisterGlobalConstantOperation(
    hash: string,
    config: OperationFactoryConfig = {}
  ): Promise<RegisterGlobalConstantWalletOperation> {
    return new RegisterGlobalConstantWalletOperation(
      hash,
      this.context.clone(),
      await this.createHeadObservableFromConfig(config)
    );
  }

  async createRevealOperation(
    hash: string,
    config: OperationFactoryConfig = {}
  ): Promise<RevealWalletOperation> {
    return new RevealWalletOperation(
      hash,
      this.context.clone(),
      await this.createHeadObservableFromConfig(config)
    );
  }
}
