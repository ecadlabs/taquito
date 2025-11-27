<script setup lang="ts">
import { ref } from 'vue'
import { useContractStore } from '@/stores'

const contractStore = useContractStore()
const newSpenderAddress = ref('')

async function handleSetSpender(): Promise<void> {
  if (!newSpenderAddress.value) return
  await contractStore.setSpender(newSpenderAddress.value)
  newSpenderAddress.value = ''
}
</script>

<template>
  <section class="card p-5 mb-5">
    <p class="section-label mb-4">spender management</p>

    <div class="card-subtle p-3 mb-4">
      <p class="label">current spender</p>
      <p class="mono text-sm text-text-primary break-all">{{ contractStore.storage?.spender }}</p>
    </div>

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
