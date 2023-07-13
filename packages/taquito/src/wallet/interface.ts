import {
  DelegateParams,
  FailingNoOpParams,
  IncreasePaidStorageParams,
  OriginateParams,
  TransferParams,
} from '../operations/types';

export type WalletDefinedFields = 'source';

export type WalletTransferParams = Omit<TransferParams, WalletDefinedFields>;

export type WalletOriginateParams<TStorage = any> = Omit<
  OriginateParams<TStorage>,
  WalletDefinedFields
>;

export type WalletDelegateParams = Omit<DelegateParams, WalletDefinedFields>;

export type WalletFailingNoOpParams = Omit<FailingNoOpParams, WalletDefinedFields>;

export type WalletIncreasePaidStorageParams = Omit<IncreasePaidStorageParams, WalletDefinedFields>;

export interface WalletProvider {
  /**
   * @description Request the public key hash from the wallet
   */
  getPKH: () => Promise<string>;

  /**
   * @description Transform WalletTransferParams into a format compliant with the underlying wallet
   */
  mapTransferParamsToWalletParams: (params: () => Promise<WalletTransferParams>) => Promise<any>;

  /**
   * @description Transform WalletOriginateParams into a format compliant with the underlying wallet
   */
  mapOriginateParamsToWalletParams: (params: () => Promise<WalletOriginateParams>) => Promise<any>;

  /**
   * @description Transform WalletDelegateParams into a format compliant with the underlying wallet
   */
  mapDelegateParamsToWalletParams: (params: () => Promise<WalletDelegateParams>) => Promise<any>;

  /**
   * @description Transform WalletIncreasePaidStorageParams into a format compliant with the underlying wallet
   */
  mapIncreasePaidStorageWalletParams: (
    params: () => Promise<WalletIncreasePaidStorageParams>
  ) => Promise<any>;

  /**
   * @description Transform WalletFailingNoOpParams into a format compliant with the underlying wallet
   */
  mapFailingNoOpParamsToWalletParams: (
    params: () => Promise<WalletFailingNoOpParams>
  ) => Promise<any>;

  /**
   * @description Request the wallet to send an operation batch
   */
  sendOperations: (params: any[]) => Promise<string>;
}
