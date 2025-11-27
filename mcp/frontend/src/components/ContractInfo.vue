<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useContractStore, useWalletStore } from '@/stores'
import { copyToClipboard, openInTzkt, mutezToXtz, formatXtz } from '@/utils'

const contractStore = useContractStore()
const walletStore = useWalletStore()
const copyFeedback = ref('')

// Spender balance state
const spenderBalance = ref<number | null>(null)
const spenderFundAmount = ref('0.5')
const isFundingSpender = ref(false)
const showTooltip = ref(false)

// Contract funding state
const contractFundAmount = ref('10')
const isFundingContract = ref(false)

async function handleCopy(text: string, label: string): Promise<void> {
  await copyToClipboard(text)
  copyFeedback.value = label
  setTimeout(() => { copyFeedback.value = '' }, 2000)
}

function handleOpenTzkt(): void {
  if (contractStore.contractAddress) {
    openInTzkt(contractStore.contractAddress)
  }
}

function balanceXtz(): string {
  if (contractStore.contractBalance === null) return '0'
  return formatXtz(mutezToXtz(contractStore.contractBalance))
}

function spenderBalanceXtz(): string {
  if (spenderBalance.value === null) return '...'
  return formatXtz(spenderBalance.value)
}

async function fetchSpenderBalance(): Promise<void> {
  if (!contractStore.storage?.spender) return
  try {
    spenderBalance.value = await walletStore.getBalance(contractStore.storage.spender)
  } catch (err) {
    console.error('Failed to fetch spender balance:', err)
    spenderBalance.value = null
  }
}

async function handleFundSpender(): Promise<void> {
  if (!contractStore.storage?.spender || !walletStore.tezos) return

  const amount = parseFloat(spenderFundAmount.value)
  if (isNaN(amount) || amount <= 0) return

  isFundingSpender.value = true
  try {
    const op = await walletStore.tezos.wallet.transfer({
      to: contractStore.storage.spender,
      amount: amount,
    }).send()

    await op.confirmation()
    await fetchSpenderBalance()
  } catch (err) {
    console.error('Failed to fund spender:', err)
  } finally {
    isFundingSpender.value = false
  }
}

async function handleFundContract(): Promise<void> {
  if (!contractStore.contract || !walletStore.tezos) return

  const amount = parseFloat(contractFundAmount.value)
  if (isNaN(amount) || amount <= 0) return

  isFundingContract.value = true
  try {
    // Call the default_ entrypoint to deposit XTZ
    const op = await contractStore.contract.methodsObject.default_(null).send({ amount })

    await op.confirmation()
    await contractStore.refreshStorage()
  } catch (err) {
    console.error('Failed to fund contract:', err)
  } finally {
    isFundingContract.value = false
  }
}

onMounted(() => {
  fetchSpenderBalance()
})

// Refetch when storage changes (e.g., after refresh)
watch(() => contractStore.storage?.spender, () => {
  fetchSpenderBalance()
})
</script>

<template>
  <section class="card p-5 mb-5">
    <div class="flex items-start justify-between mb-4">
      <div>
        <p class="section-label mb-1">spending contract</p>
        <div class="flex items-center gap-2">
          <p class="mono text-sm text-text-primary">{{ contractStore.contractAddress }}</p>
          <button
            @click="handleCopy(contractStore.contractAddress!, 'contract')"
            class="btn-secondary !py-1 !px-2 text-xs"
            :title="copyFeedback === 'contract' ? 'Copied!' : 'Copy address'"
          >
            <svg v-if="copyFeedback !== 'contract'" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <button
            @click="handleOpenTzkt"
            class="btn-secondary !py-1 !px-2 text-xs"
            title="View on TzKT"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
            </svg>
          </button>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="contractStore.isOwner" class="badge badge-success">owner</span>
        <span v-else class="badge badge-muted">not owner</span>
        <button @click="contractStore.clearContractAddress()" class="btn-secondary !py-1 !px-2 text-xs">
          Disconnect
        </button>
      </div>
    </div>

    <!-- Balance -->
    <div class="card-subtle p-4 mb-4">
      <div class="flex items-center justify-between">
        <div>
          <p class="label mb-1">balance</p>
          <p>
            <span class="value-display">{{ balanceXtz() }}</span>
            <span class="value-unit">XTZ</span>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model="contractFundAmount"
            type="number"
            step="1"
            min="0"
            placeholder="10"
            class="input-field !py-2 !px-3 w-24 text-sm"
          />
          <button
            @click="handleFundContract"
            :disabled="isFundingContract || !contractFundAmount"
            class="btn-primary flex items-center gap-2 h-[38px] w-fit px-2"
          >
            <span v-if="isFundingContract" class="spinner !w-4 !h-4"></span>
            Fund
          </button>
        </div>
      </div>
    </div>

    <!-- Owner & Spender -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="card-subtle p-3">
        <p class="label">owner</p>
        <p class="mono text-sm text-text-primary break-all">{{ contractStore.storage?.owner }}</p>
      </div>
      <div class="card-subtle p-3">
        <div class="flex items-center gap-1.5 mb-1">
          <p class="label !mb-0">spender</p>
          <div class="relative">
            <button
              @mouseenter="showTooltip = true"
              @mouseleave="showTooltip = false"
              @focus="showTooltip = true"
              @blur="showTooltip = false"
              class="text-text-muted hover:text-text-secondary transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </button>
            <div
              v-show="showTooltip"
              class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10"
            >
              <p class="font-medium mb-1">Spender Fee Balance</p>
              <p class="text-gray-300">
                The spender address needs a small amount of XTZ to pay for transaction fees when calling the spending contract. Approximately 0.5 XTZ covers ~100 transactions.
              </p>
              <div class="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                <div class="border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </div>
        <p class="mono text-sm text-text-primary break-all mb-2">{{ contractStore.storage?.spender }}</p>

        <!-- Spender Balance -->
        <div class="flex items-center justify-between pt-2 border-t border-primary-200">
          <div>
            <p class="text-xs text-text-muted">Fee Balance</p>
            <p class="mono text-sm text-text-primary">
              {{ spenderBalanceXtz() }} <span class="text-text-muted">XTZ</span>
            </p>
          </div>
          <div class="flex items-center gap-2">
            <input
              v-model="spenderFundAmount"
              type="number"
              step="0.1"
              min="0"
              placeholder="0.5"
              class="input-field !py-1 !px-2 w-20 text-sm"
            />
            <button
              @click="handleFundSpender"
              :disabled="isFundingSpender || !spenderFundAmount"
              class="btn-secondary !py-1 !px-2 text-xs flex items-center gap-1"
            >
              <span v-if="isFundingSpender" class="spinner spinner-dark !w-3 !h-3"></span>
              Fund
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
