import { describe, it, expect } from 'vitest';
import { ParameterValidationError } from '@taquito/core';
import {
  getTezosOperationHash,
  getEthereumTransactionHash,
  InvalidHexStringError,
} from '../src/taquito-utils';
import fixtures from './data/synthetic-hashes.json';

// Literal outputs from the pinned Rust goldens and independent Python tools recorded in the fixture.
describe('synthetic operation hashes', () => {
  it.each(fixtures.vectors)('matches independent bytes for $label', (v) => {
    expect(getTezosOperationHash('0x' + v.parentHex)).toBe(v.michelsonOperationHash);
    expect(getTezosOperationHash(v.parentHex.toUpperCase())).toBe(v.michelsonOperationHash);
    expect(getEthereumTransactionHash(v.parentOperationHash)).toBe(v.ethereumTransactionHash);
  });
  it.each([
    '',
    '0x',
    '00',
    '00'.repeat(31),
    '00'.repeat(33),
    '0'.repeat(63),
    'gg'.repeat(32),
    '0X' + '00'.repeat(32),
    ' ' + '00'.repeat(32),
  ])('rejects invalid EVM hash %s', (input) => {
    expect(() => getTezosOperationHash(input)).toThrow(InvalidHexStringError);
  });
  it.each([
    '',
    'not-a-hash',
    'tz1RvhdZ5pcjD19vCCK9PgZpnmErTba3dsBs',
    'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
    'oneDGhZacw99EEFaYDTtWfz5QEhUW3PPVFsHa7GShnLPuDn7gSe',
  ])('rejects invalid parent operation %s', (input) => {
    expect(() => getEthereumTransactionHash(input)).toThrow(ParameterValidationError);
  });
  it.each([null, undefined, 42, {}, new Uint8Array(32)])(
    'rejects a non-string EVM parent %#',
    (input) => {
      expect(() => Reflect.apply(getTezosOperationHash, undefined, [input])).toThrow(
        InvalidHexStringError
      );
    }
  );
});
