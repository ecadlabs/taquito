<script setup lang="ts">
defineProps<{
  /** Whether wallet is connected */
  isConnected: boolean
  /** Whether connection is in progress */
  isConnecting: boolean
  /** Connected wallet address */
  userAddress: string | null
}>()

const emit = defineEmits<{
  connect: []
  disconnect: []
}>()

/**
 * Formats a Tezos address for display
 */
function formatAddress(address: string | null, prefixLen = 8, suffixLen = 6): string {
  if (!address) return ''
  if (address.length <= prefixLen + suffixLen) return address
  return `${address.slice(0, prefixLen)}...${address.slice(-suffixLen)}`
}
</script>

<template>
  <section class="card p-5 mb-5">
    <div class="flex items-center justify-between">
      <div>
        <p class="section-label mb-1">wallet</p>
        <p v-if="isConnected" class="mono text-text-primary">
          {{ formatAddress(userAddress, 8, 6) }}
        </p>
        <p v-else class="text-text-muted text-sm">
          Not connected
        </p>
      </div>
      <button
        v-if="!isConnected"
        @click="emit('connect')"
        :disabled="isConnecting"
        class="btn-primary flex items-center gap-2"
      >
        <span v-if="isConnecting" class="spinner"></span>
        {{ isConnecting ? 'Connecting...' : 'Connect Wallet' }}
      </button>
      <button v-else @click="emit('disconnect')" class="btn-secondary">
        Disconnect
      </button>
    </div>
  </section>
</template>
