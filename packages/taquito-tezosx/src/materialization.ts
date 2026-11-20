import {
  InvalidAddressError,
  InvalidContractAddressError,
  ParameterValidationError,
  ValidationResult,
} from '@taquito/core';
import { getPkhfromPk, validateContractAddress, validateKeyHash } from '@taquito/utils';
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

  const { kind, address, publicKey } = source;
  if (typeof address !== 'string') {
    throw new ParameterValidationError('Expected a Tezos address string');
  }

  if (kind === 'implicit') {
    const addressResult =
      address.length === 36 ? validateKeyHash(address) : ValidationResult.INVALID_LENGTH;
    if (addressResult !== ValidationResult.VALID) {
      throw new InvalidAddressError(address, addressResult);
    }
    if (!/^tz[1-4]/.test(address)) {
      throw new InvalidAddressError(address, ValidationResult.PREFIX_NOT_ALLOWED);
    }
    // 76 characters is the largest supported public key encoding (BLpk).
    if (typeof publicKey !== 'string' || publicKey.length > 76) {
      throw new ParameterValidationError('Expected a valid Tezos public key');
    }
    let publicKeyHash: string;
    try {
      publicKeyHash = getPkhfromPk(publicKey);
    } catch (error) {
      if (error instanceof ParameterValidationError) {
        throw new ParameterValidationError('Expected a valid Tezos public key', error.result);
      }
      throw error;
    }
    if (publicKeyHash !== address) {
      throw new ParameterValidationError('Public key does not match the Tezos address');
    }
  } else if (kind === 'contract') {
    const result =
      address.length === 36 ? validateContractAddress(address) : ValidationResult.INVALID_LENGTH;
    if (result !== ValidationResult.VALID) {
      throw new InvalidContractAddressError(address, result);
    }
    if (publicKey !== undefined) {
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
      args: ['tezos', address, publicKey ?? ''],
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
  const { address: inputAddress, publicKey } = source;
  if (typeof inputAddress !== 'string') {
    throw new ParameterValidationError('Expected an EVM address string');
  }
  if (inputAddress.length !== 42 || !isAddress(inputAddress)) {
    throw new InvalidEvmAddressError(inputAddress);
  }
  const address = inputAddress.toLowerCase();
  let key: MichelineExpression = { prim: 'None' };
  if (publicKey !== undefined) {
    if (typeof publicKey !== 'string' || !/^(?:0x)?(?:04)?[0-9a-fA-F]{128}$/.test(publicKey)) {
      throw new ParameterValidationError('Expected a raw or uncompressed EVM public key');
    }
    const digits = publicKey.replace(/^0x/, '');
    const rawKey = digits.length === 130 ? digits.slice(2) : digits;
    if (`0x${keccak256(`0x${rawKey}`).slice(-40)}` !== address) {
      throw new ParameterValidationError('Public key does not match the EVM address');
    }
    key = { prim: 'Some', args: [{ string: publicKey }] };
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
