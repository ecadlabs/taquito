<script setup lang="ts">
import { ref } from 'vue'
import { useContractStore, useKeypairStore } from '@/stores'
import KeypairGenerator from './KeypairGenerator.vue'

const contractStore = useContractStore()
const keypairStore = useKeypairStore()
const newSpenderAddress = ref('')

function handleKeypairUse(address: string): void {
  newSpenderAddress.value = address
}

async function handleSetSpender(): Promise<void> {
  if (!newSpenderAddress.value) return
  await contractStore.setSpender(newSpenderAddress.value)
  newSpenderAddress.value = ''
  keypairStore.generatedKeypair = null
}
</script>

<template>
  <section class="card p-5 mb-5">
    <p class="section-label mb-4">spender management</p>

    <div class="card-subtle p-3 mb-4">
      <p class="label">current spender</p>
      <p class="mono text-sm text-text-primary break-all">{{ contractStore.storage?.spender }}</p>
    </div>

    <!-- Generate New Keypair -->
    <KeypairGenerator
      class="mb-4"
      title="Generate New Spender Keypair"
      description="Create a new keypair for the spender role. Save the secret key to use with the MCP server."
      use-button-text="Use as New Spender"
      @use="handleKeypairUse"
    />

    <div class="divider"></div>

    <!-- Set Spender Address -->
    <div>
      <label class="label">new spender address</label>
      <div class="flex gap-2">
        <input v-model="newSpenderAddress" type="text" placeholder="tz1..." class="input-field mono flex-1" />
        <button
          @click="handleSetSpender"
          :disabled="contractStore.isLoading || !newSpenderAddress"
          class="btn-primary flex items-center gap-2"
        >
          <span v-if="contractStore.isLoading" class="spinner"></span>
          Update
        </button>
      </div>
    </div>
  </section>
</template>
