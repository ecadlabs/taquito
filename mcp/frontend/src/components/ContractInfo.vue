<script setup lang="ts">
import { ref } from 'vue'
import { useContractStore } from '@/stores'
import { copyToClipboard, openInTzkt, mutezToXtz, formatXtz } from '@/utils'

const contractStore = useContractStore()
const copyFeedback = ref('')

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
        <button @click="contractStore.clearContractAddress()" class="btn-secondary !py-1 !px-2 text-xs">
          Disconnect
        </button>
      </div>
    </div>

    <!-- Balance -->
    <div class="card-subtle p-4 mb-4">
      <p class="label mb-1">balance</p>
      <p>
        <span class="value-display">{{ balanceXtz() }}</span>
        <span class="value-unit">XTZ</span>
      </p>
    </div>

    <!-- Owner & Spender -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="card-subtle p-3">
        <p class="label">owner</p>
        <p class="mono text-sm text-text-primary break-all">{{ contractStore.storage?.owner }}</p>
      </div>
      <div class="card-subtle p-3">
        <p class="label">spender</p>
        <p class="mono text-sm text-text-primary break-all">{{ contractStore.storage?.spender }}</p>
      </div>
    </div>
  </section>
</template>
