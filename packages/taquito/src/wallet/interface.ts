import { DelegateParams, OriginateParams, TransferParams } from '../operations/types';

export type WalletDefinedFields = 'fee' | 'gasLimit' | 'storageLimit' | 'source';

export type WalletTransferParams = Omit<TransferParams, WalletDefinedFields>;

export type WalletOriginateParams = Omit<OriginateParams, WalletDefinedFields>;

export type WalletDelegateParams = Omit<DelegateParams, WalletDefinedFields>;

export interface WalletProvider {
  /**
   * @description Request the public key hash from the wallet
   */
  getPKH: () => Promise<string>;

  /**
   * @description Transform WalletTransferParams into a format compliant with the underlying wallet
   */
  mapTransferParamsToWalletParams: (params: WalletTransferParams) => Promise<any>;

  /**
   * @description Transform WalletOriginateParams into a format compliant with the underlying wallet
   */
  mapOriginateParamsToWalletParams: (params: WalletOriginateParams) => Promise<any>;

  /**
   * @description Transform WalletDelegateParams into a format compliant with the underlying wallet
   */
  mapDelegateParamsToWalletParams: (params: WalletDelegateParams) => Promise<any>;

  /**
   * @description Request the wallet to send an operation batch
   */
  sendOperations: (params: any[]) => Promise<string>;
}
