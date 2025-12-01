<script setup lang="ts">
import { ref } from 'vue'
import { InMemorySigner } from '@taquito/signer'
import { b58cencode, prefix } from '@taquito/utils'
import { useWalletStore, useContractStore } from '@/stores'
import type { Keypair } from '@/types'

const walletStore = useWalletStore()
const contractStore = useContractStore()

// Local state
const existingContractAddress = ref('')
const originateDailyLimit = ref('100')
const originatePerTxLimit = ref('10')
const isDeploying = ref(false)

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

async function handleOriginate(): Promise<void> {
  if (!walletStore.userAddress) return

  isDeploying.value = true

  try {
    // Generate keypair automatically
    const keypair = await generateKeypair()

    const dailyLimit = parseFloat(originateDailyLimit.value) || 100
    const perTxLimit = parseFloat(originatePerTxLimit.value) || 10

    await contractStore.originateContract(
      walletStore.userAddress,
      keypair.address,
      dailyLimit,
      perTxLimit,
      keypair
    )
  } catch (error) {
    console.error('Deployment failed:', error)
  } finally {
    isDeploying.value = false
  }
}

async function handleConnectContract(): Promise<void> {
  if (!existingContractAddress.value) return
  await contractStore.setContractAddress(existingContractAddress.value)
  existingContractAddress.value = ''
}
</script>

<template>
  <section class="card p-5 mb-5">
    <p class="section-label mb-4">get started</p>

    <!-- Deploy New -->
    <div class="mb-5">
      <p class="text-sm font-medium text-text-primary mb-3">Deploy New Wallet Contract</p>
      <p class="text-sm text-text-muted mb-4">
        A spending keypair will be automatically generated when you deploy.
        Make sure to save the secret key - you'll need it to configure your MCP server.
      </p>

      <div class="space-y-3">
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
          :disabled="isDeploying || contractStore.isLoading"
          class="btn-primary w-full flex items-center justify-center gap-2"
        >
          <span v-if="isDeploying || contractStore.isLoading" class="spinner"></span>
          {{ isDeploying || contractStore.isLoading ? 'Deploying...' : 'Deploy Contract' }}
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
          :disabled="!existingContractAddress || contractStore.isLoading"
          class="btn-secondary"
        >
          Connect
        </button>
      </div>
    </div>
  </section>
</template>
