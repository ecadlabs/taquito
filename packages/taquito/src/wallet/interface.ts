import { ContractSchema, WalletContract } from "../contract";
import { DelegateParams, OriginateParams, TransferParams } from "../operations/types";
import { WalletOperation } from "./operation";
import { OriginationWalletOperation } from "./origination-operation";
import { DelegationWalletOperation } from "./delegation-operation";

export interface PKHOption {
  forceRefetch?: boolean
}

export type WalletDefinedFields = 'fee' | 'gasLimit' | 'storageLimit' | 'source'

export type WalletTransferParams = Omit<TransferParams, WalletDefinedFields>

export type WalletOriginateParams = Omit<OriginateParams, WalletDefinedFields>

export type WalletDelegateParams = Omit<DelegateParams, WalletDefinedFields>

export interface WalletProvider {

  pkh(option?: PKHOption): Promise<string>;

  /**
   *
   * @description Originate a new contract according to the script in parameters.
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param originateParams Originate operation parameter
   */
  originate(originateParams: WalletOriginateParams): Promise<OriginationWalletOperation>;

  /**
   *
   * @description Set the delegate for a contract.
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param delegateParams operation parameter
   */
  setDelegate(delegateParams: WalletDelegateParams): Promise<DelegationWalletOperation>;

  /**
   *
   * @description Register the current address as delegate.
   *
   * @returns An operation handle with the result from the rpc node
   *
   */
  registerDelegate(): Promise<DelegationWalletOperation>;
  /**
   *
   * @description Transfer tz from current address to a specific address.
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param transferParams operation parameter
   */
  transfer(transferParams: WalletTransferParams): Promise<WalletOperation>;
  at(address: string, schema?: ContractSchema): Promise<WalletContract>;
}
