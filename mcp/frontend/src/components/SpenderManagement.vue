<script setup lang="ts">
import { ref } from 'vue'
import { InMemorySigner } from '@taquito/signer'
import { b58cencode, prefix } from '@taquito/utils'
import { useContractStore } from '@/stores'
import ConfirmationModal from './ConfirmationModal.vue'
import NewSpenderSuccess from './NewSpenderSuccess.vue'
import type { Keypair } from '@/types'

const contractStore = useContractStore()

// State
const showConfirmModal = ref(false)
const isRegenerating = ref(false)
const newKeypair = ref<Keypair | null>(null)

function generateRandomBytes(length = 32): Uint8Array {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return array
}

async function generateKeypair(): Promise<Keypair> {
  const seed = generateRandomBytes(32)
  const secretKey = b58cencode(seed, prefix.edsk2)
  const signer = await InMemorySigner.fromSecretKey(secretKey)

  const publicKey = await signer.publicKey()
  const address = await signer.publicKeyHash()

  return {
    address,
    publicKey,
    secretKey,
  }
}

async function handleRegenerateConfirm(): Promise<void> {
  isRegenerating.value = true

  try {
    // Generate new keypair
    const keypair = await generateKeypair()

    // Update contract with new spender
    await contractStore.setSpender(keypair.address)

    // Show success with keypair
    newKeypair.value = keypair
    showConfirmModal.value = false
  } catch (error) {
    console.error('Failed to regenerate spender:', error)
  } finally {
    isRegenerating.value = false
  }
}

function handleDone(): void {
  newKeypair.value = null
}
</script>

<template>
  <section class="card p-5 mb-5">
    <p class="section-label mb-4">spender management</p>

    <!-- Current Spender -->
    <div class="card-subtle p-3 mb-4">
      <p class="label">current spender</p>
      <p class="mono text-sm text-text-primary break-all">{{ contractStore.storage?.spender }}</p>
    </div>

    <!-- Success State: Show new keypair -->
    <NewSpenderSuccess
      v-if="newKeypair"
      :keypair="newKeypair"
      @done="handleDone"
    />

    <!-- Default State: Regenerate option -->
    <div v-else class="card-subtle p-4 border border-amber-200 bg-amber-50/50">
      <div class="flex items-start gap-3 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div>
          <p class="text-sm font-medium text-amber-800 mb-1">Regenerate Spender Keypair</p>
          <p class="text-sm text-amber-700">
            This will generate a new spending keypair and update the contract.
            The current spender key will <strong>stop working immediately</strong>.
            You'll need to update your MCP server configuration with the new secret key.
          </p>
        </div>
      </div>

      <button
        @click="showConfirmModal = true"
        :disabled="contractStore.isLoading"
        class="btn-danger w-full flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Regenerate Spender Key
      </button>
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      v-if="showConfirmModal"
      title="Regenerate Spender Key?"
      message="This action cannot be undone. The current spender key will be invalidated immediately and any services using it will lose access."
      confirm-text="Regenerate"
      cancel-text="Cancel"
      variant="danger"
      :is-loading="isRegenerating"
      @confirm="handleRegenerateConfirm"
      @cancel="showConfirmModal = false"
    />
  </section>
</template>
