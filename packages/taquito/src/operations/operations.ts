import { BlockResponse, OperationContentsAndResult } from '@taquito/rpc';
import { defer, from, ReplaySubject, timer } from 'rxjs';
import { filter, first, map, mapTo, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Context } from '../context';
import { ForgedBytes } from './types';

interface PollingConfig {
  timeout: number;
  interval: number;
}

/**
 * @description Utility class to interact with Tezos operations
 */
export class Operation {
  private _pollingConfig$ = new ReplaySubject<PollingConfig>(1);

  private _currentHeadPromise: Promise<BlockResponse> | undefined = undefined;

  // Caching the current head for one second
  private currentHead$ = defer(() => {
    if (!this._currentHeadPromise) {
      this._currentHeadPromise = this.context.rpc.getBlock();
      timer(1000)
        .pipe(first())
        .subscribe(() => {
          this._currentHeadPromise = undefined;
        });
    }
    return from(this._currentHeadPromise);
  });

  // Polling observable that emit until timeout is reached
  private polling$ = defer(() =>
    this._pollingConfig$.pipe(
      tap(({ timeout, interval }) => {
        if (timeout <= 0) {
          throw new Error('Timeout must be more than 0');
        }

        if (interval <= 0) {
          throw new Error('Interval must be more than 0');
        }
      }),
      map(config => ({
        ...config,
        timeoutAt: Math.ceil(config.timeout / config.interval) + 1,
        count: 0,
      })),
      switchMap(config => timer(0, config.interval * 1000).pipe(mapTo(config))),
      tap(config => {
        config.count++;
        if (config.count > config.timeoutAt) {
          throw new Error(`Confirmation polling timed out`);
        }
      })
    )
  );

  // Observable that emit once operation is seen in a block
  private confirmed$ = this.polling$.pipe(
    switchMap(() => this.currentHead$),
    map(head => {
      for (let i = 3; i >= 0; i--) {
        head.operations[i].forEach(op => {
          if (op.hash === this.hash) {
            this._foundAt = head.header.level;
          }
        });
      }

      if (head.header.level - this._foundAt >= 0) {
        return this._foundAt;
      }
    }),
    filter(x => x !== undefined),
    first(),
    shareReplay()
  );

  protected _foundAt = Number.POSITIVE_INFINITY;
  get includedInBlock() {
    return this._foundAt;
  }
  /**
   *
   * @param hash Operation hash
   * @param raw Raw operation that was injected
   * @param context Taquito context allowing access to rpc and signer
   */
  constructor(
    public readonly hash: string,
    public readonly raw: ForgedBytes,
    public readonly results: OperationContentsAndResult[],
    protected readonly context: Context
  ) {
    this.confirmed$.pipe(first()).subscribe();
  }

  /**
   *
   * @param confirmations [0] Number of confirmation to wait for
   * @param interval [10] Polling interval
   * @param timeout [180] Timeout
   */
  confirmation(confirmations?: number, interval?: number, timeout?: number) {
    const {
      defaultConfirmationCount,
      confirmationPollingIntervalSecond,
      confirmationPollingTimeoutSecond,
    } = this.context.config;
    this._pollingConfig$.next({
      interval: interval || confirmationPollingIntervalSecond,
      timeout: timeout || confirmationPollingTimeoutSecond,
    } as Required<PollingConfig>);

    const conf = confirmations !== undefined ? confirmations : defaultConfirmationCount;

    return new Promise<number>((resolve, reject) => {
      this.confirmed$
        .pipe(
          switchMap(() => this.polling$),
          switchMap(() => this.currentHead$),
          filter(head => head.header.level - this._foundAt >= conf),
          first()
        )
        .subscribe(_ => {
          resolve(this._foundAt + conf);
        }, reject);
    });
  }
}
