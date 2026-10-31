import { expectTypeOf, test } from 'vitest';
import bs58check from 'bs58check';
import {
  isValidAddress,
  isValidContractAddress,
  isValidPublicKey,
  isValidOperationHash,
} from '../src/taquito-utils';

const acceptString = (value: string) => value;

test('isValidAddress narrows unknown strings and remains usable as a boolean', () => {
  const consume = (input: unknown) => {
    if (isValidAddress(input)) return acceptString(input);
  };
  expectTypeOf(consume).returns.toEqualTypeOf<string | undefined>();
  const accepted: boolean = isValidAddress('invalid');
  expectTypeOf(accepted).toEqualTypeOf<boolean>();
});

test('isValidContractAddress narrows unknown strings and remains usable as a boolean', () => {
  const consume = (input: unknown) => {
    if (isValidContractAddress(input)) return acceptString(input);
  };
  expectTypeOf(consume).returns.toEqualTypeOf<string | undefined>();
  const accepted: boolean = isValidContractAddress('invalid');
  expectTypeOf(accepted).toEqualTypeOf<boolean>();
});

test('isValidPublicKey narrows unknown strings and remains usable as a boolean', () => {
  const consume = (input: unknown) => {
    if (isValidPublicKey(input)) return acceptString(input);
  };
  expectTypeOf(consume).returns.toEqualTypeOf<string | undefined>();
  const accepted: boolean = isValidPublicKey('invalid');
  expectTypeOf(accepted).toEqualTypeOf<boolean>();
});

test('isValidOperationHash narrows unknown strings and remains usable as a boolean', () => {
  const consume = (input: unknown) => {
    if (isValidOperationHash(input)) return acceptString(input);
  };
  expectTypeOf(consume).returns.toEqualTypeOf<string | undefined>();
  const accepted: boolean = isValidOperationHash('invalid');
  expectTypeOf(accepted).toEqualTypeOf<boolean>();
});

test('bs58check built-in types accept Uint8Array | number[] without Node Buffer union and return plain Uint8Array', () => {
  expectTypeOf(bs58check.encode).parameter(0).toEqualTypeOf<Uint8Array | number[]>();
  expectTypeOf(bs58check.decode).returns.toEqualTypeOf<Uint8Array>();
  expectTypeOf(bs58check.decodeUnsafe).returns.toEqualTypeOf<Uint8Array | undefined>();
});
