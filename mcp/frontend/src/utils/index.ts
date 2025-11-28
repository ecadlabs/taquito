/**
 * Shared utility functions for the spending wallet application.
 */

// Constants
export const MUTEZ_PER_XTZ = 1_000_000

// Network configurations
export const NETWORKS = {
  mainnet: {
    name: 'Mainnet',
    rpcUrl: 'https://mainnet.tezos.ecadinfra.com',
    tzktUrl: 'https://tzkt.io',
    beaconNetwork: 'mainnet',
  },
  shadownet: {
    name: 'Shadownet',
    rpcUrl: 'https://shadownet.tezos.ecadinfra.com',
    tzktUrl: 'https://shadownet.tzkt.io',
    beaconNetwork: 'custom',
  },
} as const

export type NetworkId = keyof typeof NETWORKS
export type NetworkConfig = typeof NETWORKS[NetworkId]

const STORAGE_KEY = 'selectedNetwork'
const DEFAULT_NETWORK: NetworkId = 'mainnet'

export function getSelectedNetworkId(): NetworkId {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && stored in NETWORKS) {
    return stored as NetworkId
  }
  return DEFAULT_NETWORK
}

export function setSelectedNetworkId(networkId: NetworkId): void {
  localStorage.setItem(STORAGE_KEY, networkId)
}

export function getSelectedNetwork(): NetworkConfig {
  return NETWORKS[getSelectedNetworkId()]
}

/**
 * Convert mutez to XTZ.
 */
export function mutezToXtz(mutez: number): number {
  return mutez / MUTEZ_PER_XTZ
}

/**
 * Convert XTZ to mutez.
 */
export function xtzToMutez(xtz: number): number {
  return Math.floor(xtz * MUTEZ_PER_XTZ)
}

/**
 * Format XTZ amount for display.
 * Removes trailing zeros for cleaner display.
 */
export function formatXtz(xtz: number, decimals = 6): string {
  return xtz.toFixed(decimals).replace(/\.?0+$/, '')
}

/**
 * Format an address for display by truncating the middle.
 */
export function formatAddress(address: string | null, start = 6, end = 4): string {
  if (!address) return ''
  if (address.length <= start + end) return address
  return `${address.slice(0, start)}...${address.slice(-end)}`
}

/**
 * Copy text to clipboard.
 * Uses the modern Clipboard API with fallback for older browsers.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    textarea.style.pointerEvents = 'none'
    document.body.appendChild(textarea)
    textarea.select()

    try {
      document.execCommand('copy')
      return true
    } catch {
      return false
    } finally {
      document.body.removeChild(textarea)
    }
  }
}

/**
 * Open a Tezos address or operation in TzKT explorer.
 */
export function openInTzkt(addressOrHash: string): void {
  const network = getSelectedNetwork()
  window.open(`${network.tzktUrl}/${addressOrHash}`, '_blank')
}
