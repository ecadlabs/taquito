// Adapted from Octez.js #113, commit 257d8e3be215265727c6e0175c8673cec77c477d.
// Copyright 2026 Nomadic Labs. Licensed under Apache-2.0.
import { keccak_256 } from '@noble/hashes/sha3.js';
import { blake2b } from '@noble/hashes/blake2.js';
import { InvalidHexStringError } from '@taquito/core';
import { PrefixV2 } from './constants';
import { b58Encode, b58DecodeAndCheckPrefix, buf2hex, hex2buf, mergebuf } from './encoding';

/** Derives a synthetic Michelson operation hash from a 32-byte parent EVM transaction hash.
 * This follows Tezos X kernel revision e494418ef861bc8517f937459270f97470fd3faa.
 * @param evmTxHash Hex encoded parent hash, optionally prefixed with 0x.
 * @throws InvalidHexStringError when the input is not a 32-byte hex string.
 */
export function getTezosOperationHash(evmTxHash: string): string {
  if (typeof evmTxHash !== 'string') {
    throw new InvalidHexStringError(
      String(evmTxHash),
      'Expecting a 32-byte Ethereum transaction hash'
    );
  }
  const parent = hex2buf(evmTxHash);
  if (parent.length !== 32) {
    throw new InvalidHexStringError(evmTxHash, 'Expecting a 32-byte Ethereum transaction hash');
  }
  return b58Encode(
    blake2b(mergebuf(new TextEncoder().encode('michelson'), parent), { dkLen: 32 }),
    PrefixV2.OperationHash
  );
}

/** Derives the synthetic EVM transaction hash of a parent Michelson operation on Tezos X.
 * This follows kernel revision e494418ef861bc8517f937459270f97470fd3faa.
 * @param michelsonOpHash Base58Check operation hash.
 * @returns Lowercase 0x-prefixed transaction hash.
 * @throws ParameterValidationError when the input is not a valid operation hash.
 */
export function getEthereumTransactionHash(michelsonOpHash: string): string {
  const parent = b58DecodeAndCheckPrefix(michelsonOpHash, [PrefixV2.OperationHash], true);
  return '0x' + buf2hex(keccak_256(mergebuf(new TextEncoder().encode('evm'), parent)));
}
