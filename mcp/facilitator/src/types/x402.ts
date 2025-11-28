/**
 * x402 Payment Protocol Types for Tezos
 *
 * These types define the structure of payment payloads and requirements
 * used in the x402 payment protocol with the exact-tezos scheme.
 */

export interface TezosPayloadData {
  operationBytes: string;
  signature: string;
  publicKey: string;
  source: string;
}

export interface X402Payload {
  scheme: 'exact-tezos';
  network: string;
  asset: 'XTZ';
  payload: TezosPayloadData;
}

export interface X402Requirements {
  scheme: 'exact-tezos';
  network: string;
  asset: 'XTZ';
  amount: string;
  recipient: string;
}

export interface VerifyRequest {
  payload: X402Payload;
  requirements: X402Requirements;
}

export interface SettleRequest {
  payload: X402Payload;
}

export interface VerifySuccessResponse {
  valid: true;
}

export interface VerifyFailureResponse {
  valid: false;
  reason: string;
}

export type VerifyResponse = VerifySuccessResponse | VerifyFailureResponse;

export interface SettleSuccessResponse {
  success: true;
  operationHash: string;
}

export interface SettleFailureResponse {
  success: false;
  error: string;
}

export type SettleResponse = SettleSuccessResponse | SettleFailureResponse;

export interface HealthResponse {
  status: 'ok' | 'error';
  network: string;
  rpcUrl: string;
  connectedBlock?: string;
  error?: string;
}

export interface ErrorResponse {
  error: string;
}

/**
 * Decoded Tezos operation structure (transaction)
 */
export interface DecodedTransaction {
  kind: 'transaction';
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  amount: string;
  destination: string;
}

export interface DecodedOperation {
  branch: string;
  contents: DecodedTransaction[];
}
