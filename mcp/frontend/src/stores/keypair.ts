import { defineStore } from 'pinia'
import { ref } from 'vue'
import { InMemorySigner } from '@taquito/signer'
import { b58cencode, prefix } from '@taquito/utils'
import type { Keypair } from '@/types'

export const useKeypairStore = defineStore('keypair', () => {
  // State
  const generatedKeypair = ref<Keypair | null>(null)
  const isGenerating = ref(false)
  const error = ref<string | null>(null)

  // Actions
  function generateRandomBytes(length = 32): Uint8Array {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return array
  }

  async function generateKeypair(): Promise<Keypair> {
    isGenerating.value = true
    error.value = null

    try {
      const seed = generateRandomBytes(32)
      const secretKey = b58cencode(seed, prefix.edsk2)
      const signer = await InMemorySigner.fromSecretKey(secretKey)

      const publicKey = await signer.publicKey()
      const address = await signer.publicKeyHash()

      const keypair: Keypair = {
        address,
        publicKey,
        secretKey,
      }

      generatedKeypair.value = keypair
      return keypair
    } catch (err) {
      console.error('Failed to generate keypair:', err)
      error.value = err instanceof Error ? err.message : 'Failed to generate keypair'
      throw err
    } finally {
      isGenerating.value = false
    }
  }

  function clearKeypair(): void {
    generatedKeypair.value = null
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

  return {
    // State
    generatedKeypair,
    isGenerating,
    error,
    // Actions
    generateKeypair,
    clearKeypair,
    downloadKeypair,
  }
})
