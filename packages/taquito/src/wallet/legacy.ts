import { Context } from '../context';
import { attachKind, OpKind } from '../operations/types';
import {
  WalletDelegateParams,
  WalletIncreasePaidStorageParams,
  WalletOriginateParams,
  WalletProvider,
  WalletTransferParams,
  WalletStakeParams,
  WalletUnstakeParams,
  WalletFinalizeUnstakeParams,
} from './interface';
import { WalletParamsWithKind } from './wallet';

export class LegacyWalletProvider implements WalletProvider {
  constructor(private context: Context) {}

  async getPKH(): Promise<string> {
    return this.context.signer.publicKeyHash();
  }

  async getPK(): Promise<string> {
    return this.context.signer.publicKey();
  }

  async mapTransferParamsToWalletParams(params: () => Promise<WalletTransferParams>) {
    return attachKind(await params(), OpKind.TRANSACTION);
  }

  async mapStakeParamsToWalletParams(params: () => Promise<WalletStakeParams>) {
    return attachKind(await params(), OpKind.TRANSACTION);
  }

  async mapUnstakeParamsToWalletParams(params: () => Promise<WalletUnstakeParams>) {
    return attachKind(await params(), OpKind.TRANSACTION);
  }

  async mapFinalizeUnstakeParamsToWalletParams(params: () => Promise<WalletFinalizeUnstakeParams>) {
    return attachKind(await params(), OpKind.TRANSACTION);
  }

  async mapOriginateParamsToWalletParams(params: () => Promise<WalletOriginateParams>) {
    return attachKind(await params(), OpKind.ORIGINATION);
  }

  async mapDelegateParamsToWalletParams(params: () => Promise<WalletDelegateParams>) {
    return attachKind(await params(), OpKind.DELEGATION);
  }

  async mapIncreasePaidStorageWalletParams(params: () => Promise<WalletIncreasePaidStorageParams>) {
    return attachKind(await params(), OpKind.INCREASE_PAID_STORAGE);
  }

  async sendOperations(params: WalletParamsWithKind[]) {
    const op = await this.context.batch.batch(params as any).send();
    return op.hash;
  }

  async sign(bytes: string, watermark?: Uint8Array) {
    const { prefixSig } = await this.context.signer.sign(bytes, watermark);
    return prefixSig;
  }
}
