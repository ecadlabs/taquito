import { ContractProvider } from "../contract";
import { Wallet } from "./wallet";

/**
 * Type guard to check if a provider is a Wallet instance
 * @param provider Provider to check
 * @returns true if the object is a Wallet
 */
export function isWallet(provider: Wallet | ContractProvider): boolean {
  return provider instanceof Wallet;
}

