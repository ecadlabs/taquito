import { BlockResponse, OperationEntry } from '@taquito/rpc';
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
import { Filter, SubscribeProvider, Subscription } from './interface';
import { ObservableSubscription } from './observable-subscription';

const getLastBlock = (context: Context) => {
  return from(context.rpc.getBlock()).pipe(first());
};

const applyFilter = (filter: Filter) =>
  concatMap<BlockResponse, ObservableInput<OperationEntry>>(block => {
    return new Observable<OperationEntry>(sub => {
      for (const ops of block.operations) {
        for (const op of ops) {
          if (evaluateFilter(op, filter)) {
            sub.next(op);
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
    return new ObservableSubscription(this.newBlock$.pipe(pluck('hash')));
  }

  subscribeOperation(filter: Filter): Subscription<OperationEntry> {
    return new ObservableSubscription(this.newBlock$.pipe(applyFilter(filter)));
  }
}
