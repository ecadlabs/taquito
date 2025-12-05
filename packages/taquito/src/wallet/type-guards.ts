import { ContractProvider } from "../contract/interface";
import type { Wallet } from "./wallet";

/**
 * Type guard to check if a provider is a Wallet instance
 * @param provider Provider to check
 * @returns true if the object is a Wallet
 */
export function isWallet(provider: Wallet | ContractProvider): provider is Wallet {
  // Wallet has pkh() and pk() methods that ContractProvider does not
  return typeof (provider as Wallet).pkh === 'function' && typeof (provider as Wallet).pk === 'function';
}

