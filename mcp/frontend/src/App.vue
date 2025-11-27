<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, type Ref } from 'vue'
import { useWallet } from './composables/useWallet'
import { useContract } from './composables/useContract'
import { useKeypair } from './composables/useKeypair'

// Components
import WalletConnection from './components/WalletConnection.vue'
import SetupSection from './components/SetupSection.vue'
import ContractInfo from './components/ContractInfo.vue'
import SpendingLimits from './components/SpendingLimits.vue'
import SpenderManagement from './components/SpenderManagement.vue'
import WithdrawFunds from './components/WithdrawFunds.vue'

// ============================================================================
// Composables
// ============================================================================

const {
  userAddress,
  isConnected,
  isConnecting,
  connect,
  disconnect,
  initTezos,
} = useWallet()

const {
  contractAddress,
  storage,
  contractBalance,
  isLoading,
  error: contractError,
  isOwner,
  timeUntilReset,
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
} = useContract()

const {
  generatedKeypair,
  isGenerating,
  generateKeypair,
  copyToClipboard,
  downloadKeypair,
} = useKeypair()

// ============================================================================
// Local State
// ============================================================================

const resetCountdown: Ref<string | null> = ref(null)
let countdownInterval: ReturnType<typeof setInterval> | null = null

// ============================================================================
// Event Handlers
// ============================================================================

async function handleOriginate(spender: string, dailyLimit: number, perTxLimit: number): Promise<void> {
  if (!userAddress.value) return
  await originateContract(userAddress.value, spender, dailyLimit, perTxLimit)
}

async function handleConnectContract(address: string): Promise<void> {
  await setContractAddress(address)
}

async function handleSetSpender(address: string): Promise<void> {
  await setSpender(address)
}

async function handleSetLimits(dailyLimit: number, perTxLimit: number): Promise<void> {
  await setLimits(dailyLimit, perTxLimit)
}

async function handleWithdraw(recipient: string, amount: number): Promise<void> {
  await withdraw(recipient, amount)
}

function updateCountdown(): void {
  if (timeUntilReset.value) {
    const { hours, minutes, seconds } = timeUntilReset.value
    resetCountdown.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    resetCountdown.value = null
  }
}

// ============================================================================
// Computed
// ============================================================================

const dailyLimitXtz = computed<string>(() => {
  if (!storage.value) return '0'
  return formatXtz(mutezToXtz(storage.value.daily_limit))
})

const perTxLimitXtz = computed<string>(() => {
  if (!storage.value) return '0'
  return formatXtz(mutezToXtz(storage.value.per_tx_limit))
})

const spentTodayXtz = computed<string>(() => {
  if (!storage.value) return '0'
  return formatXtz(mutezToXtz(storage.value.spent_today))
})

const balanceXtz = computed<string>(() => {
  if (contractBalance.value === null) return '0'
  return formatXtz(mutezToXtz(contractBalance.value))
})

const spentPercentage = computed<number>(() => {
  if (!storage.value || storage.value.daily_limit === 0) return 0
  return Math.min(100, (storage.value.spent_today / storage.value.daily_limit) * 100)
})

// ============================================================================
// Lifecycle
// ============================================================================

onMounted(async () => {
  await initTezos()
  if (contractAddress.value) {
    await loadContract()
  }
  countdownInterval = setInterval(updateCountdown, 1000)
  updateCountdown()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})

watch(storage, updateCountdown)
</script>

<template>
  <div class="film-grain"></div>

  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="max-w-2xl mx-auto">

      <!-- Header -->
      <header class="mb-12">
        <p class="section-label mb-2">spending wallet</p>
        <h1 class="text-3xl font-semibold tracking-tight text-text-primary">
          Spending Wallet
        </h1>
        <p class="mt-1 text-text-secondary">
          <span class="accent-text">delegated spending</span> · configurable limits
        </p>
      </header>

      <!-- Wallet Connection -->
      <WalletConnection
        :is-connected="isConnected"
        :is-connecting="isConnecting"
        :user-address="userAddress"
        @connect="connect"
        @disconnect="disconnect"
      />

      <!-- Setup Section (when no contract) -->
      <SetupSection
        v-if="isConnected && !contractAddress"
        :user-address="userAddress"
        :generated-keypair="generatedKeypair"
        :is-generating="isGenerating"
        :is-loading="isLoading"
        @generate-keypair="generateKeypair"
        @use-keypair="() => {}"
        @copy-to-clipboard="copyToClipboard"
        @download-keypair="downloadKeypair"
        @originate="handleOriginate"
        @connect-contract="handleConnectContract"
      />

      <!-- Contract Dashboard -->
      <template v-if="contractAddress && storage">
        <!-- Contract Info -->
        <ContractInfo
          :contract-address="contractAddress"
          :storage="storage"
          :balance-xtz="balanceXtz"
          :is-owner="isOwner"
          @disconnect="clearContractAddress"
        />

        <!-- Spending Limits -->
        <SpendingLimits
          :daily-limit-xtz="dailyLimitXtz"
          :per-tx-limit-xtz="perTxLimitXtz"
          :spent-today-xtz="spentTodayXtz"
          :spent-percentage="spentPercentage"
          :reset-countdown="resetCountdown"
          :is-owner="isOwner"
          :is-loading="isLoading"
          @set-limits="handleSetLimits"
        />

        <!-- Spender Management (Owner) -->
        <SpenderManagement
          v-if="isOwner"
          :current-spender="storage.spender"
          :is-loading="isLoading"
          @set-spender="handleSetSpender"
        />

        <!-- Withdraw (Owner) -->
        <WithdrawFunds
          v-if="isOwner"
          :user-address="userAddress"
          :balance-xtz="balanceXtz"
          :is-loading="isLoading"
          @withdraw="handleWithdraw"
        />

        <!-- Refresh -->
        <div class="text-center">
          <button @click="refreshStorage" :disabled="isLoading" class="btn-secondary flex items-center gap-2 mx-auto">
            <span v-if="isLoading" class="spinner spinner-dark"></span>
            Refresh
          </button>
        </div>
      </template>

      <!-- Error -->
      <div v-if="contractError" class="card p-4 mt-5 border border-error/20 bg-error/5">
        <p class="text-sm text-error">{{ contractError }}</p>
      </div>

      <!-- Footer -->
      <footer class="mt-12 text-center">
        <p class="text-sm text-text-muted">
          Built with <a href="https://taquito.io" target="_blank">Taquito</a> · Ghostnet
        </p>
      </footer>

    </div>
  </div>
</template>
