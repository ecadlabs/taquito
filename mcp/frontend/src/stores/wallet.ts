import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { NetworkType } from '@airgap/beacon-dapp'
import {
  NETWORKS,
  getSelectedNetworkId,
  setSelectedNetworkId,
  type NetworkId,
} from '@/utils'

export const useWalletStore = defineStore('wallet', () => {
  // State
  const tezos = shallowRef<TezosToolkit | null>(null)
  const wallet = shallowRef<BeaconWallet | null>(null)
  const userAddress = ref<string | null>(null)
  const isConnecting = ref(false)
  const error = ref<string | null>(null)
  const networkId = ref<NetworkId>(getSelectedNetworkId())

  // Getters
  const isConnected = computed(() => !!userAddress.value)
  const currentNetwork = computed(() => NETWORKS[networkId.value])

  // Helper to get Beacon network config
  function getBeaconNetworkConfig(network: typeof NETWORKS[NetworkId]) {
    if (network.beaconNetwork === 'mainnet') {
      return {
        type: NetworkType.MAINNET,
      }
    }
    // For custom networks, provide full config
    return {
      type: NetworkType.CUSTOM,
      name: network.name,
      rpcUrl: network.rpcUrl,
    }
  }

  // Actions
  async function init(): Promise<void> {
    if (tezos.value) return

    const network = currentNetwork.value
    tezos.value = new TezosToolkit(network.rpcUrl)

    const beaconNetwork = getBeaconNetworkConfig(network)

    wallet.value = new BeaconWallet({
      name: 'Spending Wallet',
      network: beaconNetwork as any,
    })

    tezos.value.setWalletProvider(wallet.value)

    // Check if already connected from a previous session
    const activeAccount = await wallet.value.client.getActiveAccount()
    if (activeAccount) {
      userAddress.value = activeAccount.address
    }
  }

  async function connect(): Promise<string | null> {
    error.value = null
    isConnecting.value = true

    try {
      await init()

      if (!wallet.value) {
        throw new Error('Wallet not initialized')
      }

      const network = currentNetwork.value
      const beaconNetwork = getBeaconNetworkConfig(network)

      await wallet.value.requestPermissions({
        network: beaconNetwork as any,
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

  async function disconnect(): Promise<void> {
    if (wallet.value) {
      await wallet.value.clearActiveAccount()
      userAddress.value = null
    }
  }

  async function switchNetwork(newNetworkId: NetworkId): Promise<void> {
    if (newNetworkId === networkId.value) return

    // Disconnect and reset state
    if (wallet.value) {
      await wallet.value.clearActiveAccount()
    }
    tezos.value = null
    wallet.value = null
    userAddress.value = null

    // Update network
    networkId.value = newNetworkId
    setSelectedNetworkId(newNetworkId)

    // Reinitialize with new network
    await init()
  }

  async function getBalance(address: string): Promise<number> {
    if (!tezos.value) {
      await init()
    }
    const balance = await tezos.value!.tz.getBalance(address)
    return balance.toNumber() / 1_000_000
  }

  function getTezos(): TezosToolkit | null {
    return tezos.value
  }

  return {
    // State
    tezos,
    wallet,
    userAddress,
    isConnecting,
    error,
    networkId,
    // Getters
    isConnected,
    currentNetwork,
    // Actions
    init,
    connect,
    disconnect,
    switchNetwork,
    getBalance,
    getTezos,
  }
})
