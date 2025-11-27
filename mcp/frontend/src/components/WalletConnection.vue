<script setup lang="ts">
import { useWalletStore } from '@/stores'
import { formatAddress } from '@/utils'

const walletStore = useWalletStore()
</script>

<template>
  <section class="card p-5 mb-5">
    <div class="flex items-center justify-between">
      <div>
        <p class="section-label mb-1">your personal wallet</p>
        <p v-if="walletStore.isConnected" class="mono text-text-primary">
          {{ formatAddress(walletStore.userAddress, 8, 6) }}
        </p>
        <p v-else class="text-text-muted text-sm">
          Not connected
        </p>
      </div>
      <button
        v-if="!walletStore.isConnected"
        @click="walletStore.connect()"
        :disabled="walletStore.isConnecting"
        class="btn-primary flex items-center gap-2"
      >
        <span v-if="walletStore.isConnecting" class="spinner"></span>
        {{ walletStore.isConnecting ? 'Connecting...' : 'Connect Wallet' }}
      </button>
      <button v-else @click="walletStore.disconnect()" class="btn-secondary">
        Disconnect
      </button>
    </div>
  </section>
</template>
