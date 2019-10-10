import { Context } from '../context';
import { OperationContentsAndResult } from '@taquito/rpc';
import { ForgedBytes } from './types';

/**
 * @description Utility class to interact with Tezos operations
 */
export class Operation {
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
    // tslint:disable-next-line: no-floating-promises
    this.confirmation();
  }

  /**
   *
   * @param confirmations [0] Number of confirmation to wait for
   * @param interval [10] Polling interval
   * @param timeout [180] Timeout
   */
  confirmation(confirmations: number = 0, interval: number = 10, timeout: number = 180) {
    if (timeout <= 0) {
      throw new Error('Timeout must be more than 0');
    }

    if (interval <= 0) {
      throw new Error('Interval must be more than 0');
    }

    const timeoutAt = Math.ceil(timeout / interval) + 1;
    let count = 0;

    return new Promise((resolve, reject) => {
      const repeater = async () => {
        const head = await this.context.rpc.getBlock();
        count++;

        for (let i = 3; i >= 0; i--) {
          head.operations[i].forEach(op => {
            if (op.hash === this.hash) {
              this._foundAt = head.header.level;
            }
          });
        }

        if (head.header.level - this._foundAt >= confirmations) {
          resolve(this._foundAt);
        } else if (count >= timeoutAt) {
          reject(new Error('Timeout'));
        } else {
          setTimeout(repeater, interval * 1000);
        }
      };
      // tslint:disable-next-line: no-floating-promises
      repeater();
    });
  }
}
