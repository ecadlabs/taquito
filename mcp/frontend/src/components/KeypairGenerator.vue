<script setup lang="ts">
import { ref } from 'vue'
import { useKeypairStore } from '@/stores'
import { copyToClipboard } from '@/utils'

defineProps<{
  title?: string
  description?: string
  useButtonText?: string
}>()

const emit = defineEmits<{
  use: [address: string]
}>()

const keypairStore = useKeypairStore()
const copyFeedback = ref('')

async function handleCopy(text: string, label: string): Promise<void> {
  await copyToClipboard(text)
  copyFeedback.value = label
  setTimeout(() => { copyFeedback.value = '' }, 2000)
}

function handleUse(): void {
  if (keypairStore.generatedKeypair) {
    emit('use', keypairStore.generatedKeypair.address)
  }
}
</script>

<template>
  <div class="card-subtle p-4">
    <p class="text-sm font-medium text-text-primary mb-1">
      {{ title ?? 'Generate Spending Keypair' }}
    </p>
    <p class="text-sm text-text-muted mb-3">
      {{ description ?? 'Create a new keypair for the spender role.' }}
    </p>

    <button
      @click="keypairStore.generateKeypair()"
      :disabled="keypairStore.isGenerating"
      class="btn-secondary flex items-center gap-2 mb-3"
    >
      <span v-if="keypairStore.isGenerating" class="spinner spinner-dark"></span>
      {{ keypairStore.isGenerating ? 'Generating...' : 'Generate Keypair' }}
    </button>

    <div v-if="keypairStore.generatedKeypair" class="space-y-3">
      <div>
        <label class="label">address</label>
        <div class="flex items-center gap-2">
          <code class="mono bg-primary-100 px-2 py-1.5 rounded flex-1 break-all text-sm">
            {{ keypairStore.generatedKeypair.address }}
          </code>
          <button
            @click="handleCopy(keypairStore.generatedKeypair.address, 'address')"
            class="btn-secondary !py-1.5 !px-2 text-xs"
          >
            {{ copyFeedback === 'address' ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>

      <div>
        <label class="label">secret key</label>
        <div class="flex items-center gap-1.5 mb-2 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded text-amber-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span class="text-xs font-medium">Save this key now — it won't be shown again</span>
        </div>
        <div class="flex items-center gap-2">
          <code class="mono bg-error/5 text-error/80 px-2 py-1.5 rounded flex-1 break-all text-sm">
            {{ `${keypairStore.generatedKeypair.secretKey.slice(0, 8)}...${keypairStore.generatedKeypair.secretKey.slice(-6)}` }}
          </code>
          <button
            @click="handleCopy(keypairStore.generatedKeypair.secretKey, 'secret')"
            class="btn-secondary !py-1.5 !px-2 text-xs"
          >
            {{ copyFeedback === 'secret' ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>

      <button @click="handleUse" class="btn-primary text-sm">
        {{ useButtonText ?? 'Use as Spender' }}
      </button>
    </div>
  </div>
</template>
