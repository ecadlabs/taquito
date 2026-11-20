import {
  InvalidAddressError,
  InvalidContractAddressError,
  ParameterValidationError,
  ValidationResult,
} from '@taquito/core';
import {
  getPublicKeyHashFromPublicKey,
  validateContractAddress,
  validateKeyHash,
  validatePublicKey,
} from '@taquito/utils';
import { encodeFunctionData, isAddress, keccak256 } from 'viem';
import { NAC_GATEWAY, NAC_PRECOMPILE_ADDRESS } from './constants';
import { InvalidEvmAddressError } from './errors';
import type { GatewayTransferParams, MichelineExpression, PrecompileCall } from './types';

/** A Michelson-native account whose alias will be created on the EVM runtime. */
export type MichelsonAliasSource =
  | { kind: 'implicit'; address: string; publicKey: string }
  | { kind: 'contract'; address: string; publicKey?: never };

/** An EVM-native account whose alias will be created on the Michelson runtime. */
export interface EvmAliasSource {
  address: string;
  /** Raw or uncompressed secp256k1 public key in hex, with an optional 0x prefix. */
  publicKey?: string;
}

// Horus RuntimeGateway precompile, RFC-26049.
const MATERIALIZE_ALIAS_ABI = [
  {
    type: 'function',
    name: 'materializeAlias',
    inputs: [
      { name: 'nativeRuntime', type: 'string' },
      { name: 'nativeAddress', type: 'string' },
      { name: 'nativePublicKey', type: 'string' },
    ],
    outputs: [{ name: 'aliasAddress', type: 'address' }],
    stateMutability: 'nonpayable',
  },
] as const;

/**
 * Prepare a zero-value EVM transaction that materializes a Michelson account's EVM alias
 * on Horus. An implicit account (tz1 through tz4) requires its matching Tezos public key.
 * The gateway checks on-chain that a KT1 contract is native. Estimate gas before signing.
 *
 * @example buildEvmAliasMaterialization({ kind: 'implicit', address, publicKey })
 */
export function buildEvmAliasMaterialization(
  source: MichelsonAliasSource
): Pick<PrecompileCall, 'to' | 'data' | 'value'> {
  if (!source || typeof source !== 'object') {
    throw new ParameterValidationError('Expected a Michelson alias source');
  }

  if (source.kind === 'implicit') {
    const addressResult = validateKeyHash(source.address);
    if (addressResult !== ValidationResult.VALID) {
      throw new InvalidAddressError(source.address, addressResult);
    }
    if (!/^tz[1-4]/.test(source.address)) {
      throw new InvalidAddressError(source.address, ValidationResult.PREFIX_NOT_ALLOWED);
    }
    if (validatePublicKey(source.publicKey) !== ValidationResult.VALID) {
      throw new ParameterValidationError('Expected a valid Tezos public key');
    }
    if (getPublicKeyHashFromPublicKey(source.publicKey) !== source.address) {
      throw new ParameterValidationError('Public key does not match the Tezos address');
    }
  } else if (source.kind === 'contract') {
    const result = validateContractAddress(source.address);
    if (result !== ValidationResult.VALID) {
      throw new InvalidContractAddressError(source.address, result);
    }
    if (source.publicKey !== undefined) {
      throw new ParameterValidationError('A Michelson contract cannot have a public key');
    }
  } else {
    throw new ParameterValidationError('Expected an implicit account or Michelson contract');
  }

  return {
    to: NAC_PRECOMPILE_ADDRESS,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: MATERIALIZE_ALIAS_ABI,
      functionName: 'materializeAlias',
      args: ['tezos', source.address, source.publicKey ?? ''],
    }),
  };
}

/**
 * Prepare a zero-mutez Michelson transfer that materializes an EVM account's KT1 alias
 * on Horus. Use a lowercase or EIP-55-checksummed EVM address. Supply the matching
 * public key for an EOA whose native status the kernel cannot establish from chain state.
 * Key validation checks the hex encoding and address hash, as in the gateway's EOA check.
 * Simulate the transfer before signing.
 *
 * @example buildTezosAliasMaterialization({ address: '0x1234567890abcdef1234567890abcdef12345678' })
 */
export function buildTezosAliasMaterialization(source: EvmAliasSource): GatewayTransferParams {
  if (!source || typeof source !== 'object') {
    throw new ParameterValidationError('Expected an EVM alias source');
  }
  if (typeof source.address !== 'string' || !isAddress(source.address)) {
    throw new InvalidEvmAddressError(source.address);
  }
  const address = source.address.toLowerCase();
  let key: MichelineExpression = { prim: 'None' };
  if (source.publicKey !== undefined) {
    if (
      typeof source.publicKey !== 'string' ||
      !/^(?:0x)?(?:04)?[0-9a-fA-F]{128}$/.test(source.publicKey)
    ) {
      throw new ParameterValidationError('Expected a raw or uncompressed EVM public key');
    }
    const digits = source.publicKey.replace(/^0x/, '');
    const rawKey = digits.length === 130 ? digits.slice(2) : digits;
    if (`0x${keccak256(`0x${rawKey}`).slice(-40)}` !== address) {
      throw new ParameterValidationError('Public key does not match the EVM address');
    }
    key = { prim: 'Some', args: [{ string: source.publicKey }] };
  }

  return {
    to: NAC_GATEWAY,
    amount: 0,
    mutez: true,
    parameter: {
      entrypoint: 'materialize_alias',
      value: {
        prim: 'Pair',
        args: [{ string: 'ethereum' }, { prim: 'Pair', args: [{ string: address }, key] }],
      },
    },
  };
}
