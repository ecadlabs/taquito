/**
 * Type guard to check if a provider is a Wallet instance
 * @param obj Object to check
 * @returns true if the object is a Wallet
 */
export function isWallet(obj: any): boolean {
  return obj && 'pkh' in obj;
}

