// Adapted from trilitech/octez.js #123-125. Copyright 2026 Nomadic Labs. Apache-2.0.
import { InvalidHexStringError } from '@taquito/core';
import { stripHexPrefix } from '@taquito/utils';

const HEX_BYTES_RE = /^([0-9a-f]{2})*$/;

/**
 * Validate a byte string given in hex, with or without the `0x` prefix, and return it
 * lowercased without the prefix.
 *
 * @throws `InvalidHexStringError` if `hex` is not an even-length hex string of at least
 * `minBytes` bytes
 */
export function parseHexBytes(hex: string, minBytes = 0): string {
  if (typeof hex !== 'string')
    throw new InvalidHexStringError(String(hex), 'Expecting a hex string');
  const bytes = stripHexPrefix(hex).toLowerCase();
  if (!HEX_BYTES_RE.test(bytes)) {
    throw new InvalidHexStringError(hex, 'Expecting an even-length hex string');
  }
  if (bytes.length < 2 * minBytes) {
    throw new InvalidHexStringError(hex, `Expecting at least ${minBytes} bytes`);
  }
  return bytes;
}
