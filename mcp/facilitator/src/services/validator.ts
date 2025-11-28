/**
 * Validator Service
 *
 * Handles signature verification, operation decoding, and validation
 * of x402 payment payloads against requirements.
 */

import {
  verifySignature,
  b58cencode,
  prefix,
  getPkhfromPk,
} from '@taquito/utils';
import { hash } from '@stablelib/blake2b';
import { LocalForger } from '@taquito/local-forging';
import {
  TezosPayloadData,
  X402Requirements,
  DecodedOperation,
  DecodedTransaction,
} from '../types/x402';
import { tezosService } from './tezos';
import { seenOperations } from '../storage/seen';

// Estimated fees buffer for balance check (0.01 XTZ = 10000 mutez)
const ESTIMATED_FEES_BUFFER = BigInt(10000);

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  operationHash?: string;
  decodedOperation?: DecodedOperation;
}

const forger = new LocalForger();

/**
 * Compute the operation hash from operation bytes
 */
function computeOperationHash(operationBytes: string): string {
  // The operation hash is the b58check encoding of the blake2b hash
  // of the operation bytes with the 'o' prefix
  const bytes = Buffer.from(operationBytes, 'hex');
  const hashed = hash(bytes, 32);
  return b58cencode(hashed, prefix.o);
}

/**
 * Validate the signature of operation bytes
 */
export function validateSignature(
  operationBytes: string,
  signature: string,
  publicKey: string
): { valid: boolean; reason?: string } {
  try {
    // Validate signature format
    if (!signature || typeof signature !== 'string') {
      return {
        valid: false,
        reason: `Invalid signature: expected string, got ${typeof signature}`,
      };
    }

    if (!signature.startsWith('edsig') && !signature.startsWith('spsig') &&
        !signature.startsWith('p2sig') && !signature.startsWith('sig')) {
      return {
        valid: false,
        reason: `Invalid signature format: must start with edsig, spsig, p2sig, or sig. Got: ${signature.substring(0, 10)}...`,
      };
    }

    // Validate operation bytes format (should be hex)
    if (!operationBytes || !/^[0-9a-fA-F]+$/.test(operationBytes)) {
      return {
        valid: false,
        reason: `Invalid operation bytes: must be hex string`,
      };
    }

    // Add watermark for generic operation (0x03)
    const watermarkedBytes = '03' + operationBytes;

    const isValid = verifySignature(watermarkedBytes, publicKey, signature);

    if (!isValid) {
      return { valid: false, reason: 'Signature verification failed' };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      reason: `Signature validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Validate that the public key hashes to the source address
 */
export function validatePublicKeySource(
  publicKey: string,
  source: string
): { valid: boolean; reason?: string } {
  try {
    // Validate public key format before attempting to derive address
    if (!publicKey || typeof publicKey !== 'string') {
      return {
        valid: false,
        reason: `Invalid public key: expected string, got ${typeof publicKey}`,
      };
    }

    if (!publicKey.startsWith('edpk') && !publicKey.startsWith('sppk') && !publicKey.startsWith('p2pk')) {
      return {
        valid: false,
        reason: `Invalid public key format: must start with edpk, sppk, or p2pk. Got: ${publicKey.substring(0, 10)}...`,
      };
    }

    const derivedAddress = getPkhfromPk(publicKey);

    if (derivedAddress !== source) {
      return {
        valid: false,
        reason: `Public key does not match source address. Expected ${source}, derived ${derivedAddress}`,
      };
    }

    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      reason: `Public key validation error (key: ${publicKey?.substring(0, 15)}...): ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Decode operation bytes to extract operation details
 */
export async function decodeOperationBytes(
  operationBytes: string
): Promise<{ decoded?: DecodedOperation; error?: string }> {
  try {
    const decoded = await forger.parse(operationBytes);

    // Validate it's a transaction operation
    if (
      !decoded.contents ||
      decoded.contents.length === 0 ||
      decoded.contents[0].kind !== 'transaction'
    ) {
      return { error: 'Operation is not a transaction' };
    }

    return { decoded: decoded as DecodedOperation };
  } catch (error) {
    return {
      error: `Failed to decode operation bytes: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Validate decoded operation against requirements
 */
export function validateOperationAgainstRequirements(
  decoded: DecodedOperation,
  requirements: X402Requirements,
  source: string
): { valid: boolean; reason?: string } {
  const tx = decoded.contents[0] as DecodedTransaction;

  // Check source matches
  if (tx.source !== source) {
    return {
      valid: false,
      reason: `Operation source mismatch. Expected ${source}, got ${tx.source}`,
    };
  }

  // Check recipient matches
  if (tx.destination !== requirements.recipient) {
    return {
      valid: false,
      reason: `Recipient mismatch. Expected ${requirements.recipient}, got ${tx.destination}`,
    };
  }

  // Check amount matches (both are in mutez as strings)
  const txAmount = BigInt(tx.amount);
  const requiredAmount = BigInt(requirements.amount);

  if (txAmount < requiredAmount) {
    return {
      valid: false,
      reason: `Amount insufficient. Required ${requirements.amount} mutez, got ${tx.amount} mutez`,
    };
  }

  return { valid: true };
}

/**
 * Full validation of a payment payload
 */
export async function validatePayment(
  payload: TezosPayloadData,
  requirements: X402Requirements
): Promise<ValidationResult> {
  // Step 1: Validate public key matches source
  const pkValidation = validatePublicKeySource(payload.publicKey, payload.source);
  if (!pkValidation.valid) {
    return { valid: false, reason: pkValidation.reason };
  }

  // Step 2: Decode operation bytes
  const { decoded, error: decodeError } = await decodeOperationBytes(
    payload.operationBytes
  );
  if (decodeError || !decoded) {
    return { valid: false, reason: decodeError || 'Failed to decode operation' };
  }

  // Step 3: Validate signature
  const sigValidation = validateSignature(
    payload.operationBytes,
    payload.signature,
    payload.publicKey
  );
  if (!sigValidation.valid) {
    return { valid: false, reason: sigValidation.reason };
  }

  // Step 4: Validate operation against requirements
  const reqValidation = validateOperationAgainstRequirements(
    decoded,
    requirements,
    payload.source
  );
  if (!reqValidation.valid) {
    return { valid: false, reason: reqValidation.reason };
  }

  // Step 5: Compute operation hash and check for double-spend
  const operationHash = computeOperationHash(payload.operationBytes);
  if (seenOperations.has(operationHash)) {
    return {
      valid: false,
      reason: 'Operation has already been seen (potential double-spend)',
    };
  }

  // Step 6: Check balance
  const tx = decoded.contents[0] as DecodedTransaction;
  const requiredBalance =
    BigInt(tx.amount) + BigInt(tx.fee) + ESTIMATED_FEES_BUFFER;

  const { sufficient, balance } = await tezosService.hasSufficientBalance(
    payload.source,
    requiredBalance
  );

  if (!sufficient) {
    return {
      valid: false,
      reason: `Insufficient balance. Required ${requiredBalance} mutez (including fees), has ${balance} mutez`,
    };
  }

  // Step 7: Add to seen operations
  seenOperations.add(
    operationHash,
    payload.source,
    tx.amount,
    requirements.recipient
  );

  return {
    valid: true,
    operationHash,
    decodedOperation: decoded,
  };
}

/**
 * Combine operation bytes with signature for injection
 */
export function combineOperationWithSignature(
  operationBytes: string,
  signature: string
): string {
  // Convert signature from base58 to hex
  const { b58cdecode, prefix } = require('@taquito/utils');

  // Decode the signature - signatures use different prefixes based on curve
  let sigHex: string;

  if (signature.startsWith('edsig')) {
    const decoded = b58cdecode(signature, prefix.edsig);
    sigHex = Buffer.from(decoded).toString('hex');
  } else if (signature.startsWith('spsig')) {
    const decoded = b58cdecode(signature, prefix.spsig);
    sigHex = Buffer.from(decoded).toString('hex');
  } else if (signature.startsWith('p2sig')) {
    const decoded = b58cdecode(signature, prefix.p2sig);
    sigHex = Buffer.from(decoded).toString('hex');
  } else if (signature.startsWith('sig')) {
    const decoded = b58cdecode(signature, prefix.sig);
    sigHex = Buffer.from(decoded).toString('hex');
  } else {
    throw new Error(`Unsupported signature format: ${signature.substring(0, 10)}`);
  }

  // Combine operation bytes with signature
  return operationBytes + sigHex;
}

/**
 * Compute operation hash for a payload
 */
export function getOperationHash(operationBytes: string): string {
  return computeOperationHash(operationBytes);
}
