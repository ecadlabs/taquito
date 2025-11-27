<script setup lang="ts">
import { ref, type Ref } from 'vue'

defineProps<{
  /** Daily limit in XTZ (formatted) */
  dailyLimitXtz: string
  /** Per-transaction limit in XTZ (formatted) */
  perTxLimitXtz: string
  /** Amount spent today in XTZ (formatted) */
  spentTodayXtz: string
  /** Percentage of daily limit spent */
  spentPercentage: number
  /** Countdown until reset (formatted HH:MM:SS) */
  resetCountdown: string | null
  /** Whether current user is the owner */
  isOwner: boolean
  /** Whether operation is loading */
  isLoading: boolean
}>()

const emit = defineEmits<{
  setLimits: [dailyLimit: number, perTxLimit: number]
}>()

// Local state
const newDailyLimit: Ref<string> = ref('')
const newPerTxLimit: Ref<string> = ref('')

/**
 * Handle set limits
 */
function handleSetLimits(): void {
  const daily = parseFloat(newDailyLimit.value)
  const perTx = parseFloat(newPerTxLimit.value)
  if (isNaN(daily) || isNaN(perTx)) return
  emit('setLimits', daily, perTx)
  newDailyLimit.value = ''
  newPerTxLimit.value = ''
}
</script>

<template>
  <section class="card p-5 mb-5">
    <p class="section-label mb-4">spending limits</p>

    <!-- Progress -->
    <div class="mb-5">
      <div class="flex items-baseline justify-between mb-2">
        <p class="text-sm text-text-secondary">Spent Today</p>
        <p class="mono text-text-primary text-sm">
          {{ spentTodayXtz }} / {{ dailyLimitXtz }} XTZ
        </p>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-fill" :style="{ width: `${spentPercentage}%` }"></div>
      </div>
      <div class="flex justify-between mt-1.5">
        <p class="text-xs text-text-muted">{{ Math.round(spentPercentage) }}% used</p>
        <p v-if="resetCountdown" class="text-xs text-text-muted mono">
          resets in {{ resetCountdown }}
        </p>
      </div>
    </div>

    <!-- Limits -->
    <div class="grid grid-cols-2 gap-3 mb-5">
      <div class="card-subtle p-3 text-center">
        <p class="label">daily limit</p>
        <p>
          <span class="value-display text-xl">{{ dailyLimitXtz }}</span>
          <span class="value-unit text-xs">XTZ</span>
        </p>
      </div>
      <div class="card-subtle p-3 text-center">
        <p class="label">per-tx limit</p>
        <p>
          <span class="value-display text-xl">{{ perTxLimitXtz }}</span>
          <span class="value-unit text-xs">XTZ</span>
        </p>
      </div>
    </div>

    <!-- Update Limits (Owner) -->
    <div v-if="isOwner">
      <div class="divider"></div>
      <p class="text-sm font-medium text-text-primary mb-3">Update Limits</p>
      <div class="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label class="label">new daily limit</label>
          <input v-model="newDailyLimit" type="number" :placeholder="dailyLimitXtz" class="input-field" />
        </div>
        <div>
          <label class="label">new per-tx limit</label>
          <input v-model="newPerTxLimit" type="number" :placeholder="perTxLimitXtz" class="input-field" />
        </div>
      </div>
      <button
        @click="handleSetLimits"
        :disabled="isLoading || !newDailyLimit || !newPerTxLimit"
        class="btn-primary flex items-center gap-2"
      >
        <span v-if="isLoading" class="spinner"></span>
        Update Limits
      </button>
    </div>
  </section>
</template>
