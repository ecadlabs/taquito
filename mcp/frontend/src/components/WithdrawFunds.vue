<script setup lang="ts">
import { ref, computed } from 'vue'
import { useWalletStore, useContractStore } from '@/stores'
import { mutezToXtz, formatXtz } from '@/utils'

const walletStore = useWalletStore()
const contractStore = useContractStore()

const withdrawRecipient = ref('')
const withdrawAmount = ref('')

const balanceXtz = computed(() => {
  if (contractStore.contractBalance === null) return '0'
  return formatXtz(mutezToXtz(contractStore.contractBalance))
})

async function handleWithdraw(): Promise<void> {
  const amount = parseFloat(withdrawAmount.value)
  if (!withdrawRecipient.value || isNaN(amount)) return
  await contractStore.withdraw(withdrawRecipient.value, amount)
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
          :placeholder="walletStore.userAddress ?? undefined"
          class="input-field mono"
        />
      </div>
      <div>
        <label class="label">amount (xtz)</label>
        <input v-model="withdrawAmount" type="number" :placeholder="`Max: ${balanceXtz}`" class="input-field" />
      </div>
      <button
        @click="handleWithdraw"
        :disabled="contractStore.isLoading || !withdrawRecipient || !withdrawAmount"
        class="btn-primary w-full flex items-center justify-center gap-2"
      >
        <span v-if="contractStore.isLoading" class="spinner"></span>
        Withdraw
      </button>
    </div>
  </section>
</template>
