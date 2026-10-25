import { parseData, offlineValidationType } from './micheline';
// Adapted from trilitech/octez.js #126, commit 73a8a6a4081b55e548f743700d99205104eaa783.
// Copyright 2026 Nomadic Labs. Apache-2.0.
import {
  InvalidAddressError,
  InvalidHexStringError,
  ParameterValidationError,
  InvalidContractAddressError,
  ValidationResult,
} from '@taquito/core';
import {
  packDataBytes,
  unpackDataBytes,
  assertMichelsonPackableType,
  assertDataValid,
} from '@taquito/michel-codec';
import { validateContractAddress, validateKeyHash } from '@taquito/utils';
import { encodeNacCall, encodeNacCallMichelson } from './abi';
import { mutezToWei, parseAmount } from './amount';
import {
  NAC_HTTP_POST,
  NAC_PRECOMPILE_ADDRESS,
  NAC_RECOMMENDED_GAS,
  NAC_TEZOS_RUNTIME_URL,
} from './constants';
import { InvalidEntrypointNameError, UnsupportedCrossRuntimeIntentError } from './errors';
import { parseHexBytes } from './hex';
import type { EvmToMichelsonIntent, PrecompileCall } from './types';

// Entrypoint names are made of Michelson annotation characters, are at most 31
// characters long and are given without their leading `%`
const ENTRYPOINT_RE = /^[a-zA-Z0-9_.@][a-zA-Z0-9_.%@]{0,30}$/;

/**
 * A transfer can credit an implicit account (tz…) or a contract (KT1).
 */
function validateTransferDestination(destination: string) {
  if (
    typeof destination !== 'string' ||
    (validateKeyHash(destination) !== ValidationResult.VALID &&
      validateContractAddress(destination) !== ValidationResult.VALID)
  ) {
    throw new InvalidAddressError(destination, validateKeyHash(destination));
  }
}

function validateContractCall(destination: string, entrypoint: string) {
  const validation = validateContractAddress(destination);
  if (validation !== ValidationResult.VALID) {
    throw new InvalidContractAddressError(destination, validation);
  }
  if (typeof entrypoint !== 'string' || !ENTRYPOINT_RE.test(entrypoint)) {
    throw new InvalidEntrypointNameError(entrypoint);
  }
}

/**
 * Binary Micheline of an entrypoint parameter, without the `05` pack prefix.
 */
function toBinaryMicheline(
  parameter: Extract<EvmToMichelsonIntent, { kind: 'call-michelson' }>['parameter']
): string {
  if (typeof parameter === 'string') {
    const raw = parseHexBytes(parameter, 1);
    try {
      const decoded = unpackDataBytes({ bytes: '05' + raw });
      if (packDataBytes(decoded).bytes.slice(2) !== raw)
        throw new Error('Noncanonical or trailing bytes');
    } catch {
      throw new InvalidHexStringError(
        parameter,
        'Expecting canonical binary Micheline without an outer PACK marker'
      );
    }
    return raw;
  }
  if (!parameter || typeof parameter !== 'object')
    throw new ParameterValidationError('Expecting a Micheline parameter');
  const data = parseData(parameter.value);
  if (parameter.type !== undefined) {
    assertMichelsonPackableType(parameter.type);
    assertDataValid(data, offlineValidationType(parameter.type));
  }
  const { bytes } = packDataBytes(data, parameter.type);
  return bytes.slice(2);
}

/**
 * Wrap a Michelson runtime operation into a call to the NAC precompile, so that it can
 * be signed and sent on the EVM runtime.
 *
 * The result is an unsigned EVM transaction (`to`, `data`, `value`, `gasLimit`) to
 * complete, sign and send with an EVM library.
 *
 * @example
 * ```
 * const call = buildEvmToMichelsonCall({ kind: 'transfer', destination: 'tz1…', amount: 1000n });
 * await walletClient.sendTransaction({ to: call.to, data: call.data, value: call.value, gas: call.gasLimit });
 * ```
 */
export function buildEvmToMichelsonCall(intent: EvmToMichelsonIntent): PrecompileCall {
  if (!intent || typeof intent !== 'object')
    throw new ParameterValidationError('Expecting a cross-runtime intent');
  const kind = String(intent.kind);
  switch (intent.kind) {
    case 'transfer':
      validateTransferDestination(intent.destination);
      return {
        direction: 'evm-to-michelson',
        to: NAC_PRECOMPILE_ADDRESS,
        value: mutezToWei(parseAmount(intent.amount)),
        data: encodeNacCall(
          `${NAC_TEZOS_RUNTIME_URL}${intent.destination}`,
          [],
          '0x',
          NAC_HTTP_POST
        ),
        gasLimit: NAC_RECOMMENDED_GAS.call,
      };
    case 'call-michelson':
      validateContractCall(intent.destination, intent.entrypoint);
      return {
        direction: 'evm-to-michelson',
        to: NAC_PRECOMPILE_ADDRESS,
        value: mutezToWei(parseAmount(intent.amount ?? BigInt(0))),
        data: encodeNacCallMichelson(
          intent.destination,
          intent.entrypoint,
          toBinaryMicheline(intent.parameter)
        ),
        gasLimit: NAC_RECOMMENDED_GAS.callMichelson,
      };
    default:
      throw new UnsupportedCrossRuntimeIntentError(kind);
  }
}
