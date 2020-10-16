import { Context } from '../context';
import { attachKind, OpKind } from '../operations/types';
import {
  WalletDelegateParams,
  WalletOriginateParams,
  WalletProvider,
  WalletTransferParams,
} from './interface';
import { WalletParamsWithKind } from './wallet';

export class LegacyWalletProvider implements WalletProvider {
  constructor(private context: Context) {}

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
    const op = await this.context.batch.batch(params as any).send();
    return op.hash;
  }
}
