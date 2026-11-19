// Adapted from trilitech/octez.js #123-126. Copyright 2026 Nomadic Labs. Apache-2.0.
import { InvalidAmountError } from '@taquito/core';
import { WEI_PER_MUTEZ } from './constants';
import { SubMutezPrecisionError } from './errors';
import type { Amount, AmountLike } from './types';

const AMOUNT_STRING_RE = /^(\d+|0x[0-9a-fA-F]+)$/;

/**
 * Convert an amount to a non-negative bigint, typed as an {@link Amount}.
 *
 * @throws `InvalidAmountError` if `amount` is not a non-negative integer
 */
export function parseAmount(amount: AmountLike): Amount {
  let value: bigint;
  if (typeof amount === 'bigint') {
    value = amount;
  } else if (typeof amount === 'number' && Number.isSafeInteger(amount)) {
    value = BigInt(amount);
  } else if (typeof amount === 'string' && AMOUNT_STRING_RE.test(amount)) {
    value = BigInt(amount);
  } else {
    throw new InvalidAmountError(String(amount), 'Expecting a non-negative integer');
  }
  if (value < BigInt(0)) {
    throw new InvalidAmountError(String(amount), 'Expecting a non-negative integer');
  }
  return value as Amount;
}

// Michelson mutez amounts are signed 64-bit integers. This bound also keeps the wei
// value (at most ~9.2e30) far below the uint256 limit of EVM transaction values.
const MAX_MUTEZ = BigInt('9223372036854775807');

/**
 * Convert wei to mutez, rejecting any sub-mutez remainder instead of flooring it away.
 *
 * @param wei amount in wei, from {@link parseAmount}
 * @throws {@link SubMutezPrecisionError} if `wei` is not a whole number of mutez
 * @throws `InvalidAmountError` if `wei` is worth more than 2^63 - 1 mutez, the Michelson
 * mutez bound
 */
export function weiToMutezExact(wei: AmountLike): Amount {
  wei = parseAmount(wei);
  const remainder = wei % WEI_PER_MUTEZ;
  if (remainder !== BigInt(0)) {
    throw new SubMutezPrecisionError(wei, remainder);
  }
  const mutez = wei / WEI_PER_MUTEZ;
  if (mutez > MAX_MUTEZ) {
    throw new InvalidAmountError(wei.toString(), 'Expecting at most 2^63 - 1 mutez');
  }
  return mutez as Amount;
}

/**
 * Convert mutez to wei.
 *
 * @param mutez amount in mutez, from {@link parseAmount}
 * @throws `InvalidAmountError` if `mutez` is larger than 2^63 - 1, the Michelson mutez bound
 */
export function mutezToWei(mutez: AmountLike): Amount {
  mutez = parseAmount(mutez);
  if (mutez > MAX_MUTEZ) {
    throw new InvalidAmountError(mutez.toString(), 'Expecting at most 2^63 - 1 mutez');
  }
  return (mutez * WEI_PER_MUTEZ) as Amount;
}
