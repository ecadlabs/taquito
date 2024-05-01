import {
  DelegateParams,
  FailingNoopParams,
  IncreasePaidStorageParams,
  OriginateParams,
  TransferParams,
  StakeParams,
  UnstakeParams,
  FinalizeUnstakeParams,
} from '../operations/types';

export type WalletDefinedFields = 'source';

export type WalletTransferParams = Omit<TransferParams, WalletDefinedFields>;

export type WalletStakeParams = Omit<StakeParams, WalletDefinedFields>;

export type WalletUnstakeParams = Omit<UnstakeParams, WalletDefinedFields>;

export type WalletFinalizeUnstakeParams = Omit<FinalizeUnstakeParams, WalletDefinedFields>;

export type WalletOriginateParams<TStorage = any> = Omit<
  OriginateParams<TStorage>,
  WalletDefinedFields
>;

export type WalletDelegateParams = Omit<DelegateParams, WalletDefinedFields>;

export type WalletFailingNoopParams = Omit<FailingNoopParams, WalletDefinedFields>;

export type WalletIncreasePaidStorageParams = Omit<IncreasePaidStorageParams, WalletDefinedFields>;

export interface WalletProvider {
  /**
   * @description Request the public key hash from the wallet
   */
  getPKH: () => Promise<string>;

  /**
   * @description Get the public key from the wallet
   */
  getPK: () => Promise<string>;

  /**
   * @description Transform WalletTransferParams into a format compliant with the underlying wallet
   */
  mapTransferParamsToWalletParams: (params: () => Promise<WalletTransferParams>) => Promise<any>;

  /**
   * @description Transform WalletStakeParams into a format compliant with the underlying wallet
   */
  mapStakeParamsToWalletParams: (params: () => Promise<WalletStakeParams>) => Promise<any>;

  /**
   * @description Transform WalletUnstakeParams into a format compliant with the underlying wallet
   */
  mapUnstakeParamsToWalletParams: (params: () => Promise<WalletUnstakeParams>) => Promise<any>;

  /**
   * @description Transform WalletFinalizeUnstakeParams into a format compliant with the underlying wallet
   */
  mapFinalizeUnstakeParamsToWalletParams: (
    params: () => Promise<WalletFinalizeUnstakeParams>
  ) => Promise<any>;

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
   * @description Request the wallet to send an operation batch
   */
  sendOperations: (params: any[]) => Promise<string>;

  /**
   * @description Request the wallet to sign a payload
   */
  sign(bytes: string, watermark?: Uint8Array): Promise<string>;
}
