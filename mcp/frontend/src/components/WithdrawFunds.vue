<script setup lang="ts">
import { ref, type Ref } from 'vue'

defineProps<{
  /** Connected user address */
  userAddress: string | null
  /** Contract balance in XTZ (formatted) */
  balanceXtz: string
  /** Whether operation is loading */
  isLoading: boolean
}>()

const emit = defineEmits<{
  withdraw: [recipient: string, amount: number]
}>()

// Local state
const withdrawRecipient: Ref<string> = ref('')
const withdrawAmount: Ref<string> = ref('')

/**
 * Handle withdraw
 */
function handleWithdraw(): void {
  const amount = parseFloat(withdrawAmount.value)
  if (!withdrawRecipient.value || isNaN(amount)) return
  emit('withdraw', withdrawRecipient.value, amount)
  withdrawRecipient.value = ''
  withdrawAmount.value = ''
}
</script>

<template>
  <section class="card p-5 mb-5">
    <p class="section-label mb-4">withdraw funds</p>
    <p class="text-sm text-text-muted mb-4">
      Withdraw any amount without limits.
    </p>

    <div class="space-y-3">
      <div>
        <label class="label">recipient</label>
        <input
          v-model="withdrawRecipient"
          type="text"
          :placeholder="userAddress ?? undefined"
          class="input-field mono"
        />
      </div>
      <div>
        <label class="label">amount (xtz)</label>
        <input v-model="withdrawAmount" type="number" :placeholder="`Max: ${balanceXtz}`" class="input-field" />
      </div>
      <button
        @click="handleWithdraw"
        :disabled="isLoading || !withdrawRecipient || !withdrawAmount"
        class="btn-primary w-full flex items-center justify-center gap-2"
      >
        <span v-if="isLoading" class="spinner"></span>
        Withdraw
      </button>
    </div>
  </section>
</template>
