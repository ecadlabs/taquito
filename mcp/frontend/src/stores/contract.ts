import { defineStore } from 'pinia'
import { ref, shallowRef, computed } from 'vue'
import type { ContractAbstraction, Wallet } from '@taquito/taquito'
import { useWalletStore } from './wallet'
import { xtzToMutez } from '@/utils'
import type { ContractStorage, TimeUntilReset, RawContractStorage } from '@/types'
import CONTRACT_CODE from '../../contract/spending-limited-wallet.tz?raw'

export const useContractStore = defineStore('contract', () => {
  const walletStore = useWalletStore()

  // State
  const contractAddress = ref<string | null>(localStorage.getItem('contractAddress'))
  const contract = shallowRef<ContractAbstraction<Wallet> | null>(null)
  const storage = ref<ContractStorage | null>(null)
  const contractBalance = ref<number | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastOpHash = ref<string | null>(null)

  // Getters
  const isOwner = computed(() => {
    return storage.value !== null && walletStore.userAddress === storage.value.owner
  })

  const isSpender = computed(() => {
    return storage.value !== null && walletStore.userAddress === storage.value.spender
  })

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

  // Actions
  async function setContractAddress(address: string): Promise<void> {
    contractAddress.value = address
    localStorage.setItem('contractAddress', address)
    await loadContract()
  }

  function clearContractAddress(): void {
    contractAddress.value = null
    contract.value = null
    storage.value = null
    contractBalance.value = null
    localStorage.removeItem('contractAddress')
  }

  async function loadContract(): Promise<void> {
    if (!contractAddress.value) return

    await walletStore.init()
    const tezos = walletStore.getTezos()
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

  async function refreshStorage(): Promise<void> {
    if (!contractAddress.value) return

    await walletStore.init()
    const tezos = walletStore.getTezos()
    if (!tezos) throw new Error('Tezos toolkit not initialized')

    isLoading.value = true

    try {
      const contractInstance = await tezos.contract.at(contractAddress.value)
      const rawStorage = await contractInstance.storage<RawContractStorage>()

      storage.value = {
        owner: rawStorage.owner,
        spender: rawStorage.spender,
        daily_limit: rawStorage.daily_limit.toNumber(),
        per_tx_limit: rawStorage.per_tx_limit.toNumber(),
        spent_today: rawStorage.spent_today.toNumber(),
        last_reset: rawStorage.last_reset,
      }

      const balance = await tezos.tz.getBalance(contractAddress.value)
      contractBalance.value = balance.toNumber()
    } catch (err) {
      console.error('Failed to refresh storage:', err)
      error.value = err instanceof Error ? err.message : 'Failed to refresh storage'
    } finally {
      isLoading.value = false
    }
  }

  async function originateContract(
    ownerAddress: string,
    spenderAddress: string,
    dailyLimitXtz: number,
    perTxLimitXtz: number
  ): Promise<string> {
    await walletStore.init()
    const tezos = walletStore.getTezos()
    if (!tezos) throw new Error('Tezos toolkit not initialized')

    isLoading.value = true
    error.value = null

    try {
      const initialStorage = {
        owner: ownerAddress,
        spender: spenderAddress,
        daily_limit: xtzToMutez(dailyLimitXtz),
        per_tx_limit: xtzToMutez(perTxLimitXtz),
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

  async function setLimits(dailyLimitXtz: number, perTxLimitXtz: number): Promise<string> {
    if (!contract.value) throw new Error('Contract not loaded')

    isLoading.value = true
    error.value = null

    try {
      const op = await contract.value.methodsObject.set_limits({
        new_daily_limit: xtzToMutez(dailyLimitXtz),
        new_per_tx_limit: xtzToMutez(perTxLimitXtz),
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

  async function withdraw(recipient: string, amountXtz: number): Promise<string> {
    if (!contract.value) throw new Error('Contract not loaded')

    isLoading.value = true
    error.value = null

    try {
      const op = await contract.value.methodsObject.withdraw({
        recipient: recipient,
        amount: xtzToMutez(amountXtz),
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

  return {
    // State
    contractAddress,
    contract,
    storage,
    contractBalance,
    isLoading,
    error,
    lastOpHash,
    // Getters
    isOwner,
    isSpender,
    timeUntilReset,
    // Actions
    setContractAddress,
    clearContractAddress,
    loadContract,
    refreshStorage,
    originateContract,
    setSpender,
    setLimits,
    withdraw,
  }
})
