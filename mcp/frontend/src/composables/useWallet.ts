import { ref, computed, shallowRef, type Ref, type ShallowRef, type ComputedRef } from 'vue'
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { NetworkType } from '@airgap/beacon-sdk'

/** Tezos toolkit instance (shallow ref to avoid deep reactivity) */
const tezos: ShallowRef<TezosToolkit | null> = shallowRef(null)

/** Beacon wallet instance */
const wallet: ShallowRef<BeaconWallet | null> = shallowRef(null)

/** Connected user's address */
const userAddress: Ref<string | null> = ref(null)

/** Whether wallet connection is in progress */
const isConnecting: Ref<boolean> = ref(false)

/** Last error message */
const error: Ref<string | null> = ref(null)

/** RPC endpoint for Ghostnet */
const RPC_URL = 'https://ghostnet.ecadinfra.com'

/** Network type for Beacon */
const NETWORK = NetworkType.GHOSTNET

/**
 * Return type for the useWallet composable
 */
export interface UseWalletReturn {
  /** Tezos toolkit instance */
  tezos: ShallowRef<TezosToolkit | null>
  /** Beacon wallet instance */
  wallet: ShallowRef<BeaconWallet | null>
  /** Connected user's address */
  userAddress: Ref<string | null>
  /** Whether a wallet is connected */
  isConnected: ComputedRef<boolean>
  /** Whether connection is in progress */
  isConnecting: Ref<boolean>
  /** Last error message */
  error: Ref<string | null>
  /** RPC URL constant */
  RPC_URL: string
  /** Network type constant */
  NETWORK: NetworkType
  /** Initialize Tezos toolkit */
  initTezos: () => Promise<void>
  /** Connect wallet */
  connect: () => Promise<string | null>
  /** Disconnect wallet */
  disconnect: () => Promise<void>
  /** Get balance of an address */
  getBalance: (address: string) => Promise<number>
  /** Get Tezos toolkit instance */
  getTezos: () => TezosToolkit | null
  /** Format address for display */
  formatAddress: (address: string | null, start?: number, end?: number) => string
}

/**
 * Composable for wallet connection and Tezos toolkit management.
 * Provides reactive state for wallet connection and methods for
 * interacting with the Tezos blockchain via Beacon wallet.
 *
 * @returns Wallet state and methods
 *
 * @example
 * ```ts
 * const { connect, userAddress, isConnected } = useWallet()
 *
 * // Connect wallet
 * await connect()
 *
 * // Check if connected
 * if (isConnected.value) {
 *   console.log('Connected as:', userAddress.value)
 * }
 * ```
 */
export function useWallet(): UseWalletReturn {
  /** Whether a wallet is currently connected */
  const isConnected = computed(() => !!userAddress.value)

  /**
   * Initialize the Tezos toolkit and Beacon wallet.
   * Called automatically on first use, but can be called explicitly
   * to pre-initialize before user interaction.
   */
  async function initTezos(): Promise<void> {
    if (tezos.value) return

    tezos.value = new TezosToolkit(RPC_URL)

    wallet.value = new BeaconWallet({
      name: 'Spending Wallet',
      preferredNetwork: NETWORK,
    })

    tezos.value.setWalletProvider(wallet.value)

    // Check if already connected from a previous session
    const activeAccount = await wallet.value.client.getActiveAccount()
    if (activeAccount) {
      userAddress.value = activeAccount.address
    }
  }

  /**
   * Connect to a Beacon wallet.
   * Opens the Beacon wallet selection modal and requests permissions.
   *
   * @returns The connected address, or null on failure
   */
  async function connect(): Promise<string | null> {
    error.value = null
    isConnecting.value = true

    try {
      await initTezos()

      if (!wallet.value) {
        throw new Error('Wallet not initialized')
      }

      await wallet.value.requestPermissions({
        network: {
          type: NETWORK,
          rpcUrl: RPC_URL,
        },
      })

      const address = await wallet.value.getPKH()
      userAddress.value = address

      return address
    } catch (err) {
      console.error('Failed to connect wallet:', err)
      error.value = err instanceof Error ? err.message : 'Failed to connect wallet'
      return null
    } finally {
      isConnecting.value = false
    }
  }

  /**
   * Disconnect the wallet.
   * Clears the active account and resets the user address.
   */
  async function disconnect(): Promise<void> {
    if (wallet.value) {
      await wallet.value.clearActiveAccount()
      userAddress.value = null
    }
  }

  /**
   * Get the balance of an address in XTZ.
   *
   * @param address - The Tezos address to check
   * @returns Balance in XTZ (not mutez)
   */
  async function getBalance(address: string): Promise<number> {
    if (!tezos.value) {
      await initTezos()
    }
    const balance = await tezos.value!.tz.getBalance(address)
    return balance.toNumber() / 1_000_000
  }

  /**
   * Get the Tezos toolkit instance.
   * Useful for direct access to Taquito methods.
   *
   * @returns The TezosToolkit instance or null if not initialized
   */
  function getTezos(): TezosToolkit | null {
    return tezos.value
  }

  /**
   * Format an address for display by truncating the middle.
   *
   * @param address - The full Tezos address
   * @param start - Number of characters to show at start (default: 6)
   * @param end - Number of characters to show at end (default: 4)
   * @returns Formatted address like "tz1abc...wxyz"
   *
   * @example
   * ```ts
   * formatAddress('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb')
   * // Returns: "tz1VSU...cjb"
   * ```
   */
  function formatAddress(address: string | null, start = 6, end = 4): string {
    if (!address) return ''
    if (address.length <= start + end) return address
    return `${address.slice(0, start)}...${address.slice(-end)}`
  }

  return {
    // State
    tezos,
    wallet,
    userAddress,
    isConnected,
    isConnecting,
    error,

    // Methods
    initTezos,
    connect,
    disconnect,
    getBalance,
    getTezos,
    formatAddress,

    // Constants
    RPC_URL,
    NETWORK,
  }
}
