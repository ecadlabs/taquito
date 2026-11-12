import { parseData } from './micheline';
// Adapted from trilitech/octez.js #123-125. Copyright 2026 Nomadic Labs. Apache-2.0.
import {
  InvalidContractAddressError,
  ParameterValidationError,
  InvalidHexStringError,
  ValidationResult,
} from '@taquito/core';
import { isAddress } from 'viem';
import { assertDataValid, type MichelsonType } from '@taquito/michel-codec';
import { validateContractAddress } from '@taquito/utils';
import { parseAmount, weiToMutezExact } from './amount';
import { NAC_ETHEREUM_RUNTIME_URL, NAC_GATEWAY } from './constants';
import { InvalidEvmAddressError, MissingCalldataError, UnsafeMutezAmountError } from './errors';
import { buildCallEvmParameter, buildHttpCallParameter } from './gateway-parameters';
import { parseHexBytes } from './hex';
import { DEFAULT_KNOWN_SIGNATURES, resolveCalldataSignature } from './method-signature';
import type {
  BuildMichelsonToEvmCallOptions,
  EvmTransactionRequest,
  GatewayCall,
  GatewayTransferParams,
} from './types';

/**
 * Wrap an EVM transaction into a call to the NAC gateway contract, so that it can be
 * signed and sent on the Michelson runtime.
 *
 * A transaction without calldata becomes a native transfer through the `%call`
 * entrypoint; any other transaction becomes an EVM contract call through `%call_evm`.
 *
 * @example
 * ```
 * const call = buildMichelsonToEvmCall({
 *   to: '0x1111111111111111111111111111111111111111',
 *   value: 10n ** 15n,
 * });
 * const transfer = toTransferParams(call);
 * // Check the gateway on the target network and simulate before signing.
 * ```
 */
export function buildMichelsonToEvmCall(
  tx: EvmTransactionRequest,
  options: BuildMichelsonToEvmCallOptions = {}
): GatewayCall {
  if (!tx || typeof tx !== 'object' || !options || typeof options !== 'object')
    throw new ParameterValidationError('Expecting transaction and options objects');
  // Strict: a mixed-case address must carry a valid EIP-55 checksum
  if (typeof tx.to !== 'string' || !isAddress(tx.to)) {
    throw new InvalidEvmAddressError(tx.to);
  }
  // Lowercase the address embedded in the gateway parameter, so that equivalent inputs
  // (checksummed or not) always build the same operation. A lowercase address is valid
  // for any parser that accepts checksummed ones.
  const to = tx.to.toLowerCase();
  const contractAddress = options.gatewayAddress ?? NAC_GATEWAY;
  const gatewayValidation = validateContractAddress(contractAddress);
  if (gatewayValidation !== ValidationResult.VALID) {
    throw new InvalidContractAddressError(contractAddress, gatewayValidation);
  }
  const callback = parseData(options.callback ?? { prim: 'None' });
  assertDataValid(callback, CALLBACK_VALUE_TYPE);
  const mutezAmount = weiToMutezExact(parseAmount(tx.value ?? BigInt(0)));
  // A non-empty calldata starts with a 4-byte function selector
  const calldata = parseHexBytes(tx.data ?? '');
  if (calldata.length > 0 && calldata.length < 8) {
    throw new InvalidHexStringError(tx.data ?? '', 'Expecting at least a 4-byte function selector');
  }

  if (calldata.length === 0) {
    if (tx.methodSignature !== undefined) {
      throw new MissingCalldataError(tx.methodSignature);
    }
    return {
      direction: 'michelson-to-evm',
      contractAddress,
      entrypoint: 'call',
      parameter: buildHttpCallParameter(`${NAC_ETHEREUM_RUNTIME_URL}${to}`),
      mutezAmount,
    };
  }

  const selector = calldata.slice(0, 8);
  const methodSignature = resolveCalldataSignature(
    selector,
    tx.methodSignature,
    options.knownSignatures ?? DEFAULT_KNOWN_SIGNATURES
  );

  return {
    direction: 'michelson-to-evm',
    contractAddress,
    entrypoint: 'call_evm',
    parameter: buildCallEvmParameter(to, methodSignature, calldata.slice(8), callback),
    mutezAmount,
    methodSignature,
  };
}

/**
 * Turn a gateway call into transfer parameters for `Tezos.contract.transfer` or
 * `Tezos.wallet.transfer`.
 *
 * @throws {@link UnsafeMutezAmountError} if the amount does not fit in a JavaScript number
 */
export function toTransferParams(call: GatewayCall): GatewayTransferParams {
  if (
    !call ||
    typeof call !== 'object' ||
    call.direction !== 'michelson-to-evm' ||
    !['call', 'call_evm'].includes(call.entrypoint)
  )
    throw new ParameterValidationError('Expecting a gateway call');
  const addressResult = validateContractAddress(call.contractAddress);
  if (addressResult !== ValidationResult.VALID)
    throw new InvalidContractAddressError(call.contractAddress, addressResult);
  const amount = parseAmount(call.mutezAmount);
  const parameter = parseData(call.parameter);
  assertDataValid(call.parameter, call.entrypoint === 'call' ? HTTP_CALL_TYPE : EVM_CALL_TYPE);
  if (amount > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new UnsafeMutezAmountError(call.mutezAmount);
  }
  return {
    to: call.contractAddress,
    amount: Number(amount),
    mutez: true,
    parameter: {
      entrypoint: call.entrypoint,
      value: parameter,
    },
  };
}

// Offline checks validate an address representation, not the receiving contract bytes type.
const CALLBACK_VALUE_TYPE: MichelsonType = {
  prim: 'option',
  args: [{ prim: 'address' }],
};
const EVM_CALL_TYPE: MichelsonType = {
  prim: 'pair',
  args: [
    { prim: 'string' },
    {
      prim: 'pair',
      args: [{ prim: 'string' }, { prim: 'pair', args: [{ prim: 'bytes' }, CALLBACK_VALUE_TYPE] }],
    },
  ],
};
const HTTP_CALL_TYPE: MichelsonType = {
  prim: 'pair',
  args: [
    { prim: 'string' },
    {
      prim: 'pair',
      args: [
        { prim: 'list', args: [{ prim: 'pair', args: [{ prim: 'string' }, { prim: 'string' }] }] },
        {
          prim: 'pair',
          args: [{ prim: 'bytes' }, { prim: 'pair', args: [{ prim: 'nat' }, CALLBACK_VALUE_TYPE] }],
        },
      ],
    },
  ],
};
