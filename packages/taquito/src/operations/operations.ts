import {
  BlockResponse,
  OperationContentsAndResult,
  OperationContentsAndResultReveal,
  OperationResult,
} from '@taquito/rpc';
import {
  BehaviorSubject,
  defer,
  EMPTY,
  firstValueFrom,
  of,
  range,
  ReplaySubject,
  throwError,
} from 'rxjs';
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
import { isBlockHashIdentifier } from '../read-provider/interface';
import { OperationReorgError } from './errors';

const env = typeof process !== 'undefined' ? process.env : undefined;

const opTraceEnabled = /^(1|true)$/i.test(env?.TAQUITO_OP_TRACE ?? '');
const opTraceVerbose = /^(1|true)$/i.test(env?.TAQUITO_OP_TRACE_VERBOSE ?? '');
const parsedOpTraceSlowMs = Number(env?.TAQUITO_OP_TRACE_SLOW_MS ?? '60000');
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

// Limit the work performed for one mismatched head, including for old operation objects.
const REINCLUSION_SEARCH_BLOCKS = 120;

// A head and the inclusion block that its branch was checked against.
interface BranchEvidence {
  head: BlockResponse;
  inclusion: BlockResponse;
}

const isSameOrChildOf = (head: BlockResponse, previous: BlockResponse | undefined) =>
  previous !== undefined &&
  (head.hash === previous.hash || head.header.predecessor === previous.hash);

interface PollingConfig {
  timeout: number;
  interval: number;
}

/**
 * Utility class to interact with Tezos operations
 */
export class Operation {
  private _pollingConfig$ = new ReplaySubject<PollingConfig>(1);
  private lastHead: BlockResponse | undefined;
  private lastObservedHeadHash: string | undefined;
  protected _includedInBlock = new ReplaySubject<BlockResponse>(1);

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
        tap((head) => (this.lastObservedHeadHash = head.hash)),
        // Finish each backfill before handling another head, even when reads take longer than a block.
        concatMap((newHead) => {
          const observed = { block: newHead, observed: true };
          if (Number.isFinite(this._foundAt)) return of(observed);
          return defer(async () => {
            if (this.lastHead) {
              return this.lastHead.header.level;
            }

            // Inclusion must follow the forged branch, which predates injection and observation.
            const branch = this.raw.opOb?.branch;
            return branch && isBlockHashIdentifier(branch)
              ? this.context.readProvider.getBlockLevel(branch)
              : newHead.header.level - 1;
          }).pipe(
            concatMap((prevHead) => {
              const missed = newHead.header.level - prevHead - 1;
              if (Number.isFinite(this._foundAt) || missed <= 0) {
                return of(observed);
              }
              const hash = newHead.hash;
              if (!isBlockHashIdentifier(hash)) {
                throw new Error('Cannot backfill confirmation with an invalid head block hash');
              }
              return range(prevHead + 1, missed).pipe(
                concatMap((level) =>
                  this.context.readProvider.getBlock(`${hash}~${newHead.header.level - level}`)
                ),
                map((block) => ({ block, observed: false })),
                endWith(observed)
              );
            }),
            catchError((error: unknown) =>
              newHead.hash === this.lastObservedHeadHash ? throwError(() => error) : EMPTY
            )
          );
        }),
        tap(({ block, observed }) => {
          if (observed) this.lastHead = block;
        })
      );
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Observable that emit once operation is seen in a block
  private confirmed$ = this.currentHead$.pipe(
    map(({ block: head }) => {
      for (let i = head.operations.length - 1; i >= 0; i--) {
        for (const op of head.operations[i]) {
          if (op.hash === this.hash) {
            this._foundAt = head.header.level;
            this._includedInBlock.next(head);
            return this._foundAt;
          }
        }
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

  protected async getInclusionBlock() {
    const inclusionBlock = await firstValueFrom(this._includedInBlock.pipe(first()), {
      defaultValue: undefined,
    });
    if (!inclusionBlock) {
      throw new Error('Inclusion block is undefined');
    }

    return inclusionBlock;
  }

  private includesOperation(block: BlockResponse) {
    return block.operations.some((pass) => pass.some((operation) => operation.hash === this.hash));
  }

  // Finds the inclusion on the head's branch. Without one, `searchedToBranch` says whether the
  // walk reached the forged branch block, which proves that the whole branch omits the operation.
  private async findConfirmationInclusion(
    head: BlockResponse,
    recordedInclusion: BlockResponse
  ): Promise<{ inclusion?: BlockResponse; searchedToBranch: boolean }> {
    const distance = head.header.level - recordedInclusion.header.level;
    const found = (inclusion: BlockResponse) => ({ inclusion, searchedToBranch: true });
    if (distance === 0 && head.hash === recordedInclusion.hash) return found(recordedInclusion);
    if (distance === 1 && head.header.predecessor === recordedInclusion.hash) {
      return found(recordedInclusion);
    }
    if (distance > 1) {
      if (!isBlockHashIdentifier(head.hash)) {
        throw new Error('Cannot verify confirmation with an invalid head block hash');
      }
      const ancestor = await this.context.readProvider.getBlockHash(`${head.hash}~${distance}`);
      if (ancestor === recordedInclusion.hash) return found(recordedInclusion);
    }

    const branch = this.raw.opOb?.branch;
    let block = head;
    for (let remaining = REINCLUSION_SEARCH_BLOCKS; remaining > 0; remaining--) {
      if (block.hash === branch || block.header.level <= 0) return { searchedToBranch: true };
      if (this.includesOperation(block)) return found(block);
      const predecessor = block.header.predecessor;
      if (branch && predecessor === branch) return { searchedToBranch: true };
      if (remaining === 1) break;
      if (!isBlockHashIdentifier(predecessor)) {
        throw new Error('Cannot verify confirmation with an invalid predecessor block hash');
      }
      const parent = await this.context.readProvider.getBlock(predecessor);
      if (parent.hash !== predecessor || parent.header.level !== block.header.level - 1) {
        throw new Error('The read provider returned an inconsistent predecessor block');
      }
      block = parent;
    }

    return { searchedToBranch: false };
  }

  /**
   *
   * @param hash Operation hash
   * @param raw Raw operation that was injected
   * @param context Taquito context allowing access to rpc and signer
   * @throws InvalidOperationHashError
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
        OperationContentsAndResultReveal | undefined)
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

    let verified: BranchEvidence | undefined;
    // Set while the branch of `head` omits the operation. `inclusion` is the dropped inclusion.
    let orphaned: (BranchEvidence & { searchedToBranch: boolean }) | undefined;
    return new Promise<number>((resolve, reject) => {
      this.confirmed$
        .pipe(
          switchMap(() => this.currentHead$),
          // Backfilled blocks can discover an inclusion, but only observed tips confirm it.
          filter(({ observed }) => observed),
          concatMap(async ({ block: head }) => {
            const extendsVerifiedHead = isSameOrChildOf(head, verified?.head);
            // The shortcut needs proof that the whole branch of the orphaned head omits the operation.
            const extendsOrphanedHead =
              orphaned?.searchedToBranch === true && isSameOrChildOf(head, orphaned.head);
            if (
              head.hash !== this.lastObservedHeadHash &&
              !extendsVerifiedHead &&
              !extendsOrphanedHead
            ) {
              return undefined;
            }
            try {
              let inclusion: BlockResponse | undefined;
              let recordedInclusion: BlockResponse;
              let searchedToBranch = true;
              if (verified !== undefined && extendsVerifiedHead) {
                inclusion = verified.inclusion;
                recordedInclusion = verified.inclusion;
              } else if (orphaned !== undefined && extendsOrphanedHead) {
                // The predecessor's branch omits the operation, so only this head can add it.
                inclusion = this.includesOperation(head) ? head : undefined;
                recordedInclusion = orphaned.inclusion;
              } else {
                recordedInclusion =
                  verified?.inclusion ?? orphaned?.inclusion ?? (await this.getInclusionBlock());
                // A head below the inclusion comes from a node that is behind, not from a reorg.
                if (head.header.level < recordedInclusion.header.level) return undefined;
                ({ inclusion, searchedToBranch } = await this.findConfirmationInclusion(
                  head,
                  recordedInclusion
                ));
              }
              if (inclusion === undefined) {
                // Wait for re-inclusion. The timeout reports OperationReorgError while this is set.
                verified = undefined;
                orphaned = { head, inclusion: recordedInclusion, searchedToBranch };
                return undefined;
              }
              // Keep branch evidence for this caller even if a newer head arrived during the read.
              // Only the latest observed head can publish the inclusion or resolve confirmation.
              orphaned = undefined;
              verified = { head, inclusion };
              return verified;
            } catch (error) {
              if (head.hash === this.lastObservedHeadHash) throw error;
              return undefined;
            }
          }),
          filter((match) => match !== undefined),
          filter(({ head }) => head.hash === this.lastObservedHeadHash),
          tap((match) => {
            this._foundAt = match.inclusion.header.level;
            this._includedInBlock.next(match.inclusion);
          }),
          map(({ head, inclusion }) =>
            head.header.level - inclusion.header.level >= conf - 1
              ? inclusion.header.level + conf - 1
              : undefined
          ),
          filter((level) => level !== undefined),
          first()
        )
        .subscribe({
          error: (cause) => {
            const e =
              cause instanceof ConfirmationTimeoutError &&
              orphaned?.searchedToBranch === true &&
              orphaned.head.hash === this.lastObservedHeadHash
                ? new OperationReorgError(this.hash, orphaned.inclusion.hash, orphaned.head.hash)
                : cause;
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
          next: (level) => {
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
            resolve(level);
          },
        });
    });
  }
}
