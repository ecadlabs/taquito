import { ref, computed, shallowRef, type Ref, type ShallowRef, type ComputedRef } from 'vue'
import type { ContractAbstraction, Wallet } from '@taquito/taquito'
import { useWallet } from './useWallet'
import type { ContractStorage, TimeUntilReset, RawContractStorage } from '@/types'

/** Contract address (persisted to localStorage) */
const contractAddress: Ref<string | null> = ref(localStorage.getItem('contractAddress'))

/** Contract instance */
const contract: ShallowRef<ContractAbstraction<Wallet> | null> = shallowRef(null)

/** Parsed contract storage */
const storage: Ref<ContractStorage | null> = ref(null)

/** Contract balance in mutez */
const contractBalance: Ref<number | null> = ref(null)

/** Loading state */
const isLoading: Ref<boolean> = ref(false)

/** Last error message */
const error: Ref<string | null> = ref(null)

/** Last operation hash */
const lastOpHash: Ref<string | null> = ref(null)

/**
 * Compiled Michelson contract code.
 * This is the output from `ligo compile contract`.
 */
const CONTRACT_CODE = `{ parameter
    (or (unit %default_)
        (or (pair %withdraw (address %recipient) (mutez %amount))
            (or (pair %set_limits (mutez %new_daily_limit) (mutez %new_per_tx_limit))
                (or (address %set_spender) (pair %spend (address %recipient) (mutez %amount)))))) ;
  storage
    (pair (address %owner)
          (address %spender)
          (mutez %daily_limit)
          (mutez %per_tx_limit)
          (mutez %spent_today)
          (timestamp %last_reset)) ;
  code { UNPAIR ;
         IF_LEFT
           { DROP ; NIL operation ; PAIR }
           { IF_LEFT
               { DUP 2 ;
                 CAR ;
                 SENDER ;
                 COMPARE ;
                 NEQ ;
                 IF { DROP 2 ; PUSH string "Not authorized: only owner can call this" ; FAILWITH }
                    { BALANCE ;
                      DUP 2 ;
                      CDR ;
                      COMPARE ;
                      GT ;
                      IF { DROP 2 ; PUSH string "Insufficient contract balance" ; FAILWITH }
                         { DUP ;
                           CAR ;
                           CONTRACT unit ;
                           IF_NONE { PUSH string "Invalid recipient address" ; FAILWITH } {} ;
                           SWAP ;
                           CDR ;
                           UNIT ;
                           TRANSFER_TOKENS ;
                           SWAP ;
                           NIL operation ;
                           DIG 2 ;
                           CONS ;
                           PAIR } } }
               { IF_LEFT
                   { DUP 2 ;
                     CAR ;
                     SENDER ;
                     COMPARE ;
                     NEQ ;
                     IF { DROP 2 ; PUSH string "Not authorized: only owner can call this" ; FAILWITH }
                        { SWAP ;
                          DUP 2 ;
                          CAR ;
                          UPDATE 5 ;
                          SWAP ;
                          CDR ;
                          UPDATE 7 ;
                          NIL operation ;
                          PAIR } }
                   { IF_LEFT
                       { DUP 2 ;
                         CAR ;
                         SENDER ;
                         COMPARE ;
                         NEQ ;
                         IF { DROP 2 ; PUSH string "Not authorized: only owner can call this" ; FAILWITH }
                            { UPDATE 3 ; NIL operation ; PAIR } }
                       { DUP 2 ;
                         GET 3 ;
                         SENDER ;
                         COMPARE ;
                         NEQ ;
                         IF { DROP 2 ;
                              PUSH string "Not authorized: only spender can call this" ;
                              FAILWITH }
                            { DUP 2 ;
                              GET 7 ;
                              DUP 2 ;
                              CDR ;
                              COMPARE ;
                              GT ;
                              IF { DROP ; GET 7 ; PUSH string "Exceeds limit" ; PAIR ; FAILWITH }
                                 { DUP 2 ;
                                   GET 10 ;
                                   NOW ;
                                   SUB ;
                                   PUSH int 86400 ;
                                   SWAP ;
                                   COMPARE ;
                                   GE ;
                                   IF { SWAP ; PUSH mutez 0 ; UPDATE 9 ; NOW ; UPDATE 10 } { SWAP } ;
                                   DUP 2 ;
                                   CDR ;
                                   DUP 2 ;
                                   GET 9 ;
                                   ADD ;
                                   DUP 2 ;
                                   GET 5 ;
                                   DUP 2 ;
                                   COMPARE ;
                                   GT ;
                                   IF { DROP 3 ; PUSH string "Exceeds daily limit" ; FAILWITH }
                                      { BALANCE ;
                                        DUP 4 ;
                                        CDR ;
                                        COMPARE ;
                                        GT ;
                                        IF { DROP 3 ; PUSH string "Insufficient contract balance" ; FAILWITH }
                                           { DUP 3 ;
                                             CAR ;
                                             CONTRACT unit ;
                                             IF_NONE { PUSH string "Invalid recipient address" ; FAILWITH } {} ;
                                             DIG 3 ;
                                             CDR ;
                                             UNIT ;
                                             TRANSFER_TOKENS ;
                                             DUG 2 ;
                                             UPDATE 9 ;
                                             NIL operation ;
                                             DIG 2 ;
                                             CONS ;
                                             PAIR } } } } } } } } } }

`

/**
 * Return type for the useContract composable
 */
export interface UseContractReturn {
  /** Contract address */
  contractAddress: Ref<string | null>
  /** Contract instance */
  contract: ShallowRef<ContractAbstraction<Wallet> | null>
  /** Parsed contract storage */
  storage: Ref<ContractStorage | null>
  /** Contract balance in mutez */
  contractBalance: Ref<number | null>
  /** Loading state */
  isLoading: Ref<boolean>
  /** Last error message */
  error: Ref<string | null>
  /** Last operation hash */
  lastOpHash: Ref<string | null>
  /** Whether connected user is the owner */
  isOwner: ComputedRef<boolean>
  /** Whether connected user is the spender */
  isSpender: ComputedRef<boolean>
  /** Time until daily spending reset */
  timeUntilReset: ComputedRef<TimeUntilReset | null>
  /** Set and load a contract address */
  setContractAddress: (address: string) => Promise<void>
  /** Clear the contract address */
  clearContractAddress: () => void
  /** Load the contract instance */
  loadContract: () => Promise<void>
  /** Refresh the contract storage */
  refreshStorage: () => Promise<void>
  /** Originate a new contract */
  originateContract: (
    ownerAddress: string,
    spenderAddress: string,
    dailyLimitXtz: number,
    perTxLimitXtz: number
  ) => Promise<string>
  /** Set a new spender address */
  setSpender: (newSpender: string) => Promise<string>
  /** Set new spending limits */
  setLimits: (dailyLimitXtz: number, perTxLimitXtz: number) => Promise<string>
  /** Withdraw funds */
  withdraw: (recipient: string, amountXtz: number) => Promise<string>
  /** Convert mutez to XTZ */
  mutezToXtz: (mutez: number) => number
  /** Format XTZ for display */
  formatXtz: (xtz: number, decimals?: number) => string
}

/**
 * Composable for contract interactions.
 * Provides methods for originating, loading, and interacting with
 * the spending-limited wallet contract.
 *
 * @returns Contract state and methods
 *
 * @example
 * ```ts
 * const { storage, isOwner, setLimits } = useContract()
 *
 * // Check if user is owner
 * if (isOwner.value) {
 *   await setLimits(200, 20) // 200 XTZ daily, 20 XTZ per tx
 * }
 * ```
 */
export function useContract(): UseContractReturn {
  const { getTezos, userAddress, initTezos } = useWallet()

  /** Whether the connected user is the contract owner */
  const isOwner = computed(() => {
    return storage.value !== null && userAddress.value === storage.value.owner
  })

  /** Whether the connected user is the contract spender */
  const isSpender = computed(() => {
    return storage.value !== null && userAddress.value === storage.value.spender
  })

  /**
   * Calculate time remaining until daily spending reset.
   * The contract resets spent_today after 24 hours from last_reset.
   */
  const timeUntilReset = computed((): TimeUntilReset | null => {
    if (!storage.value?.last_reset) return null

    const lastReset = new Date(storage.value.last_reset).getTime()
    const now = Date.now()
    const resetTime = lastReset + 24 * 60 * 60 * 1000
    const remaining = Math.max(0, resetTime - now)

    if (remaining <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 }
    }

    const totalSeconds = Math.floor(remaining / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return { hours, minutes, seconds, totalSeconds }
  })

  /**
   * Set the contract address and load the contract.
   * The address is persisted to localStorage for session persistence.
   *
   * @param address - The contract address (KT1...)
   */
  async function setContractAddress(address: string): Promise<void> {
    contractAddress.value = address
    localStorage.setItem('contractAddress', address)
    await loadContract()
  }

  /**
   * Clear the contract address and reset state.
   * Removes the address from localStorage.
   */
  function clearContractAddress(): void {
    contractAddress.value = null
    contract.value = null
    storage.value = null
    contractBalance.value = null
    localStorage.removeItem('contractAddress')
  }

  /**
   * Load the contract instance from the stored address.
   * Also refreshes the storage data.
   */
  async function loadContract(): Promise<void> {
    if (!contractAddress.value) return

    await initTezos()
    const tezos = getTezos()
    if (!tezos) throw new Error('Tezos toolkit not initialized')

    isLoading.value = true
    error.value = null

    try {
      contract.value = await tezos.wallet.at(contractAddress.value)
      await refreshStorage()
    } catch (err) {
      console.error('Failed to load contract:', err)
      error.value = err instanceof Error ? err.message : 'Failed to load contract'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Refresh the contract storage and balance.
   * Parses the raw Michelson storage into a typed structure.
   */
  async function refreshStorage(): Promise<void> {
    if (!contractAddress.value) return

    await initTezos()
    const tezos = getTezos()
    if (!tezos) throw new Error('Tezos toolkit not initialized')

    isLoading.value = true

    try {
      const contractInstance = await tezos.contract.at(contractAddress.value)
      const rawStorage = await contractInstance.storage<RawContractStorage>()

      // Parse the storage structure using Michelson annotation names
      storage.value = {
        owner: rawStorage.owner,
        spender: rawStorage.spender,
        daily_limit: rawStorage.daily_limit.toNumber(),
        per_tx_limit: rawStorage.per_tx_limit.toNumber(),
        spent_today: rawStorage.spent_today.toNumber(),
        last_reset: rawStorage.last_reset,
      }

      // Get contract balance
      const balance = await tezos.tz.getBalance(contractAddress.value)
      contractBalance.value = balance.toNumber()
    } catch (err) {
      console.error('Failed to refresh storage:', err)
      error.value = err instanceof Error ? err.message : 'Failed to refresh storage'
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Originate a new spending-limited wallet contract.
   *
   * @param ownerAddress - Address with full control
   * @param spenderAddress - Address with limited spending authority
   * @param dailyLimitXtz - Maximum daily spending in XTZ
   * @param perTxLimitXtz - Maximum per-transaction spending in XTZ
   * @returns The new contract address
   */
  async function originateContract(
    ownerAddress: string,
    spenderAddress: string,
    dailyLimitXtz: number,
    perTxLimitXtz: number
  ): Promise<string> {
    await initTezos()
    const tezos = getTezos()
    if (!tezos) throw new Error('Tezos toolkit not initialized')

    isLoading.value = true
    error.value = null

    try {
      const initialStorage = {
        owner: ownerAddress,
        spender: spenderAddress,
        daily_limit: Math.floor(dailyLimitXtz * 1_000_000),
        per_tx_limit: Math.floor(perTxLimitXtz * 1_000_000),
        spent_today: 0,
        last_reset: new Date().toISOString(),
      }

      const originationOp = await tezos.wallet.originate({
        code: CONTRACT_CODE,
        storage: initialStorage,
      }).send()

      lastOpHash.value = originationOp.opHash

      const originatedContract = await originationOp.contract()
      const address = originatedContract.address

      await setContractAddress(address)

      return address
    } catch (err) {
      console.error('Failed to originate contract:', err)
      error.value = err instanceof Error ? err.message : 'Failed to originate contract'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Set a new spender address (owner only).
   *
   * @param newSpender - The new spender address
   * @returns Operation hash
   * @throws If caller is not the owner
   */
  async function setSpender(newSpender: string): Promise<string> {
    if (!contract.value) throw new Error('Contract not loaded')

    isLoading.value = true
    error.value = null

    try {
      const op = await contract.value.methodsObject.set_spender(newSpender).send()
      lastOpHash.value = op.opHash

      await op.confirmation(1)
      await refreshStorage()

      return op.opHash
    } catch (err) {
      console.error('Failed to set spender:', err)
      error.value = err instanceof Error ? err.message : 'Failed to set spender'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Set new spending limits (owner only).
   *
   * @param dailyLimitXtz - New daily limit in XTZ
   * @param perTxLimitXtz - New per-transaction limit in XTZ
   * @returns Operation hash
   * @throws If caller is not the owner
   */
  async function setLimits(dailyLimitXtz: number, perTxLimitXtz: number): Promise<string> {
    if (!contract.value) throw new Error('Contract not loaded')

    isLoading.value = true
    error.value = null

    try {
      const op = await contract.value.methodsObject.set_limits({
        new_daily_limit: Math.floor(dailyLimitXtz * 1_000_000),
        new_per_tx_limit: Math.floor(perTxLimitXtz * 1_000_000),
      }).send()
      lastOpHash.value = op.opHash

      await op.confirmation(1)
      await refreshStorage()

      return op.opHash
    } catch (err) {
      console.error('Failed to set limits:', err)
      error.value = err instanceof Error ? err.message : 'Failed to set limits'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Withdraw funds from the contract (owner only).
   * No limits are applied to owner withdrawals.
   *
   * @param recipient - The recipient address
   * @param amountXtz - Amount to withdraw in XTZ
   * @returns Operation hash
   * @throws If caller is not the owner
   */
  async function withdraw(recipient: string, amountXtz: number): Promise<string> {
    if (!contract.value) throw new Error('Contract not loaded')

    isLoading.value = true
    error.value = null

    try {
      const op = await contract.value.methodsObject.withdraw({
        recipient: recipient,
        amount: Math.floor(amountXtz * 1_000_000),
      }).send()
      lastOpHash.value = op.opHash

      await op.confirmation(1)
      await refreshStorage()

      return op.opHash
    } catch (err) {
      console.error('Failed to withdraw:', err)
      error.value = err instanceof Error ? err.message : 'Failed to withdraw'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Convert mutez to XTZ.
   *
   * @param mutez - Amount in mutez (1/1,000,000 XTZ)
   * @returns Amount in XTZ
   */
  function mutezToXtz(mutez: number): number {
    return mutez / 1_000_000
  }

  /**
   * Format XTZ amount for display.
   * Removes trailing zeros for cleaner display.
   *
   * @param xtz - Amount in XTZ
   * @param decimals - Maximum decimal places (default: 6)
   * @returns Formatted string
   *
   * @example
   * ```ts
   * formatXtz(1.5)      // "1.5"
   * formatXtz(1.500000) // "1.5"
   * formatXtz(1.0)      // "1"
   * ```
   */
  function formatXtz(xtz: number, decimals = 6): string {
    return xtz.toFixed(decimals).replace(/\.?0+$/, '')
  }

  return {
    // State
    contractAddress,
    contract,
    storage,
    contractBalance,
    isLoading,
    error,
    lastOpHash,

    // Computed
    isOwner,
    isSpender,
    timeUntilReset,

    // Methods
    setContractAddress,
    clearContractAddress,
    loadContract,
    refreshStorage,
    originateContract,
    setSpender,
    setLimits,
    withdraw,
    mutezToXtz,
    formatXtz,
  }
}
