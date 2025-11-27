<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useContractStore } from '@/stores'
import { mutezToXtz, formatXtz } from '@/utils'

const contractStore = useContractStore()

// Local state for form inputs
const newDailyLimit = ref('')
const newPerTxLimit = ref('')

// Countdown timer
const resetCountdown = ref<string | null>(null)
let countdownInterval: ReturnType<typeof setInterval> | null = null

// Computed values derived from store
const dailyLimitXtz = computed(() => {
  if (!contractStore.storage) return '0'
  return formatXtz(mutezToXtz(contractStore.storage.daily_limit))
})

const perTxLimitXtz = computed(() => {
  if (!contractStore.storage) return '0'
  return formatXtz(mutezToXtz(contractStore.storage.per_tx_limit))
})

const spentTodayXtz = computed(() => {
  if (!contractStore.storage) return '0'
  return formatXtz(mutezToXtz(contractStore.storage.spent_today))
})

const spentPercentage = computed(() => {
  if (!contractStore.storage || contractStore.storage.daily_limit === 0) return 0
  return Math.min(100, (contractStore.storage.spent_today / contractStore.storage.daily_limit) * 100)
})

function updateCountdown(): void {
  if (!contractStore.storage?.last_reset) {
    resetCountdown.value = null
    return
  }

  const lastReset = new Date(contractStore.storage.last_reset).getTime()
  const now = Date.now()
  const resetTime = lastReset + 24 * 60 * 60 * 1000
  const remaining = Math.max(0, resetTime - now)

  if (remaining <= 0) {
    resetCountdown.value = '00:00:00'
    return
  }

  const totalSeconds = Math.floor(remaining / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  resetCountdown.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

async function handleSetLimits(): Promise<void> {
  const daily = parseFloat(newDailyLimit.value)
  const perTx = parseFloat(newPerTxLimit.value)
  if (isNaN(daily) || isNaN(perTx)) return
  await contractStore.setLimits(daily, perTx)
  newDailyLimit.value = ''
  newPerTxLimit.value = ''
}

onMounted(() => {
  countdownInterval = setInterval(updateCountdown, 1000)
  updateCountdown()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
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
    <div v-if="contractStore.isOwner">
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
        :disabled="contractStore.isLoading || !newDailyLimit || !newPerTxLimit"
        class="btn-primary flex items-center gap-2"
      >
        <span v-if="contractStore.isLoading" class="spinner"></span>
        Update Limits
      </button>
    </div>
  </section>
</template>
