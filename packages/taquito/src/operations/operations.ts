import {
  BlockResponse,
  OperationContentsAndResult,
  OperationContentsAndResultReveal,
} from '@taquito/rpc';
import { BehaviorSubject, defer, EMPTY, of, range, ReplaySubject, throwError } from 'rxjs';
import {
  catchError,
  concatMap,
  endWith,
  filter,
  first,
  map,
  shareReplay,
  switchMap,
  tap,
  timeoutWith,
} from 'rxjs/operators';
import { Context } from '../context';
import { ForgedBytes, hasMetadataWithResult } from './types';
import { validateOperation, ValidationResult } from '@taquito/utils';
import { InvalidOperationHashError } from '@taquito/core';
import { createObservableFromSubscription } from '../subscribe/create-observable-from-subscription';
import { InvalidConfirmationCountError } from '../error';

interface PollingConfig {
  timeout: number;
  interval: number;
}

/**
 * @description Utility class to interact with Tezos operations
 */
export class Operation {
  private _pollingConfig$ = new ReplaySubject<PollingConfig>(1);
  private lastHead: BlockResponse | undefined;

  private currentHead$ = this._pollingConfig$.pipe(
    switchMap((config) => {
      return new BehaviorSubject(config).pipe(
        timeoutWith(config.timeout * 1000, throwError(new Error('Confirmation polling timed out')))
      );
    }),
    switchMap(() => {
      return defer(() =>
        createObservableFromSubscription(this.context.stream.subscribeBlock('head'))
      ).pipe(
        switchMap((newHead) => {
          const prevHead = this.lastHead?.header.level ?? newHead.header.level - 1;
          return range(prevHead + 1, newHead.header.level - prevHead - 1).pipe(
            concatMap((level) => this.context.readProvider.getBlock(level)),
            endWith(newHead)
          );
        }),
        tap((newHead) => (this.lastHead = newHead))
      );
    }),
    shareReplay({ refCount: true })
  );

  // Observable that emit once operation is seen in a block
  private confirmed$ = this.currentHead$.pipe(
    map((head) => {
      for (let i = 3; i >= 0; i--) {
        head.operations[i].forEach((op) => {
          if (op.hash === this.hash) {
            this._foundAt = head.header.level;
          }
        });
      }

      if (head.header.level - this._foundAt >= 0) {
        return this._foundAt;
      }
    }),
    filter((x) => x !== undefined),
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
    if (validateOperation(this.hash) !== ValidationResult.VALID) {
      throw new InvalidOperationHashError(this.hash);
    }

    this.confirmed$
      .pipe(
        first(),
        catchError(() => {
          return of(EMPTY);
        })
      )
      .subscribe();
  }

  get revealOperation() {
    return (
      Array.isArray(this.results) &&
      (this.results.find((op) => op.kind === 'reveal') as
        | OperationContentsAndResultReveal
        | undefined)
    );
  }

  public get revealStatus() {
    if (this.revealOperation) {
      return this.revealOperation.metadata.operation_result.status;
    } else {
      return 'unknown';
    }
  }

  public get status() {
    return (
      this.results.map((result) => {
        if (hasMetadataWithResult(result)) {
          return result.metadata.operation_result.status;
        } else {
          return 'unknown';
        }
      })[0] || 'unknown'
    );
  }

  /**
   *
   * @param confirmations [0] Number of confirmation to wait for
   * @param timeout [180] Timeout
   */
  async confirmation(confirmations?: number, timeout?: number) {
    if (typeof confirmations !== 'undefined' && confirmations < 1) {
      throw new InvalidConfirmationCountError('Confirmation count must be at least 1');
    }

    const { defaultConfirmationCount, confirmationPollingTimeoutSecond } = this.context.config;
    this._pollingConfig$.next({
      timeout: timeout || confirmationPollingTimeoutSecond,
    } as Required<PollingConfig>);

    const conf = confirmations !== undefined ? confirmations : defaultConfirmationCount;

    return new Promise<number>((resolve, reject) => {
      this.confirmed$
        .pipe(
          switchMap(() => this.currentHead$),
          filter((head) => head.header.level - this._foundAt >= conf - 1),
          first()
        )
        .subscribe((_) => {
          resolve(this._foundAt + (conf - 1));
        }, reject);
    });
  }
}
