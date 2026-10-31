import { OpKind } from '@taquito/rpc';
import { WalletOperation, OperationStatus } from './operation';
import { ObservableError } from './errors';

export class SmartRollupAddMessagesWalletOperation extends WalletOperation {
  async revealOperation() {
    const results = await this.operationResults();
    if (!results) throw new ObservableError('Unable to fetch operation results');
    return results.find((result) => result.kind === OpKind.REVEAL);
  }

  async smartRollupAddMessagesOperation() {
    const results = await this.operationResults();
    if (!results) throw new ObservableError('Unable to fetch operation results');
    return results.find((result) => result.kind === OpKind.SMART_ROLLUP_ADD_MESSAGES);
  }

  async status(): Promise<OperationStatus> {
    if (!this._included) return 'pending';
    const operation = await this.smartRollupAddMessagesOperation();
    return operation?.metadata.operation_result.status ?? 'unknown';
  }
}
