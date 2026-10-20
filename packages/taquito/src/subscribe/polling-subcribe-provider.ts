import {
  BlockResponse,
  InternalOperationResult,
  OperationContentsAndResultTransaction,
} from '@taquito/rpc';
import {
  BehaviorSubject,
  defer,
  EMPTY,
  from,
  Observable,
  ObservableInput,
  OperatorFunction,
  timer,
} from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  exhaustMap,
  tap,
  map,
  share,
  retry,
  switchMap,
} from 'rxjs/operators';
import { Context } from '../context';
import { BlockIdentifier } from '../read-provider/interface';
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
            const internalOpResults = tx.metadata?.internal_operation_results;
            if (internalOpResults) {
              for (const event of internalOpResults) {
                if (
                  eventFilter(event, filter?.address, filter?.tag, filter?.excludeFailedOperations)
                ) {
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
  private newBlockHash$: Observable<string>;

  constructor(
    private context: Context,
    config: Partial<PollingSubscribeProviderConfig> = {}
  ) {
    this._config$ = new BehaviorSubject({
      ...defaultConfigStreamer,
      observableSubscriptionRetryFunction: retry({
        delay: () =>
          from(this.getConfirmationPollingInterval()).pipe(
            switchMap((interval) => timer(interval))
          ),
      }),
      ...config,
    });
    this.timer$ = this._config$.pipe(
      map((x) => x?.pollingIntervalMilliseconds),
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
    // Keep repeated observations here so full reads can recover at the same head
    // after a failure or after a slow request skipped a polling tick.
    const polledBlockHash$ = this.timer$.pipe(
      exhaustMap(() => this.context.readProvider.getBlockHash('head')),
      share({ resetOnError: true, resetOnComplete: false, resetOnRefCountZero: true })
    );
    this.newBlockHash$ = polledBlockHash$.pipe(
      distinctUntilChanged(),
      share({ resetOnError: true, resetOnComplete: false, resetOnRefCountZero: true })
    );
    this.newBlock$ = defer(() => {
      let lastSuccessfulHash: string | undefined;
      return polledBlockHash$.pipe(
        exhaustMap((hash) =>
          hash === lastSuccessfulHash
            ? EMPTY
            : from(this.context.readProvider.getBlock(hash as BlockIdentifier)).pipe(
                tap(() => {
                  lastSuccessfulHash = hash;
                })
              )
        )
      );
    }).pipe(share({ resetOnError: true, resetOnComplete: false, resetOnRefCountZero: true }));
  }

  get config() {
    return this._config$.getValue();
  }

  private async getConfirmationPollingInterval() {
    if (!this.config.pollingIntervalMilliseconds) {
      const defaultIntervalTestnetsMainnet = 5000;
      const minimumPollingInterval = 700;
      try {
        const constants = await this.context.readProvider.getProtocolConstants('head');
        const blockTime = constants.minimal_block_delay
          ? constants.minimal_block_delay.multipliedBy(1000)
          : new BigNumber(defaultIntervalTestnetsMainnet);
        const confirmationPollingInterval = blockTime.dividedBy(3);

        this.config.pollingIntervalMilliseconds =
          confirmationPollingInterval.toNumber() === 0
            ? minimumPollingInterval
            : Math.max(confirmationPollingInterval.toNumber(), minimumPollingInterval);
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
      this.newBlockHash$,
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
