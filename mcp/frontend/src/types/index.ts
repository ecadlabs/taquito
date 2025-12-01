import type { TezosToolkit } from '@taquito/taquito'
import type { BeaconWallet } from '@taquito/beacon-wallet'
import type { ContractAbstraction, Wallet } from '@taquito/taquito'

/**
 * Contract storage structure matching the JsLIGO contract
 */
export interface ContractStorage {
  /** Owner address with full control */
  owner: string
  /** Spender address with limited authority */
  spender: string
  /** Maximum amount spendable in a 24-hour period (in mutez) */
  daily_limit: number
  /** Maximum amount per single transaction (in mutez) */
  per_tx_limit: number
  /** Amount spent in current period (in mutez) */
  spent_today: number
  /** ISO timestamp of when spent_today was last reset */
  last_reset: string
}

/**
 * Generated Ed25519 keypair for spending
 */
export interface Keypair {
  /** Public key hash (tz1...) */
  address: string
  /** Public key (edpk...) */
  publicKey: string
  /** Secret key (edsk...) - keep secure! */
  secretKey: string
}

/**
 * Time remaining until daily spending reset
 */
export interface TimeUntilReset {
  hours: number
  minutes: number
  seconds: number
  totalSeconds: number
}

/**
 * Wallet composable state
 */
export interface WalletState {
  tezos: TezosToolkit | null
  wallet: BeaconWallet | null
  userAddress: string | null
  isConnecting: boolean
  error: string | null
}

/**
 * Contract composable state
 */
export interface ContractState {
  contractAddress: string | null
  contract: ContractAbstraction<Wallet> | null
  storage: ContractStorage | null
  contractBalance: number | null
  isLoading: boolean
  error: string | null
  lastOpHash: string | null
}

/**
 * Raw storage structure from the contract (Michelson encoded)
 * Uses named annotations from the compiled contract
 */
export interface RawContractStorage {
  owner: string
  spender: string
  daily_limit: { toNumber: () => number }
  per_tx_limit: { toNumber: () => number }
  spent_today: { toNumber: () => number }
  last_reset: string
}
