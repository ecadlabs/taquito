import { BlockResponse } from '@taquito/rpc';
import { from, Observable, ObservableInput, timer } from 'rxjs';
import {
  concatMap,
  distinctUntilKeyChanged,
  first,
  map,
  pluck,
  publishReplay,
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
  private newBlock$ = timer(0, this.POLL_INTERVAL).pipe(
    map(() => this.context),
    switchMap(getLastBlock),
    distinctUntilKeyChanged('hash'),
    publishReplay(),
    refCount()
  );

  constructor(private context: Context, public readonly POLL_INTERVAL = 20000) {}

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
