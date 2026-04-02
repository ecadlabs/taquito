import { BlockResponse, OperationContentsAndResult, OperationResultStatusEnum } from '@taquito/rpc';
import { combineLatest, from, Observable, of, range, ReplaySubject } from 'rxjs';
import {
  catchError,
  concatMap,
  distinctUntilChanged,
  endWith,
  filter,
  first,
  map,
  share,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { Context } from '../context';
import { Receipt, receiptFromOperation } from './receipt';
import { validateOperation, ValidationResult } from '@taquito/utils';
import { BlockIdentifier } from '../read-provider/interface';
import { InvalidConfirmationCountError } from '../errors';
import { ConfirmationUndefinedError, ObservableError } from './errors';
import { InvalidOperationHashError } from '@taquito/core';

export type OperationStatus = 'pending' | 'unknown' | OperationResultStatusEnum;

const MAX_BRANCH_ANCESTORS = 60;
const walletOpTraceEnabled = /^(1|true)$/i.test(process?.env?.TAQUITO_OP_TRACE ?? '');
const walletOpTraceVerbose = /^(1|true)$/i.test(process?.env?.TAQUITO_OP_TRACE_VERBOSE ?? '');
const parsedWalletOpTraceSlowMs = Number(process?.env?.TAQUITO_OP_TRACE_SLOW_MS ?? '60000');
const walletOpTraceSlowMs =
  Number.isFinite(parsedWalletOpTraceSlowMs) && parsedWalletOpTraceSlowMs >= 0
    ? parsedWalletOpTraceSlowMs
    : 60000;

const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : undefined;

const getErrors = (value: unknown) => (Array.isArray(value) ? value : []);

const summarizeWalletOperationResults = (results?: OperationContentsAndResult[]) =>
  Array.isArray(results)
    ? results.map((result) => {
        const resultRecord = asRecord(result) ?? {};
        const metadata = asRecord(resultRecord.metadata);
        const operationResult = asRecord(metadata?.operation_result);
        return {
          kind: typeof resultRecord.kind === 'string' ? resultRecord.kind : 'unknown',
          status: typeof operationResult?.status === 'string' ? operationResult.status : 'unknown',
          errors: getErrors(operationResult?.errors),
          consumed_milligas:
            typeof operationResult?.consumed_milligas === 'string'
              ? operationResult.consumed_milligas
              : undefined,
        };
      })
    : [];

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
};

const traceWalletOperation = (payload: Record<string, unknown>) => {
  if (!walletOpTraceEnabled) {
    return;
  }
  // JSON logs are easier to aggregate when diagnosing flaky CI behavior.
  console.log(`[taquito:wallet-op-trace] ${JSON.stringify(payload)}`);
};

/**
 * WalletOperation allows to monitor operation inclusion on chains and surface information related to the operation
 */
export class WalletOperation {
  protected _operationResult = new ReplaySubject<OperationContentsAndResult[]>(1);
  protected _includedInBlock = new ReplaySubject<BlockResponse>(1);
  protected _included = false;

  private lastHead: BlockResponse | undefined;
  protected newHead$: Observable<BlockResponse> = this._newHead$.pipe(
    switchMap((newHead) => {
      const prevHead = this.lastHead?.header.level ?? newHead.header.level - 1;
      return range(prevHead + 1, newHead.header.level - prevHead - 1).pipe(
        concatMap((level) => this.context.readProvider.getBlock(level)),
        endWith(newHead)
      );
    }),
    tap((newHead) => (this.lastHead = newHead)),
    share({
      connector: () => new ReplaySubject(1),
      resetOnError: false,
      resetOnComplete: false,
      resetOnRefCountZero: true,
    })
  );

  // Observable that emit once operation is seen in a block
  private confirmed$ = this.newHead$.pipe(
    map((head) => {
      for (const opGroup of head.operations) {
        for (const op of opGroup) {
          if (op.hash === this.opHash) {
            this._included = true;
            this._includedInBlock.next(head);
            this._operationResult.next(op.contents as OperationContentsAndResult[]);

            // Return the block where the operation was found
            return head;
          }
        }
      }
    }),
    filter<BlockResponse | undefined, BlockResponse>((x): x is BlockResponse => {
      return typeof x !== 'undefined';
    }),
    first(),
    share({
      connector: () => new ReplaySubject(1),
      resetOnError: false,
      resetOnComplete: false,
      resetOnRefCountZero: true,
    })
  );

  async operationResults() {
    return this._operationResult.pipe(first()).toPromise();
  }

  protected async getInclusionBlock() {
    const inclusionBlock = await this._includedInBlock.pipe(first()).toPromise();
    if (!inclusionBlock) {
      throw new ObservableError('Inclusion block is undefined');
    }

    return inclusionBlock;
  }

  /**
   * Receipt expose the total amount of tezos token burn and spent on fees
   * The promise returned by receipt will resolve only once the transaction is included
   */
  async receipt(): Promise<Receipt> {
    const results = await this.operationResults();
    if (!results) {
      throw new ObservableError('Unable to get operation results');
    }
    return receiptFromOperation(results);
  }

  /**
   *
   * @param opHash Operation hash
   * @param context Taquito context allowing access to rpc and signer
   * @throws {InvalidOperationHashError}
   */
  constructor(
    public readonly opHash: string,
    protected readonly context: Context,
    private _newHead$: Observable<BlockResponse>
  ) {
    if (validateOperation(this.opHash) !== ValidationResult.VALID) {
      throw new InvalidOperationHashError(this.opHash);
    }
    this.confirmed$
      .pipe(
        first(),
        catchError(() => of(undefined))
      )
      .subscribe();
  }

  async getCurrentConfirmation() {
    if (!this._included) {
      return 0;
    }

    return combineLatest([this._includedInBlock, from(this.context.readProvider.getBlock('head'))])
      .pipe(
        map(([foundAtBlock, head]) => {
          return head.header.level - foundAtBlock.header.level + 1;
        }),
        first()
      )
      .toPromise();
  }

  async isInCurrentBranch(tipBlockIdentifier: BlockIdentifier = 'head') {
    // By default it is assumed that the operation is in the current branch
    if (!this._included) {
      return true;
    }

    const tipBlockHeaderLevel = await this.context.readProvider.getBlockLevel(tipBlockIdentifier);
    const inclusionBlock = await this.getInclusionBlock();
    const levelDiff = (tipBlockHeaderLevel - inclusionBlock.header.level) as number;

    // Block produced before the operation is included are assumed to be part of the current branch
    if (levelDiff <= 0) {
      return true;
    }

    const tipBlockLevel = Math.min(
      inclusionBlock.header.level + levelDiff,
      inclusionBlock.header.level + MAX_BRANCH_ANCESTORS
    );

    const blocks = new Set(await this.context.readProvider.getLiveBlocks(tipBlockLevel));
    return blocks.has(inclusionBlock.hash);
  }

  confirmationObservable(confirmations?: number) {
    if (typeof confirmations !== 'undefined' && confirmations < 1) {
      throw new InvalidConfirmationCountError(confirmations);
    }

    const { defaultConfirmationCount } = this.context.config;

    const conf = confirmations !== undefined ? confirmations : defaultConfirmationCount;

    if (conf === undefined) {
      throw new ConfirmationUndefinedError();
    }

    return combineLatest([this._includedInBlock, this.newHead$]).pipe(
      distinctUntilChanged(([, previousHead], [, newHead]) => {
        return previousHead.hash === newHead.hash;
      }),
      map(([foundAtBlock, head]) => {
        return {
          block: head,
          expectedConfirmation: conf,
          currentConfirmation: head.header.level - foundAtBlock.header.level + 1,
          completed: head.header.level - foundAtBlock.header.level >= conf - 1,
          isInCurrentBranch: () => this.isInCurrentBranch(head.hash as BlockIdentifier),
        };
      }),
      takeWhile(({ completed }) => !completed, true)
    );
  }

  /**
   *
   * @param confirmations [0] Number of confirmation to wait for
   */
  async confirmation(confirmations?: number) {
    const startedAt = Date.now();
    const expectedConfirmation = confirmations ?? this.context.config.defaultConfirmationCount;

    try {
      const confirmationResult = await this.confirmationObservable(confirmations).toPromise();
      const operationResults = await this.operationResults().catch(() => undefined);
      const summary = summarizeWalletOperationResults(operationResults);
      const nonAppliedStatuses = summary
        .filter((result) => result.status !== 'applied')
        .map((result) => result.status);
      const elapsedMs = Date.now() - startedAt;

      if (
        walletOpTraceVerbose ||
        elapsedMs >= walletOpTraceSlowMs ||
        nonAppliedStatuses.length > 0
      ) {
        traceWalletOperation({
          stage: 'confirmation-complete',
          opHash: this.opHash,
          elapsedMs,
          expectedConfirmation,
          currentConfirmation: confirmationResult?.currentConfirmation,
          completed: confirmationResult?.completed,
          statuses: summary.map((result) => result.status),
          results: summary,
        });
      }
      return confirmationResult;
    } catch (error: unknown) {
      const operationResults = await this.operationResults().catch(() => undefined);
      traceWalletOperation({
        stage: 'confirmation-error',
        opHash: this.opHash,
        elapsedMs: Date.now() - startedAt,
        expectedConfirmation,
        error: toErrorMessage(error),
        results: summarizeWalletOperationResults(operationResults),
      });
      throw error;
    }
  }
}
