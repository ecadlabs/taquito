import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import { TezosToolkit } from '@taquito/taquito'
import { BeaconWallet } from '@taquito/beacon-wallet'
import { NetworkType } from '@airgap/beacon-dapp'
import { RPC_URL } from '@/utils'

export const useWalletStore = defineStore('wallet', () => {
  // State
  const tezos = shallowRef<TezosToolkit | null>(null)
  const wallet = shallowRef<BeaconWallet | null>(null)
  const userAddress = ref<string | null>(null)
  const isConnecting = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isConnected = computed(() => !!userAddress.value)

  // Actions
  async function init(): Promise<void> {
    if (tezos.value) return

    tezos.value = new TezosToolkit(RPC_URL)

    wallet.value = new BeaconWallet({
      name: 'Spending Wallet',
      // Type assertion needed due to duplicate NetworkType enums across beacon packages
      preferredNetwork: NetworkType.GHOSTNET as any,
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

      await wallet.value.requestPermissions({
        network: {
          // Type assertion needed due to duplicate NetworkType enums across beacon packages
          type: NetworkType.GHOSTNET as any,
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

  async function disconnect(): Promise<void> {
    if (wallet.value) {
      await wallet.value.clearActiveAccount()
      userAddress.value = null
    }
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
    // Getters
    isConnected,
    // Actions
    init,
    connect,
    disconnect,
    getBalance,
    getTezos,
  }
})
