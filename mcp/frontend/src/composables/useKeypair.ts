import { ref, type Ref } from 'vue'
import { InMemorySigner } from '@taquito/signer'
import { b58cencode, prefix } from '@taquito/utils'
import type { Keypair } from '@/types'

/** Generated keypair */
const generatedKeypair: Ref<Keypair | null> = ref(null)

/** Whether generation is in progress */
const isGenerating: Ref<boolean> = ref(false)

/** Last error message */
const error: Ref<string | null> = ref(null)

/**
 * Return type for the useKeypair composable
 */
export interface UseKeypairReturn {
  /** Generated keypair */
  generatedKeypair: Ref<Keypair | null>
  /** Whether generation is in progress */
  isGenerating: Ref<boolean>
  /** Last error message */
  error: Ref<string | null>
  /** Generate a new keypair */
  generateKeypair: () => Promise<Keypair>
  /** Clear the generated keypair */
  clearKeypair: () => void
  /** Copy text to clipboard */
  copyToClipboard: (text: string) => Promise<boolean>
  /** Download keypair as JSON file */
  downloadKeypair: (keypair: Keypair) => void
}

/**
 * Composable for generating Tezos Ed25519 keypairs.
 * Used to create spending keypairs that can be used with the
 * spending-limited wallet contract.
 *
 * @returns Keypair state and methods
 *
 * @example
 * ```ts
 * const { generateKeypair, generatedKeypair, downloadKeypair } = useKeypair()
 *
 * // Generate a new keypair
 * const keypair = await generateKeypair()
 *
 * // Download for safekeeping
 * downloadKeypair(keypair)
 *
 * // Use the address as spender
 * console.log('Spender address:', keypair.address)
 * ```
 */
export function useKeypair(): UseKeypairReturn {
  /**
   * Generate cryptographically secure random bytes.
   * Uses the Web Crypto API for secure random number generation.
   *
   * @param length - Number of bytes to generate
   * @returns Uint8Array of random bytes
   */
  function generateRandomBytes(length = 32): Uint8Array {
    const array = new Uint8Array(length)
    crypto.getRandomValues(array)
    return array
  }

  /**
   * Generate a new Ed25519 keypair for spending.
   * Creates a random seed, encodes it as a Tezos secret key,
   * and derives the public key and address.
   *
   * @returns The generated keypair with address, publicKey, and secretKey
   *
   * @example
   * ```ts
   * const keypair = await generateKeypair()
   * // keypair.address: "tz1..."
   * // keypair.publicKey: "edpk..."
   * // keypair.secretKey: "edsk..."
   * ```
   */
  async function generateKeypair(): Promise<Keypair> {
    isGenerating.value = true
    error.value = null

    try {
      // Generate random seed (32 bytes for Ed25519)
      const seed = generateRandomBytes(32)

      // Encode as edsk2 secret key (seed format)
      const secretKey = b58cencode(seed, prefix.edsk2)

      // Create signer from secret key to derive public key and address
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

  /**
   * Clear the generated keypair from state.
   * Use this when the user is done with the keypair or wants to generate a new one.
   */
  function clearKeypair(): void {
    generatedKeypair.value = null
  }

  /**
   * Copy text to clipboard.
   * Uses the modern Clipboard API with fallback for older browsers.
   *
   * @param text - Text to copy
   * @returns True if successful, false otherwise
   */
  async function copyToClipboard(text: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fallback for older browsers or restricted contexts
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      textarea.style.pointerEvents = 'none'
      document.body.appendChild(textarea)
      textarea.select()

      try {
        document.execCommand('copy')
        return true
      } catch {
        return false
      } finally {
        document.body.removeChild(textarea)
      }
    }
  }

  /**
   * Download keypair as a JSON file.
   * The file is named with a prefix of the address for identification.
   *
   * @param keypair - The keypair to download
   *
   * @example
   * ```ts
   * downloadKeypair(generatedKeypair.value)
   * // Downloads: spending-keypair-tz1abc123.json
   * ```
   */
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

    // Clean up the blob URL
    URL.revokeObjectURL(url)
  }

  return {
    // State
    generatedKeypair,
    isGenerating,
    error,

    // Methods
    generateKeypair,
    clearKeypair,
    copyToClipboard,
    downloadKeypair,
  }
}
