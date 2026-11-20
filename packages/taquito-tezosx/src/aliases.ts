// Derivation adapted from trilitech/octez.js #152. Copyright 2026 Nomadic Labs. Apache-2.0.
import { blake2b } from '@noble/hashes/blake2.js';
import { keccak_256 } from '@noble/hashes/sha3.js';
import { InvalidAddressError, ParameterValidationError, ValidationResult } from '@taquito/core';
import {
  b58DecodeAndCheckPrefix,
  b58Encode,
  PrefixV2,
  publicKeyHashPrefixes,
} from '@taquito/utils';
import { bytesToHex, concatBytes, concatHex, hexToBytes, isAddress } from 'viem';
import type { Hex } from 'viem';

/** Etherlink kernels supported by the offline Tezos-to-EVM alias derivation. */
export type AliasKernel = 'ganesha' | 'horus';

const aliasablePrefixes = [...publicKeyHashPrefixes, PrefixV2.ContractHash];
const textEncoder = new TextEncoder();

// RFC-26051 v1. These bytes are part of the address derivation.
const SAFE_FACTORY = '0x914d7fec6aac8cd542e72bca78b30650d45643d7';
const RESCUE_SALT = '0x9b8bb449a3d23b110d8c46424ba9b40748ac28bc7b99b7422a272950e17bb1d8';
const GUARDED_CLONE_PREFIX =
  '0x733822d2fe3dce6ce4f4c7f274e2415fa3fae66c3e3b15601e57600080fd5b604180602a6000396000f3';
const PROXY_HEAD = '0x363d3d373d3d3d363d73';
const PROXY_TAIL = '0x5af43d82803e903d91602b57fd5bf3';
const create2Prefix = hexToBytes(concatHex(['0xff', SAFE_FACTORY, RESCUE_SALT]));

function buildInitCodePrefix(implementation: Hex): Uint8Array {
  return hexToBytes(concatHex([GUARDED_CLONE_PREFIX, PROXY_HEAD, implementation, PROXY_TAIL]));
}

const rescueInitCodePrefixes: Partial<Record<PrefixV2, Uint8Array>> = {
  [PrefixV2.Ed25519PublicKeyHash]: buildInitCodePrefix(
    '0xfee60e905d91905df9cd6bf8153976e9d77d5051'
  ),
  [PrefixV2.Secp256k1PublicKeyHash]: buildInitCodePrefix(
    '0x47c81e55f51344d80a8e85c2add86257b51ea3d2'
  ),
  [PrefixV2.P256PublicKeyHash]: buildInitCodePrefix('0x894b62c61b208184b80fd72803811ba35d818112'),
};

/**
 * Derive a Tezos account's lowercase EVM alias offline for the selected Etherlink kernel.
 * Horus uses recoverable aliases for tz1, tz2 and tz3. Other accepted prefixes retain the
 * legacy formula. Derivation says nothing about account support or alias materialization.
 *
 * @param address A Base58Check implicit account or KT1 address without an entrypoint
 * @param kernel The kernel deployed on the target network
 * @example getEthereumAlias('tz1aygVpocoeEMU89vXk92sMHqPYFNZVgvrh', 'horus')
 */
export function getEthereumAlias(address: string, kernel: AliasKernel): Hex {
  if (kernel !== 'ganesha' && kernel !== 'horus') {
    throw new ParameterValidationError('Alias kernel must be ganesha or horus');
  }

  if (typeof address !== 'string') {
    throw new ParameterValidationError('Expected a Tezos address string');
  }
  // Implicit and KT1 addresses use 36 characters. Bound Base58 decoding by input size.
  if (address.length !== 36) {
    throw new InvalidAddressError(address, ValidationResult.INVALID_LENGTH);
  }

  let decoded: [Uint8Array, PrefixV2];
  try {
    decoded = b58DecodeAndCheckPrefix(address, aliasablePrefixes);
  } catch (error) {
    if (error instanceof ParameterValidationError) {
      throw new InvalidAddressError(address, error.result);
    }
    throw error;
  }

  const [pkh, prefix] = decoded;
  const initCodePrefix = rescueInitCodePrefixes[prefix];
  if (kernel === 'ganesha' || initCodePrefix === undefined) {
    return bytesToHex(keccak_256(textEncoder.encode(address)).subarray(0, 20));
  }

  const initCodeHash = keccak_256(concatBytes([initCodePrefix, pkh]));
  // CREATE2 takes the low 20 bytes. The alias RPC returns them without an EIP-55 checksum.
  return bytesToHex(keccak_256(concatBytes([create2Prefix, initCodeHash])).subarray(12));
}

/**
 * Derive the Michelson KT1 alias of a 0x-prefixed EVM address offline.
 * Address casing is ignored, as it is by the alias RPC. Ganesha and Horus use the same formula.
 *
 * @example getTezosAlias('0xccef676171871a48bbd6e2be75bbcc09d38830c5')
 */
export function getTezosAlias(address: string): string {
  if (typeof address !== 'string') {
    throw new ParameterValidationError('Expected an EVM address string');
  }
  if (address.length !== 42 || !isAddress(address, { strict: false })) {
    throw new InvalidAddressError(address, 'Expected a 0x-prefixed 20-byte EVM address');
  }
  const canonicalAddress = textEncoder.encode(address.toLowerCase());
  return b58Encode(blake2b(canonicalAddress, { dkLen: 20 }), PrefixV2.ContractHash);
}
