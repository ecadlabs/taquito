<script setup lang="ts">
defineProps<{
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  variant?: 'danger' | 'warning' | 'default'
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center">
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="emit('cancel')"
    ></div>

    <!-- Modal -->
    <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
      <!-- Icon -->
      <div class="flex justify-center mb-4">
        <div
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center',
            variant === 'danger' ? 'bg-red-100' : variant === 'warning' ? 'bg-amber-100' : 'bg-primary-100'
          ]"
        >
          <svg
            v-if="variant === 'danger'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <svg
            v-else-if="variant === 'warning'"
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-amber-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>

      <!-- Content -->
      <h3 class="text-lg font-semibold text-center text-text-primary mb-2">{{ title }}</h3>
      <p class="text-sm text-text-muted text-center mb-6">{{ message }}</p>

      <!-- Actions -->
      <div class="flex gap-3">
        <button
          @click="emit('cancel')"
          :disabled="isLoading"
          class="btn-secondary flex-1"
        >
          {{ cancelText ?? 'Cancel' }}
        </button>
        <button
          @click="emit('confirm')"
          :disabled="isLoading"
          :class="[
            'flex-1 flex items-center justify-center gap-2',
            variant === 'danger' ? 'btn-danger' : 'btn-primary'
          ]"
        >
          <span v-if="isLoading" class="spinner"></span>
          {{ confirmText ?? 'Confirm' }}
        </button>
      </div>
    </div>
  </div>
</template>
