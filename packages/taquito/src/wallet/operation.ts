import { BlockResponse, OperationContentsAndResult, OperationResultStatusEnum } from '@taquito/rpc';
import { combineLatest, from, Observable, ReplaySubject, throwError } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  first,
  map,
  shareReplay,
  takeWhile,
  tap,
} from 'rxjs/operators';
import { Context } from '../context';
import { Receipt, receiptFromOperation } from './receipt';

export type OperationStatus = 'pending' | 'unknown' | OperationResultStatusEnum;

export class MissedBlockDuringConfirmationError implements Error {
  name: string = 'MissedBlockDuringConfirmationError';
  message: string =
    'Taquito missed a block while waiting for operation confirmation and was not able to find the operation';
}

const MAX_BRANCH_ANCESTORS = 60;

/**
 * @description WalletOperation allows to monitor operation inclusion on chains and surface information related to the operation
 */
export class WalletOperation {
  protected _operationResult = new ReplaySubject<OperationContentsAndResult[]>(1);
  protected _includedInBlock = new ReplaySubject<BlockResponse>(1);
  protected _included = false;

  private lastHead: BlockResponse | undefined;
  protected newHead$: Observable<BlockResponse> = this._newHead$.pipe(
    tap(newHead => {
      if (
        !this._included &&
        this.lastHead &&
        newHead.header.level - this.lastHead.header.level > 1
      ) {
        throw new MissedBlockDuringConfirmationError();
      }

      this.lastHead = newHead;
    }),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  // Observable that emit once operation is seen in a block
  private confirmed$ = this.newHead$.pipe(
    map(head => {
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
    shareReplay({ bufferSize: 1, refCount: true })
  );

  async operationResults() {
    return this._operationResult.pipe(first()).toPromise();
  }

  /**
   * @description Receipt expose the total amount of tezos token burn and spent on fees
   * The promise returned by receipt will resolve only once the transaction is included
   */
  async receipt(): Promise<Receipt> {
    const operationResults = await this.operationResults();
    if (!operationResults) {
      throw new Error('Operation and results found to be undefined!');
    }
    return receiptFromOperation(operationResults);
  }

  /**
   *
   * @param opHash Operation hash
   * @param raw Raw operation that was injected
   * @param context Taquito context allowing access to rpc and signer
   */
  constructor(
    public readonly opHash: string,
    protected readonly context: Context,
    private _newHead$: Observable<BlockResponse>
  ) {
    this.confirmed$.pipe(first()).subscribe();
  }

  async getCurrentConfirmation() {
    if (!this._included) {
      return 0;
    }

    return combineLatest([this._includedInBlock, from(this.context.rpc.getBlock())])
      .pipe(
        map(([foundAtBlock, head]) => {
          return head.header.level - foundAtBlock.header.level + 1;
        }),
        first()
      )
      .toPromise();
  }

  async isInCurrentBranch(tipBlockIdentifier: string = 'head') {
    // By default it is assumed that the operation is in the current branch
    if (!this._included) {
      return true;
    }

    const tipBlockHeader = await this.context.rpc.getBlockHeader({ block: tipBlockIdentifier });
    const inclusionBlock = await this._includedInBlock.pipe(first()).toPromise();

    if(!inclusionBlock) {
      throw new Error('Inclusion block found to be undefined!');
    }

    const levelDiff = tipBlockHeader.level - inclusionBlock.header.level;

    // Block produced before the operation is included are assumed to be part of the current branch
    if (levelDiff <= 0) {
      return true;
    }

    const tipBlockLevel = Math.min(
      inclusionBlock.header.level + levelDiff,
      inclusionBlock.header.level + MAX_BRANCH_ANCESTORS
    );

    const blocks = new Set(await this.context.rpc.getLiveBlocks({ block: String(tipBlockLevel) }));
    return blocks.has(inclusionBlock.hash);
  }

  confirmationObservable(confirmations?: number) {
    if (typeof confirmations !== 'undefined' && confirmations < 1) {
      throw new Error('Confirmation count must be at least 1');
    }

    const { defaultConfirmationCount } = this.context.config;

    const conf = confirmations !== undefined ? confirmations : defaultConfirmationCount;

    if (conf === undefined) {
      throw new Error('Default confirmation count can not be undefined!');
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
          isInCurrentBranch: () => this.isInCurrentBranch(head.hash),
        };
      }),
      takeWhile(({ completed }) => !completed, true)
    );
  }

  /**
   *
   * @param confirmations [0] Number of confirmation to wait for
   */
  confirmation(confirmations?: number) {
    return this.confirmationObservable(confirmations).toPromise();
  }
}
