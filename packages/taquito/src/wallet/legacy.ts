import { attachKind, OpKind } from '../operations/types';
import {
  WalletTransferParams,
  WalletOriginateParams,
  WalletDelegateParams,
  WalletProvider,
} from './interface';
import { WalletParamsWithKind } from './wallet';
import { Context } from '../context';
import { RPCBatchProvider } from '../batch/rpc-batch-provider';

export class LegacyWalletProvider implements WalletProvider {
  constructor(private context: Context, private batch: RPCBatchProvider) {}

  async getPKH(): Promise<string> {
    return this.context.signer.publicKeyHash();
  }

  async mapTransferParamsToWalletParams(params: WalletTransferParams) {
    return attachKind(params, OpKind.TRANSACTION);
  }

  async mapOriginateParamsToWalletParams(params: WalletOriginateParams) {
    return attachKind(params, OpKind.ORIGINATION);
  }

  async mapDelegateParamsToWalletParams(params: WalletDelegateParams) {
    return attachKind(params, OpKind.DELEGATION);
  }

  async sendOperations(params: WalletParamsWithKind[]) {
    const op = await this.batch.batch(params as any).send();
    return op.hash;
  }
}
