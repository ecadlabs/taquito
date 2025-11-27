<script setup lang="ts">
import { onMounted } from 'vue'
import { useWalletStore, useContractStore } from '@/stores'

// Components
import WalletConnection from './components/WalletConnection.vue'
import SetupSection from './components/SetupSection.vue'
import ContractInfo from './components/ContractInfo.vue'
import SpendingLimits from './components/SpendingLimits.vue'
import SpenderManagement from './components/SpenderManagement.vue'
import WithdrawFunds from './components/WithdrawFunds.vue'

const walletStore = useWalletStore()
const contractStore = useContractStore()

onMounted(async () => {
  await walletStore.init()
  if (contractStore.contractAddress) {
    await contractStore.loadContract()
  }
})
</script>

<template>
  <div class="film-grain"></div>

  <div class="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="max-w-2xl mx-auto">

      <!-- Header -->
      <header class="mb-6">
        <h1 class="text-3xl font-semibold tracking-tight text-text-primary">
          Tezos MCP Configuration
        </h1>
      </header>

      <!-- Wallet Connection -->
      <WalletConnection />

      <!-- Setup Section (when no contract) -->
      <SetupSection v-if="walletStore.isConnected && !contractStore.contractAddress" />

      <!-- Contract Dashboard -->
      <template v-if="contractStore.contractAddress && contractStore.storage">
        <ContractInfo />
        <SpendingLimits />
        <SpenderManagement v-if="contractStore.isOwner" />
        <WithdrawFunds v-if="contractStore.isOwner" />

        <!-- Refresh -->
        <div class="text-center">
          <button
            @click="contractStore.refreshStorage()"
            :disabled="contractStore.isLoading"
            class="btn-secondary flex items-center gap-2 mx-auto"
          >
            <span v-if="contractStore.isLoading" class="spinner spinner-dark"></span>
            Refresh
          </button>
        </div>
      </template>

      <!-- Error -->
      <div v-if="contractStore.error" class="card p-4 mt-5 border border-error/20 bg-error/5">
        <p class="text-sm text-error">{{ contractStore.error }}</p>
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
