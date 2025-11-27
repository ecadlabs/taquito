<script setup lang="ts">
import { ref, type Ref } from 'vue'
import type { GeneratedKeypair } from '@/types'

const props = defineProps<{
  /** Connected user address */
  userAddress: string | null
  /** Generated keypair data */
  generatedKeypair: GeneratedKeypair | null
  /** Whether keypair generation is in progress */
  isGenerating: boolean
  /** Whether contract operation is loading */
  isLoading: boolean
}>()

const emit = defineEmits<{
  generateKeypair: []
  useKeypair: []
  copyToClipboard: [text: string, label: string]
  downloadKeypair: [keypair: GeneratedKeypair]
  originate: [spender: string, dailyLimit: number, perTxLimit: number]
  connectContract: [address: string]
}>()

// Local state
const existingContractAddress: Ref<string> = ref('')
const originateSpenderAddress: Ref<string> = ref('')
const originateDailyLimit: Ref<string> = ref('100')
const originatePerTxLimit: Ref<string> = ref('10')
const copyFeedback: Ref<string> = ref('')

/**
 * Handle copy with feedback
 */
async function handleCopy(text: string, label: string): Promise<void> {
  emit('copyToClipboard', text, label)
  copyFeedback.value = label
  setTimeout(() => { copyFeedback.value = '' }, 2000)
}

/**
 * Handle originate contract
 */
function handleOriginate(): void {
  if (!props.userAddress) return
  const spender = originateSpenderAddress.value || props.userAddress
  const dailyLimit = parseFloat(originateDailyLimit.value) || 100
  const perTxLimit = parseFloat(originatePerTxLimit.value) || 10
  emit('originate', spender, dailyLimit, perTxLimit)
}

/**
 * Handle connect existing contract
 */
function handleConnectContract(): void {
  if (!existingContractAddress.value) return
  emit('connectContract', existingContractAddress.value)
  existingContractAddress.value = ''
}

/**
 * Use generated keypair as spender
 */
function useGeneratedKeypair(): void {
  if (props.generatedKeypair) {
    originateSpenderAddress.value = props.generatedKeypair.address
    emit('useKeypair')
  }
}
</script>

<template>
  <section class="card p-5 mb-5">
    <p class="section-label mb-4">get started</p>

    <!-- Generate Keypair -->
    <div class="card-subtle p-4 mb-5">
      <p class="text-sm font-medium text-text-primary mb-1">Generate Spending Keypair</p>
      <p class="text-sm text-text-muted mb-3">
        Create a new keypair for the spender role.
      </p>

      <button
        @click="emit('generateKeypair')"
        :disabled="isGenerating"
        class="btn-secondary flex items-center gap-2 mb-3"
      >
        <span v-if="isGenerating" class="spinner spinner-dark"></span>
        {{ isGenerating ? 'Generating...' : 'Generate Keypair' }}
      </button>

      <div v-if="generatedKeypair" class="space-y-3">
        <div>
          <label class="label">address</label>
          <div class="flex items-center gap-2">
            <code class="mono bg-primary-100 px-2 py-1.5 rounded flex-1 break-all text-sm">
              {{ generatedKeypair.address }}
            </code>
            <button
              @click="handleCopy(generatedKeypair.address, 'address')"
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
              {{ `${generatedKeypair.secretKey.slice(0, 8)}...${generatedKeypair.secretKey.slice(generatedKeypair.secretKey.length - 6)}` }}
            </code>
            <button
              @click="handleCopy(generatedKeypair.secretKey, 'secret')"
              class="btn-secondary !py-1.5 !px-2 text-xs"
            >
              {{ copyFeedback === 'secret' ? 'Copied!' : 'Copy' }}
            </button>
          </div>
        </div>

        <div class="flex gap-2">
          <button @click="emit('downloadKeypair', generatedKeypair)" class="btn-secondary text-sm">
            Download JSON
          </button>
          <button @click="useGeneratedKeypair" class="btn-primary text-sm">
            Use as Spender
          </button>
        </div>
      </div>
    </div>

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
            :placeholder="userAddress ?? 'tz1...'"
            class="input-field mono"
          />
          <p class="mt-1 text-xs text-text-muted">Leave empty to use your address</p>
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
          :disabled="isLoading"
          class="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span v-if="isLoading" class="spinner"></span>
          {{ isLoading ? 'Deploying...' : 'Deploy Contract' }}
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
          :disabled="!existingContractAddress || isLoading"
          class="btn-secondary"
        >
          Connect
        </button>
      </div>
    </div>
  </section>
</template>
