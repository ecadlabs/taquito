/**
 * @packageDocumentation
 * @module @taquito/trezor-signer
 */

import { Signer, ProhibitedActionError, InvalidDerivationPathError } from '@taquito/core';
import { b58Encode, PrefixV2 } from '@taquito/utils';
import TrezorConnect from '@trezor/connect-web';
import {
  TrezorNotInitializedError,
  TrezorPublicKeyRetrievalError,
  TrezorSigningError,
  TrezorInitializationError,
  TrezorActionRejectedError,
} from './errors';
import type { TrezorSignerConfig, TrezorTezosAddress, TrezorResponse } from './types';

export { VERSION } from './version';
export {
  TrezorNotInitializedError,
  TrezorPublicKeyRetrievalError,
  TrezorSigningError,
  TrezorInitializationError,
  TrezorActionRejectedError,
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
 *
 * @example
 * ```typescript
 * import { TrezorSigner } from '@taquito/trezor-signer';
 * import { TezosToolkit } from '@taquito/taquito';
 *
 * // Initialize Trezor Connect (required once before creating signers)
 * await TrezorSigner.init({
 *   appName: 'My Tezos App',
 *   appUrl: 'https://myapp.com'
 * });
 *
 * // Create a signer for the first account
 * const signer = new TrezorSigner("m/44'/1729'/0'");
 *
 * // Use with TezosToolkit
 * const Tezos = new TezosToolkit('https://mainnet.ecadinfra.com');
 * Tezos.setProvider({ signer });
 *
 * // Get the account address
 * const address = await signer.publicKeyHash();
 * console.log('Address:', address);
 * ```
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
   *
   * @example
   * ```typescript
   * await TrezorSigner.init({
   *   appName: 'My Tezos App',
   *   appUrl: 'https://myapp.com'
   * });
   * ```
   */
  static async init(config: TrezorSignerConfig = {}): Promise<void> {
    if (TrezorSigner.initialized) {
      return;
    }

    try {
      await TrezorConnect.init({
        manifest: {
          appUrl: config.appUrl || 'https://taquito.io',
          email: 'info@ecadlabs.com',
          appName: config.appName || 'Taquito',
        },
        lazyLoad: false,
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
   *
   * @example
   * ```typescript
   * // Default first account
   * const signer = new TrezorSigner();
   *
   * // Specific account
   * const signer2 = new TrezorSigner("m/44'/1729'/5'");
   *
   * // Without device confirmation
   * const signer3 = new TrezorSigner("m/44'/1729'/0'", false);
   * ```
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
   * @param op The operation bytes to sign (hex string)
   * @param _magicByte Optional magic byte (watermark) - currently not supported
   * @returns The signed operation with signature
   * @throws {TrezorNotInitializedError} If Trezor Connect is not initialized
   * @throws {TrezorSigningError} If signing fails
   *
   * @remarks
   * Note: This is a prototype implementation. Full transaction signing requires
   * parsing the operation bytes and using TrezorConnect.tezosSignTransaction
   * with structured operation data.
   */
  async sign(
    _op: string,
    _magicByte?: Uint8Array
  ): Promise<{
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
  }> {
    this.ensureInitialized();

    // Note: Full implementation would require parsing the operation bytes
    // and calling TrezorConnect.tezosSignTransaction with structured data.
    // This prototype throws an error indicating signing is not yet implemented.
    throw new TrezorSigningError(
      'Transaction signing not yet implemented in this prototype. ' +
        'Use this signer for address retrieval and balance viewing only.'
    );
  }

  /**
   * Fetches the address from the Trezor device
   */
  private async fetchAddressFromDevice(): Promise<void> {
    this.ensureInitialized();

    const response = (await TrezorConnect.tezosGetAddress({
      path: this._path,
      showOnTrezor: this._showOnTrezor,
    })) as TrezorResponse<TrezorTezosAddress>;

    if (!response.success) {
      const error = response.payload as { error: string; code?: string };
      if (error.code === 'Failure_ActionCancelled') {
        throw new TrezorActionRejectedError();
      }
      throw new TrezorPublicKeyRetrievalError(error.error);
    }

    const payload = response.payload as TrezorTezosAddress;
    this._publicKeyHash = payload.address;

    // Trezor returns the address directly; for the public key we need a separate call
    // In Trezor's Tezos implementation, the address IS the public key hash
    // The public key itself is not directly exposed by tezosGetAddress
    // For a complete implementation, you would need to derive it from a signing operation
    // or use a separate method if available

    // For now, we only have the address (public key hash)
    // Setting _publicKey to undefined indicates it needs to be fetched differently if needed
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
