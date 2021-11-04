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
  skipConstantExpansion = true;
  constructor(private context: Context) {}

  async getPKH(): Promise<string> {
    return this.context.signer.publicKeyHash();
  }

  async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>) {
    return attachKind(await params(), OpKind.TRANSACTION);
  }

  async mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>) {
    return attachKind(await params(), OpKind.ORIGINATION);
  }

  async mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>) {
    return attachKind(await params(), OpKind.DELEGATION);
  }

  async sendOperations(params: WalletParamsWithKind[]) {
    const op = await this.context.contract.batch(params as any).send();
    return op.hash;
  }
}
