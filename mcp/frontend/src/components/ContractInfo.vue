<script setup lang="ts">
import type { ContractStorage } from '@/types'

defineProps<{
  /** Contract address */
  contractAddress: string
  /** Contract storage */
  storage: ContractStorage
  /** Contract balance in XTZ (formatted) */
  balanceXtz: string
  /** Whether current user is the owner */
  isOwner: boolean
}>()

const emit = defineEmits<{
  disconnect: []
}>()
</script>

<template>
  <section class="card p-5 mb-5">
    <div class="flex items-start justify-between mb-4">
      <div>
        <p class="section-label mb-1">contract</p>
        <p class="mono text-sm text-text-primary">{{ contractAddress }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span v-if="isOwner" class="badge badge-success">owner</span>
        <button @click="emit('disconnect')" class="btn-secondary !py-1 !px-2 text-xs">
          Disconnect
        </button>
      </div>
    </div>

    <!-- Balance -->
    <div class="card-subtle p-4 mb-4">
      <p class="label mb-1">balance</p>
      <p>
        <span class="value-display">{{ balanceXtz }}</span>
        <span class="value-unit">XTZ</span>
      </p>
    </div>

    <!-- Owner & Spender -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div class="card-subtle p-3">
        <p class="label">owner</p>
        <p class="mono text-sm text-text-primary break-all">{{ storage.owner }}</p>
      </div>
      <div class="card-subtle p-3">
        <p class="label">spender</p>
        <p class="mono text-sm text-text-primary break-all">{{ storage.spender }}</p>
      </div>
    </div>
  </section>
</template>
