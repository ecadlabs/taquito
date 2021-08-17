import { BlockResponse } from '@taquito/rpc';
import { from, Observable, ObservableInput, timer } from 'rxjs';
import {
  concatMap,
  distinctUntilKeyChanged,
  first,
  map,
  pluck,
  publish,
  refCount,
  switchMap,
} from 'rxjs/operators';
import { Context } from '../context';
import { evaluateFilter } from './filters';
import { Filter, SubscribeProvider, Subscription, OperationContent } from './interface';
import { ObservableSubscription } from './observable-subscription';

const getLastBlock = (context: Context) => {
  return from(context.rpc.getBlock()).pipe(first());
};

const applyFilter = (filter: Filter) =>
  concatMap<BlockResponse, ObservableInput<OperationContent>>(block => {
    return new Observable<OperationContent>(sub => {
      for (const ops of block.operations) {
        for (const op of ops) {
          for (const content of op.contents) {
            if (evaluateFilter({hash: op.hash, ...content}, filter)) {
              sub.next({hash: op.hash, ...content});
            }
          }
        }
      }
      sub.complete();
    });
  });

export class PollingSubscribeProvider implements SubscribeProvider {
  // Map the changing polling interval to a timer, which will automatically terminate the previous timer when the next one starts.
  private timer$ = this.context._config.pipe(
    switchMap((val) => timer(0, val.streamerPollingIntervalMilliseconds)),
  )

  private newBlock$ = this.timer$.pipe(
    map(() => this.context),
    switchMap(getLastBlock),
    distinctUntilKeyChanged('hash'),
    publish(),
    refCount()
  );

  constructor(private context: Context) { }

  subscribe(_filter: 'head'): Subscription<string> {
    return new ObservableSubscription(this.newBlock$.pipe(pluck('hash')), 
                                      this.context.config.shouldObservableSubscriptionRetry,
                                      this.context.config.observableSubscriptionRetryFunction);
  }

  subscribeOperation(filter: Filter): Subscription<OperationContent> {
    return new ObservableSubscription(this.newBlock$.pipe(applyFilter(filter)),
                                      this.context.config.shouldObservableSubscriptionRetry,
                                      this.context.config.observableSubscriptionRetryFunction);
  }
}
