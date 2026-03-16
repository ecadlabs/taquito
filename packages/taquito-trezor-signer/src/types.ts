/**
 * Response type from TrezorConnect.tezosGetAddress
 */
export interface TrezorTezosAddress {
  address: string;
  path: number[];
  serializedPath: string;
}

/**
 * Response type from TrezorConnect.tezosGetPublicKey
 */
export interface TrezorTezosPublicKey {
  publicKey: string;
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
   * Contact email for Trezor Connect manifest
   */
  email?: string;
  /**
   * Whether to display address on device during connection (default: true)
   */
  showOnTrezor?: boolean;
  /**
   * Use popup for Trezor Connect UI (default: true)
   * When true, opens connect.trezor.io in a popup for device communication
   */
  popup?: boolean;
  /**
   * Automatically attempt to reconnect on transport failure (default: true)
   */
  transportReconnect?: boolean;
  /**
   * Enable debug logging (default: false)
   */
  debug?: boolean;
}

/**
 * Trezor transaction operation format
 */
export interface TrezorTransactionOp {
  source: string;
  fee: number;
  counter: number;
  gas_limit: number;
  storage_limit: number;
  amount: number;
  destination: string;
  parameters?: number[];
}

/**
 * Trezor reveal operation format
 */
export interface TrezorRevealOp {
  source: string;
  fee: number;
  counter: number;
  gas_limit: number;
  storage_limit: number;
  public_key: string;
}

/**
 * Trezor delegation operation format
 * Note: Trezor requires delegate to be specified for delegation operations.
 */
export interface TrezorDelegationOp {
  source: string;
  fee: number;
  counter: number;
  gas_limit: number;
  storage_limit: number;
  delegate: string;
}

/**
 * Trezor proposal operation format
 * Used for proposing protocol amendments during the proposal period
 */
export interface TrezorProposalOp {
  source: string;
  period: number;
  proposals: string[];
}

/**
 * Trezor ballot type enum
 */
export type TrezorBallotType = 0 | 1 | 2; // 0 = Yay, 1 = Nay, 2 = Pass

/**
 * Trezor ballot operation format
 * Used for voting on protocol amendments during voting periods
 */
export interface TrezorBallotOp {
  source: string;
  period: number;
  proposal: string;
  ballot: TrezorBallotType;
}

/**
 * Trezor operation object containing operation details
 */
export interface TrezorOperation {
  reveal?: TrezorRevealOp;
  transaction?: TrezorTransactionOp;
  delegation?: TrezorDelegationOp;
  proposal?: TrezorProposalOp;
  ballot?: TrezorBallotOp;
}
