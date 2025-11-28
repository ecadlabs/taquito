<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWalletStore, useContractStore } from '@/stores'
import KeypairGenerator from './KeypairGenerator.vue'

const walletStore = useWalletStore()
const contractStore = useContractStore()

// Local state
const existingContractAddress = ref('')
const originateSpenderAddress = ref('')
const originateDailyLimit = ref('100')
const originatePerTxLimit = ref('10')

const isSpenderOwnAddress = computed(() => {
  return originateSpenderAddress.value === walletStore.userAddress
})

const canDeploy = computed(() => {
  return originateSpenderAddress.value.trim() !== '' && !isSpenderOwnAddress.value
})

async function handleOriginate(): Promise<void> {
  if (!walletStore.userAddress || !canDeploy.value) return
  const dailyLimit = parseFloat(originateDailyLimit.value) || 100
  const perTxLimit = parseFloat(originatePerTxLimit.value) || 10
  await contractStore.originateContract(walletStore.userAddress, originateSpenderAddress.value, dailyLimit, perTxLimit)
}

async function handleConnectContract(): Promise<void> {
  if (!existingContractAddress.value) return
  await contractStore.setContractAddress(existingContractAddress.value)
  existingContractAddress.value = ''
}

function handleKeypairUse(address: string): void {
  originateSpenderAddress.value = address
}
</script>

<template>
  <section class="card p-5 mb-5">
    <p class="section-label mb-4">get started</p>

    <!-- Generate Keypair -->
    <KeypairGenerator
      class="mb-5"
      title="Generate Spending Keypair"
      description="Create a new keypair for the spender role."
      use-button-text="Use as Spender"
      @use="handleKeypairUse"
    />

    <div class="divider"></div>

    <!-- Deploy New -->
    <div class="mb-5">
      <p class="text-sm font-medium text-text-primary mb-3">Deploy New Wallet Contract</p>

      <div class="space-y-3">
        <div>
          <label class="label">spender address</label>
          <input
            v-model="originateSpenderAddress"
            type="text"
            placeholder="tz1..."
            class="input-field mono"
          />
          <p v-if="isSpenderOwnAddress" class="mt-1 text-xs text-red-400">Spender cannot be your own address</p>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="label">daily limit (xtz)</label>
            <input v-model="originateDailyLimit" type="number" placeholder="100" class="input-field" />
          </div>
          <div>
            <label class="label">per-tx limit (xtz)</label>
            <input v-model="originatePerTxLimit" type="number" placeholder="10" class="input-field" />
          </div>
        </div>

        <button
          @click="handleOriginate"
          :disabled="!canDeploy || contractStore.isLoading"
          class="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span v-if="contractStore.isLoading" class="spinner"></span>
          {{ contractStore.isLoading ? 'Deploying...' : 'Deploy Contract' }}
        </button>
      </div>
    </div>

    <div class="divider"></div>

    <!-- Connect Existing -->
    <div>
      <p class="text-sm font-medium text-text-primary mb-3">Connect Existing Contract</p>
      <div class="flex gap-2">
        <input
          v-model="existingContractAddress"
          type="text"
          placeholder="KT1..."
          class="input-field mono flex-1"
        />
        <button
          @click="handleConnectContract"
          :disabled="!existingContractAddress || contractStore.isLoading"
          class="btn-secondary"
        >
          Connect
        </button>
      </div>
    </div>
  </section>
</template>
