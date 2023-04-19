import {
  BlockResponse,
  InternalOperationResult,
  OperationContentsAndResultTransaction,
} from '@taquito/rpc';
import { BehaviorSubject, from, Observable, ObservableInput, OperatorFunction, timer } from 'rxjs';
import {
  concatMap,
  distinctUntilKeyChanged,
  first,
  pluck,
  publish,
  refCount,
  retry,
  switchMap,
} from 'rxjs/operators';
import { Context } from '../context';
import { evaluateFilter, eventFilter } from './filters';
import {
  Filter,
  EventFilter,
  SubscribeProvider,
  Subscription,
  OperationContent,
  EventSubscription,
} from './interface';
import { ObservableSubscription } from './observable-subscription';
import BigNumber from 'bignumber.js';

export interface PollingSubscribeProviderConfig {
  pollingIntervalMilliseconds?: number;
  shouldObservableSubscriptionRetry: boolean;
  observableSubscriptionRetryFunction: OperatorFunction<any, any>;
}

export const defaultConfigStreamer: PollingSubscribeProviderConfig = {
  shouldObservableSubscriptionRetry: false,
  observableSubscriptionRetryFunction: retry(),
};

const getLastBlock = (context: Context) => {
  return from(context.rpc.getBlock()).pipe(first());
};

const applyFilter = (filter: Filter) =>
  concatMap<BlockResponse, ObservableInput<OperationContent>>((block) => {
    return new Observable<OperationContent>((sub) => {
      for (const ops of block.operations) {
        for (const op of ops) {
          for (const content of op.contents) {
            if (evaluateFilter({ hash: op.hash, ...content }, filter)) {
              sub.next({ hash: op.hash, ...content });
            }
          }
        }
      }
      sub.complete();
    });
  });

const applyEventFilter = (filter?: EventFilter) =>
  concatMap<BlockResponse, ObservableInput<EventSubscription>>((block) => {
    return new Observable<EventSubscription>((sub) => {
      for (const ops of block.operations) {
        for (const op of ops) {
          for (const content of op.contents) {
            const tx = content as OperationContentsAndResultTransaction;
            const internalOpResults = tx.metadata.internal_operation_results;
            if (internalOpResults) {
              for (const event of internalOpResults) {
                if (eventFilter(event, filter?.address, filter?.tag, filter?.excludeFailedOperations)) {
                  sub.next({
                    opHash: op.hash,
                    blockHash: block.hash,
                    level: block.header.level,
                    ...event,
                  });
                }
              }
            }
          }
        }
      }
      sub.complete();
    });
  });

export class PollingSubscribeProvider implements SubscribeProvider {
  private _config$: BehaviorSubject<PollingSubscribeProviderConfig>;
  // Map the changing polling interval to a timer, which will automatically terminate the previous timer when the next one starts.
  private timer$: Observable<number>;

  private newBlock$: Observable<BlockResponse>;

  constructor(private context: Context, config: Partial<PollingSubscribeProviderConfig> = {}) {
    this._config$ = new BehaviorSubject({
      ...defaultConfigStreamer,
      ...config,
    });
    this.timer$ = this._config$.pipe(
      pluck('pollingIntervalMilliseconds'),
      switchMap((pollingIntervalMilliseconds) => {
        if (!pollingIntervalMilliseconds) {
          return from(this.getConfirmationPollingInterval()).pipe(
            switchMap((interval) => {
              return timer(0, interval);
            })
          );
        } else {
          return timer(0, pollingIntervalMilliseconds);
        }
      })
    );
    this.newBlock$ = this.timer$.pipe(
      switchMap(() => getLastBlock(this.context)),
      distinctUntilKeyChanged('hash'),
      publish(),
      refCount()
    );
  }

  get config() {
    return this._config$.getValue();
  }

  private async getConfirmationPollingInterval() {
    if (!this.config.pollingIntervalMilliseconds) {
      const defaultIntervalTestnetsMainnet = 5000;
      const defaultIntervalSandbox = 1000;
      try {
        const constants = await this.context.readProvider.getProtocolConstants('head');
        const blockTime = constants.minimal_block_delay
          ? constants.minimal_block_delay.multipliedBy(1000)
          : constants.time_between_blocks
          ? constants.time_between_blocks[0].multipliedBy(1000)
          : new BigNumber(defaultIntervalTestnetsMainnet);
        const confirmationPollingInterval = blockTime.dividedBy(3);

        this.config.pollingIntervalMilliseconds =
          confirmationPollingInterval.toNumber() === 0
            ? defaultIntervalSandbox
            : confirmationPollingInterval.toNumber();
      } catch (exception) {
        return defaultIntervalTestnetsMainnet;
      }
    }
    return this.config.pollingIntervalMilliseconds;
  }

  subscribeBlock(_filter: 'head'): Subscription<BlockResponse> {
    return new ObservableSubscription(
      this.newBlock$,
      this.config.shouldObservableSubscriptionRetry,
      this.config.observableSubscriptionRetryFunction
    );
  }

  subscribe(_filter: 'head'): Subscription<string> {
    return new ObservableSubscription(
      this.newBlock$.pipe(pluck('hash')),
      this.config.shouldObservableSubscriptionRetry,
      this.config.observableSubscriptionRetryFunction
    );
  }

  subscribeOperation(filter: Filter): Subscription<OperationContent> {
    return new ObservableSubscription(
      this.newBlock$.pipe(applyFilter(filter)),
      this.config.shouldObservableSubscriptionRetry,
      this.config.observableSubscriptionRetryFunction
    );
  }

  subscribeEvent(eventFilter?: EventFilter): Subscription<InternalOperationResult> {
    return new ObservableSubscription(
      this.newBlock$.pipe(applyEventFilter(eventFilter)),
      this.config.shouldObservableSubscriptionRetry,
      this.config.observableSubscriptionRetryFunction
    );
  }
}
