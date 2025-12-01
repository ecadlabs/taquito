<script setup lang="ts">
import { ref } from 'vue'
import { copyToClipboard } from '@/utils'
import type { Keypair } from '@/types'

defineProps<{
  contractAddress: string
  keypair: Keypair
}>()

const emit = defineEmits<{
  continue: []
}>()

const copyFeedback = ref('')
const secretKeyCopied = ref(false)

async function handleCopy(text: string, label: string): Promise<void> {
  await copyToClipboard(text)
  copyFeedback.value = label
  if (label === 'secret') {
    secretKeyCopied.value = true
  }
  setTimeout(() => { copyFeedback.value = '' }, 2000)
}

function downloadKeypair(keypair: Keypair): void {
  const data = JSON.stringify(keypair, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `spending-keypair-${keypair.address.slice(0, 8)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}
</script>

<template>
  <section class="card p-5 mb-5">
    <div class="text-center mb-5">
      <div class="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 class="text-lg font-semibold text-text-primary">Contract Deployed Successfully</h2>
      <p class="text-sm text-text-muted mt-1">Your spending wallet is ready to use</p>
    </div>

    <!-- Contract Address -->
    <div class="card-subtle p-4 mb-4">
      <label class="label">contract address</label>
      <div class="flex items-center gap-2">
        <code class="mono bg-primary-100 px-2 py-1.5 rounded flex-1 break-all text-sm">
          {{ contractAddress }}
        </code>
        <button
          @click="handleCopy(contractAddress, 'contract')"
          class="btn-secondary !py-1.5 !px-2 text-xs"
        >
          {{ copyFeedback === 'contract' ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <!-- Keypair Details -->
    <div class="card-subtle p-4 mb-4 border-2 border-amber-200 bg-amber-50/50">
      <div class="flex items-center gap-2 mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span class="font-semibold text-amber-800">Save Your Spending Keypair</span>
      </div>
      <p class="text-sm text-amber-700 mb-4">
        This keypair was generated for your spender account. Save it now — you won't see it again.
        You'll need the secret key to configure your MCP server.
      </p>

      <!-- Spender Address -->
      <div class="mb-3">
        <label class="label">spender address</label>
        <div class="flex items-center gap-2">
          <code class="mono bg-white px-2 py-1.5 rounded flex-1 break-all text-sm border border-amber-200">
            {{ keypair.address }}
          </code>
          <button
            @click="handleCopy(keypair.address, 'address')"
            class="btn-secondary !py-1.5 !px-2 text-xs"
          >
            {{ copyFeedback === 'address' ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>

      <!-- Secret Key -->
      <div class="mb-4">
        <label class="label">secret key</label>
        <div class="flex items-center gap-2">
          <code class="mono bg-error/5 text-error/80 px-2 py-1.5 rounded flex-1 break-all text-sm border border-red-200">
            {{ keypair.secretKey }}
          </code>
          <button
            @click="handleCopy(keypair.secretKey, 'secret')"
            class="btn-secondary !py-1.5 !px-2 text-xs"
          >
            {{ copyFeedback === 'secret' ? 'Copied!' : 'Copy' }}
          </button>
        </div>
      </div>

      <!-- Download Button -->
      <button
        @click="downloadKeypair(keypair)"
        class="btn-secondary w-full flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Keypair JSON
      </button>
    </div>

    <!-- Continue Button -->
    <button
      @click="emit('continue')"
      class="btn-primary w-full"
    >
      Continue to Dashboard
    </button>
  </section>
</template>
