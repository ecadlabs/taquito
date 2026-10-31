import { OpKind } from '@taquito/rpc';
import { WalletOperation, OperationStatus } from './operation';
import { ObservableError } from './errors';

export class SmartRollupOriginateWalletOperation extends WalletOperation {
  async revealOperation() {
    const results = await this.operationResults();
    if (!results) throw new ObservableError('Unable to fetch operation results');
    return results.find((result) => result.kind === OpKind.REVEAL);
  }

  async smartRollupOriginateOperation() {
    const results = await this.operationResults();
    if (!results) throw new ObservableError('Unable to fetch operation results');
    return results.find((result) => result.kind === OpKind.SMART_ROLLUP_ORIGINATE);
  }

  async status(): Promise<OperationStatus> {
    if (!this._included) return 'pending';
    const operation = await this.smartRollupOriginateOperation();
    return operation?.metadata.operation_result.status ?? 'unknown';
  }

  /** Address of the originated rollup, once included. */
  async rollupAddress(): Promise<string | undefined> {
    const operation = await this.smartRollupOriginateOperation();
    return operation?.metadata.operation_result.address;
  }
}
