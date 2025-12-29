/**
 * @packageDocumentation
 * @module @taquito/trezor-signer
 */

import { Signer, ProhibitedActionError, InvalidDerivationPathError } from '@taquito/core';
import TrezorConnect from '@trezor/connect-web';
import { LocalForger } from '@taquito/local-forging';
import { b58Encode, b58DecodeAndCheckPrefix, PrefixV2, signaturePrefixes } from '@taquito/utils';
import {
  TrezorNotInitializedError,
  TrezorPublicKeyRetrievalError,
  TrezorSigningError,
  TrezorInitializationError,
  TrezorActionRejectedError,
} from './errors';
import { mapOperationsToTrezor } from './utils';
import type {
  TrezorSignerConfig,
  TrezorTezosAddress,
  TrezorTezosPublicKey,
  TrezorTezosSignedTx,
  TrezorResponse,
} from './types';

export { VERSION } from './version';
export {
  TrezorNotInitializedError,
  TrezorPublicKeyRetrievalError,
  TrezorSigningError,
  TrezorInitializationError,
  TrezorActionRejectedError,
  TrezorUnsupportedOperationError,
} from './errors';
export { InvalidDerivationPathError } from '@taquito/core';
export type { TrezorSignerConfig } from './types';

/**
 * Default Tezos derivation path template
 * Tezos uses BIP44 with coin type 1729
 * Path format: m/44'/1729'/account'
 */
export const HDPathTemplate = (account: number): string => {
  return `m/44'/1729'/${account}'`;
};

/**
 * Implementation of the Signer interface for Trezor hardware wallets
 *
 * @description Allows signing Tezos operations using a Trezor device via @trezor/connect
 */
export class TrezorSigner implements Signer {
  private static initialized = false;
  private _publicKey?: string;
  private _publicKeyHash?: string;
  private _path: string;
  private _showOnTrezor: boolean;

  /**
   * Initialize Trezor Connect. Must be called once before creating TrezorSigner instances.
   *
   * @param config Configuration options for Trezor Connect
   * @throws {TrezorInitializationError} If initialization fails
   */
  static async init(config: TrezorSignerConfig = {}): Promise<void> {
    if (TrezorSigner.initialized) {
      return;
    }

    try {
      await TrezorConnect.init({
        manifest: {
          appUrl: config.appUrl || 'https://taquito.io',
          email: config.email || 'info@ecadlabs.com',
          appName: config.appName || 'Taquito',
        },
        lazyLoad: false,
        popup: config.popup ?? true,
        transportReconnect: config.transportReconnect ?? true,
        debug: config.debug ?? false,
      });
      TrezorSigner.initialized = true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new TrezorInitializationError(message);
    }
  }

  /**
   * Check if Trezor Connect has been initialized
   */
  static isInitialized(): boolean {
    return TrezorSigner.initialized;
  }

  /**
   * Dispose of Trezor Connect resources
   */
  static dispose(): void {
    if (TrezorSigner.initialized) {
      TrezorConnect.dispose();
      TrezorSigner.initialized = false;
    }
  }

  /**
   * Creates a new TrezorSigner instance
   *
   * @param path BIP44 derivation path (default: "m/44'/1729'/0'")
   * @param showOnTrezor Whether to show address on device during connection (default: true)
   * @throws {InvalidDerivationPathError} If the path doesn't match Tezos BIP44 format
   */
  constructor(path: string = "m/44'/1729'/0'", showOnTrezor: boolean = true) {
    if (!path.match(/^m\/44'\/1729'\/\d+'$/)) {
      throw new InvalidDerivationPathError(
        path,
        `expecting format "m/44'/1729'/{account}'" (e.g., "m/44'/1729'/0'")`
      );
    }
    this._path = path;
    this._showOnTrezor = showOnTrezor;
  }

  /**
   * Get the public key hash (Tezos address) from the Trezor device
   *
   * @returns The public key hash (tz1 address)
   * @throws {TrezorNotInitializedError} If Trezor Connect is not initialized
   * @throws {TrezorPublicKeyRetrievalError} If unable to retrieve address from device
   */
  async publicKeyHash(): Promise<string> {
    if (!this._publicKeyHash) {
      await this.fetchAddressFromDevice();
    }
    if (this._publicKeyHash) {
      return this._publicKeyHash;
    }
    throw new TrezorPublicKeyRetrievalError();
  }

  /**
   * Get the public key from the Trezor device
   *
   * @returns The public key in base58 format (edpk...)
   * @throws {TrezorNotInitializedError} If Trezor Connect is not initialized
   * @throws {TrezorPublicKeyRetrievalError} If unable to retrieve public key from device
   */
  async publicKey(): Promise<string> {
    if (!this._publicKey) {
      await this.fetchAddressFromDevice();
    }
    if (this._publicKey) {
      return this._publicKey;
    }
    throw new TrezorPublicKeyRetrievalError();
  }

  /**
   * Secret key retrieval is not supported for hardware wallets
   *
   * @throws {ProhibitedActionError} Always throws as secret keys cannot be exported from Trezor
   */
  async secretKey(): Promise<string> {
    throw new ProhibitedActionError('Secret key cannot be exported from Trezor device');
  }

  /**
   * Sign an operation using the Trezor device
   *
   * @param op The operation bytes to sign (hex string, without watermark)
   * @param _watermark Ignored - Trezor handles watermarking internally
   * @returns The signed operation with signature
   * @throws {TrezorNotInitializedError} If Trezor Connect is not initialized
   * @throws {TrezorSigningError} If signing fails
   */
  async sign(
    op: string,
    _watermark?: Uint8Array
  ): Promise<{
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
  }> {
    this.ensureInitialized();

    // Parse the operation bytes to get structured data
    // Trezor only supports signing structured Tezos operations, not arbitrary payloads (like user defined strings)
    const forger = new LocalForger();
    let parsedOp;
    try {
      parsedOp = await forger.parse(op);
    } catch (error) {
      // If parsing fails, the bytes are not a valid forged operation
      // Trezor cannot sign arbitrary payloads, only structured operations
      throw new TrezorSigningError(
        'Trezor can only sign Tezos operations, not arbitrary payloads. ' +
          'The provided bytes could not be parsed as a valid forged operation. ' +
          'Arbitrary message signing (e.g., TZIP-17 off-chain signatures) is not supported by Trezor.'
      );
    }

    // Map operations to Trezor format
    let trezorOperation;
    try {
      trezorOperation = mapOperationsToTrezor(parsedOp.contents);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new TrezorSigningError(`Failed to map operations: ${message}`);
    }

    // Call Trezor to sign the transaction
    const response = (await TrezorConnect.tezosSignTransaction({
      path: this._path,
      branch: parsedOp.branch,
      operation: trezorOperation,
    })) as TrezorResponse<TrezorTezosSignedTx>;

    if (!response.success) {
      const error = response.payload as { error: string; code?: string };
      if (error.code === 'Failure_ActionCancelled') {
        throw new TrezorActionRejectedError();
      }
      throw new TrezorSigningError(error.error);
    }

    const payload = response.payload as TrezorTezosSignedTx;

    // The signature from Trezor is in base58 format with Ed25519 prefix (edsig...)
    const prefixSig = payload.signature;

    // Decode the signature to get raw bytes, then re-encode with generic prefix
    const [sigBytes] = b58DecodeAndCheckPrefix(prefixSig, signaturePrefixes);
    const sig = b58Encode(sigBytes, PrefixV2.GenericSignature);

    // Trezor's sig_op_contents contains the forged operation bytes + signature
    // This is what should be broadcast to the network
    const sigOpContents = payload.sig_op_contents;

    // Extract operation bytes (everything except last 128 hex chars which is 64-byte signature)
    const trezorBytes = sigOpContents.slice(0, -128);

    // Use Trezor's bytes and sig_op_contents since the signature is for those bytes
    return {
      bytes: trezorBytes,
      sig,
      prefixSig,
      sbytes: sigOpContents,
    };
  }

  /**
   * Fetches the address and public key from the Trezor device
   */
  private async fetchAddressFromDevice(): Promise<void> {
    this.ensureInitialized();

    // Fetch the address
    const addressResponse = (await TrezorConnect.tezosGetAddress({
      path: this._path,
      showOnTrezor: this._showOnTrezor,
    })) as TrezorResponse<TrezorTezosAddress>;

    if (!addressResponse.success) {
      const error = addressResponse.payload as { error: string; code?: string };
      if (error.code === 'Failure_ActionCancelled') {
        throw new TrezorActionRejectedError();
      }
      throw new TrezorPublicKeyRetrievalError(error.error);
    }

    const addressPayload = addressResponse.payload as TrezorTezosAddress;
    this._publicKeyHash = addressPayload.address;

    // Fetch the public key (don't show on device again since we just did)
    const pkResponse = (await TrezorConnect.tezosGetPublicKey({
      path: this._path,
      showOnTrezor: false,
    })) as TrezorResponse<TrezorTezosPublicKey>;

    if (!pkResponse.success) {
      const error = pkResponse.payload as { error: string; code?: string };
      if (error.code === 'Failure_ActionCancelled') {
        throw new TrezorActionRejectedError();
      }
      throw new TrezorPublicKeyRetrievalError(error.error);
    }

    const pkPayload = pkResponse.payload as TrezorTezosPublicKey;
    this._publicKey = pkPayload.publicKey;
  }

  /**
   * Ensures Trezor Connect is initialized
   */
  private ensureInitialized(): void {
    if (!TrezorSigner.initialized) {
      throw new TrezorNotInitializedError();
    }
  }
}
