import {
  BlockResponse,
  OperationContentsAndResult,
  OperationContentsAndResultReveal,
  OperationResult,
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
  timeout,
} from 'rxjs/operators';
import { Context } from '../context';
import { ForgedBytes, hasMetadataWithResult } from './types';
import { validateOperation, ValidationResult } from '@taquito/utils';
import { createObservableFromSubscription } from '../subscribe/create-observable-from-subscription';
import { ConfirmationTimeoutError, InvalidConfirmationCountError } from '../errors';
import { InvalidOperationHashError } from '@taquito/core';

const opTraceEnabled = /^(1|true)$/i.test(process?.env?.TAQUITO_OP_TRACE ?? '');
const opTraceVerbose = /^(1|true)$/i.test(process?.env?.TAQUITO_OP_TRACE_VERBOSE ?? '');
const parsedOpTraceSlowMs = Number(process?.env?.TAQUITO_OP_TRACE_SLOW_MS ?? '60000');
const opTraceSlowMs =
  Number.isFinite(parsedOpTraceSlowMs) && parsedOpTraceSlowMs >= 0 ? parsedOpTraceSlowMs : 60000;

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : undefined;

const getErrors = (value: unknown) => (Array.isArray(value) ? value : []);

const summarizeOperationResults = (results: OperationContentsAndResult[]) =>
  results.map((result) => {
    const resultRecord = asRecord(result) ?? {};
    const metadata = asRecord(resultRecord.metadata);
    const operationResult = asRecord(metadata?.operation_result);
    const internalOperationResults = metadata?.internal_operation_results;
    const internalFailures = Array.isArray(internalOperationResults)
      ? internalOperationResults.reduce<Array<{ kind: string; status: string; errors: unknown[] }>>(
          (acc, internalResult) => {
            const internalResultRecord = asRecord(internalResult);
            const internalResultPayload = asRecord(internalResultRecord?.result);
            const status = internalResultPayload?.status;
            if (typeof status !== 'string' || status === 'applied') {
              return acc;
            }

            acc.push({
              kind:
                typeof internalResultRecord?.kind === 'string'
                  ? internalResultRecord.kind
                  : 'unknown',
              status,
              errors: getErrors(internalResultPayload?.errors),
            });
            return acc;
          },
          []
        )
      : [];

    return {
      kind: typeof resultRecord.kind === 'string' ? resultRecord.kind : 'unknown',
      status: typeof operationResult?.status === 'string' ? operationResult.status : 'unknown',
      errors: getErrors(operationResult?.errors),
      consumed_milligas:
        typeof operationResult?.consumed_milligas === 'string'
          ? operationResult.consumed_milligas
          : undefined,
      internalFailures,
    };
  });

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
};

const traceOperation = (payload: Record<string, unknown>) => {
  if (!opTraceEnabled) {
    return;
  }
  // JSON logs make post-run parsing for flaky tests straightforward.
  console.log(`[taquito:op-trace] ${JSON.stringify(payload)}`);
};

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
        timeout({
          each: config.timeout * 1000,
          with: () =>
            throwError(() => new ConfirmationTimeoutError(`Confirmation polling timed out`)),
        })
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
   * @throws {@link InvalidOperationHashError}
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
          return (result.metadata.operation_result as OperationResult).status;
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
      throw new InvalidConfirmationCountError(confirmations);
    }

    const { defaultConfirmationCount, confirmationPollingTimeoutSecond } = this.context.config;
    const timeoutSeconds = timeout || confirmationPollingTimeoutSecond;
    const startedAt = Date.now();
    this._pollingConfig$.next({
      timeout: timeoutSeconds,
    } as Required<PollingConfig>);

    const conf = confirmations !== undefined ? confirmations : defaultConfirmationCount;

    return new Promise<number>((resolve, reject) => {
      this.confirmed$
        .pipe(
          switchMap(() => this.currentHead$),
          filter((head) => head.header.level - this._foundAt >= conf - 1),
          first()
        )
        .subscribe({
          error: (e) => {
            traceOperation({
              stage: 'confirmation-error',
              hash: this.hash,
              elapsedMs: Date.now() - startedAt,
              expectedConfirmations: conf,
              timeoutSec: timeoutSeconds,
              includedInBlock: Number.isFinite(this._foundAt) ? this._foundAt : null,
              status: this.status,
              error: toErrorMessage(e),
              results: summarizeOperationResults(this.results),
            });
            reject(e);
          },
          complete: () => {
            const elapsedMs = Date.now() - startedAt;
            if (opTraceVerbose || elapsedMs >= opTraceSlowMs || this.status !== 'applied') {
              traceOperation({
                stage: 'confirmation-complete',
                hash: this.hash,
                elapsedMs,
                expectedConfirmations: conf,
                timeoutSec: timeoutSeconds,
                includedInBlock: Number.isFinite(this._foundAt) ? this._foundAt : null,
                status: this.status,
                results: summarizeOperationResults(this.results),
              });
            }
            resolve(this._foundAt + (conf - 1));
          },
        });
    });
  }
}
