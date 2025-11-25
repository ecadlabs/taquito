/**
 * Response type from TrezorConnect.tezosGetAddress
 */
export interface TrezorTezosAddress {
  address: string;
  path: number[];
  serializedPath: string;
}

/**
 * Response type from TrezorConnect.tezosSignTransaction
 */
export interface TrezorTezosSignedTx {
  signature: string;
  sig_op_contents: string;
  operation_hash: string;
}

/**
 * Trezor Connect response wrapper
 */
export interface TrezorResponse<T> {
  success: boolean;
  payload: T | { error: string; code?: string };
}

/**
 * Configuration options for TrezorSigner
 */
export interface TrezorSignerConfig {
  /**
   * Application name displayed on Trezor device
   */
  appName?: string;
  /**
   * Application URL for Trezor Connect
   */
  appUrl?: string;
  /**
   * Whether to display address on device during connection (default: true)
   */
  showOnTrezor?: boolean;
}
