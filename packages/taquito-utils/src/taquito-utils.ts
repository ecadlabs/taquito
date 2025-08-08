/**
 * @packageDocumentation
 * @module @taquito/utils
 */

/*
 * Some code in this file is originally from sotez and eztz
 * Copyright (c) 2018 Andrew Kishino
 * Copyright (c) 2017 Stephen Andrews
 */

import { Buffer } from 'buffer';
import { Prefix, prefix, payloadLength } from './constants';
import { hash as blake2b } from '@stablelib/blake2b';
import bs58check from 'bs58check';
import BigNumber from 'bignumber.js';
import toBuffer from 'typedarray-to-buffer';
import {
  InvalidAddressError,
  InvalidHexStringError,
  InvalidKeyError,
  InvalidPublicKeyError,
  ParameterValidationError,
} from '@taquito/core';
import { ValidationResult } from './validators';
export * from './validators';
export { VERSION } from './version';
export { Prefix, payloadLength } from './constants';
export { verifySignature } from './verify-signature';
export * from './errors';
export { format } from './format';
export { BLS12_381_DST } from './verify-signature';

/**
 *
 * @description Hash a string using the BLAKE2b algorithm, base58 encode the hash obtained and appends the prefix 'expr' to it
 *
 * @param value Value in hex
 */
export function encodeExpr(value: string): string {
  const blakeHash = blake2b(hex2buf(value), 32);
  return b58Encode(blakeHash, Prefix.ScriptExpr);
}

/**
 *
 * @description Return the operation hash of a signed operation
 * @param value Value in hex of a signed operation
 */
export function encodeOpHash(value: string) {
  const blakeHash = blake2b(hex2buf(value), 32);
  return b58Encode(blakeHash, Prefix.OperationHash);
}

// /**
//  *
//  * @description Base58 encode a string or a Uint8Array and append a prefix to it
//  *
//  * @param value Value to base58 encode
//  * @param prefix prefix to append to the encoded string
//  */
// export function b58cencode(value: string | Uint8Array, prefix: Uint8Array): string {
//   const payloadAr = typeof value === 'string' ? hex2buf(value) : value;
//   const n = new Uint8Array(prefix.length + payloadAr.length);
//   n.set(prefix);
//   n.set(payloadAr, prefix.length);
//   return bs58check.encode(toBuffer(n));
// }

export const addressPrefixes = [
  Prefix.P256PublicKeyHash,
  Prefix.Secp256k1PublicKeyHash,
  Prefix.Ed25519PublicKeyHash,
  Prefix.BLS12_381PublicKeyHash,
  Prefix.ContractHash,
  Prefix.SmartRollupHash,
  Prefix.ZkRollupHash,
] as const;

export const publicKeyHashPrefixes = [
  Prefix.P256PublicKeyHash,
  Prefix.Secp256k1PublicKeyHash,
  Prefix.Ed25519PublicKeyHash,
  Prefix.BLS12_381PublicKeyHash,
] as const;

export const publicKeyPrefixes = [
  Prefix.P256PublicKey,
  Prefix.Secp256k1PublicKey,
  Prefix.Ed25519PublicKey,
  Prefix.BLS12_381PublicKey,
] as const;

export const signaturePrefixes = [
  Prefix.GenericSignature,
  Prefix.P256Signature,
  Prefix.Secp256k1Signature,
  Prefix.Ed25519Signature,
  Prefix.BLS12_381Signature,
] as const;

/**
 *
 * @description Decode a Base58 contract ID and return its binary representation
 *
 * @param value Value to decode
 */
export function b58DecodeAddress(value: string, fmt?: 'hex'): string;
export function b58DecodeAddress(value: string, fmt: 'array'): Uint8Array;
export function b58DecodeAddress(value: string, fmt?: 'hex' | 'array'): Uint8Array | string {
  const i = value.indexOf('%');
  if (i >= 0) {
    value = value.slice(0, i);
  }
  const [data, pre] = b58DecodeAndCheckPrefix(value, addressPrefixes);
  const buf = new Uint8Array(22);
  if (
    pre === Prefix.ContractHash ||
    pre === Prefix.SmartRollupHash ||
    pre === Prefix.ZkRollupHash
  ) {
    let tag: number;
    switch (pre) {
      case Prefix.ContractHash:
        tag = 1;
        break;
      case Prefix.SmartRollupHash:
        tag = 3;
        break;
      case Prefix.ZkRollupHash:
        tag = 4;
        break;
    }
    buf[0] = tag;
    buf.set(data, 1);
  } else {
    let tag: number;
    switch (pre) {
      case Prefix.Ed25519PublicKeyHash:
        tag = 0;
        break;
      case Prefix.Secp256k1PublicKeyHash:
        tag = 1;
        break;
      case Prefix.P256PublicKeyHash:
        tag = 2;
        break;
      case Prefix.BLS12_381PublicKeyHash:
        tag = 3;
        break;
      default:
        throw new InvalidAddressError(value, ValidationResult.NO_PREFIX_MATCHED);
    }
    buf[0] = 0;
    buf[1] = tag;
    buf.set(data, 2);
  }
  if (fmt !== undefined && fmt === 'array') {
    return buf;
  } else {
    return buf2hex(buf);
  }
}

/**
 *
 * @description Decode a Base58 public key hash and return its binary representation
 *
 * @param value Value to decode
 */

export function b58DecodePublicKeyHash(value: string, fmt?: 'hex'): string;
export function b58DecodePublicKeyHash(value: string, fmt: 'array'): Uint8Array;
export function b58DecodePublicKeyHash(value: string, fmt?: 'hex' | 'array'): Uint8Array | string {
  const [data, pre] = b58DecodeAndCheckPrefix(value, publicKeyHashPrefixes);
  const buf = new Uint8Array(21);
  let tag: number;
  switch (pre) {
    case Prefix.Ed25519PublicKeyHash:
      tag = 0;
      break;
    case Prefix.Secp256k1PublicKeyHash:
      tag = 1;
      break;
    case Prefix.P256PublicKeyHash:
      tag = 2;
      break;
    case Prefix.BLS12_381PublicKeyHash:
      tag = 3;
      break;
    default:
      throw new InvalidAddressError(value, ValidationResult.NO_PREFIX_MATCHED);
  }
  buf[0] = tag;
  buf.set(data, 1);
  if (fmt !== undefined && fmt === 'array') {
    return buf;
  } else {
    return buf2hex(buf);
  }
}

/**
 *
 * @description Decode a Base58 public key and return its binary representation
 *
 * @param value Value to decode
 */
export function b58DecodePublicKey(value: string, fmt?: 'hex'): string;
export function b58DecodePublicKey(value: string, fmt: 'array'): Uint8Array;
export function b58DecodePublicKey(value: string, fmt?: 'hex' | 'array'): Uint8Array | string {
  const [data, pre] = b58DecodeAndCheckPrefix(value, publicKeyPrefixes);
  let tag: number;
  switch (pre) {
    case Prefix.Ed25519PublicKey:
      tag = 0;
      break;
    case Prefix.Secp256k1PublicKey:
      tag = 1;
      break;
    case Prefix.P256PublicKey:
      tag = 2;
      break;
    case Prefix.BLS12_381PublicKey:
      tag = 3;
      break;
    default:
      throw new InvalidKeyError(ValidationResult.NO_PREFIX_MATCHED);
  }
  const buf = new Uint8Array(data.length + 1);
  buf[0] = tag;
  buf.set(data, 1);
  if (fmt !== undefined && fmt === 'array') {
    return buf;
  } else {
    return buf2hex(buf);
  }
}

/**
 *
 * @description Decode a Base58 string and assert tz4 type
 * @param value
 * @returns string of bytes
 * @deprecated use b58decode instead
 */
export function b58DecodeL2Address(value: string, fmt?: 'hex'): string;
export function b58DecodeL2Address(value: string, fmt: 'array'): Uint8Array;
export function b58DecodeL2Address(value: string, fmt?: 'hex' | 'array'): Uint8Array | string {
  const [buf, pre] = b58DecodeAndCheckPrefix(value);
  if (pre !== Prefix.BLS12_381PublicKeyHash) {
    throw new InvalidKeyError(ValidationResult.NO_PREFIX_MATCHED);
  }
  if (fmt !== undefined && fmt === 'array') {
    return buf;
  } else {
    return buf2hex(buf);
  }
}

/**
 *
 * @description Base58 encode an address using predefined prefix
 *
 * @param value Address to base58 encode (tz1, tz2, tz3 or KT1)
 * @deprecated use encodeAddress instead, same functionality with a more descriptive name
 */
export function encodePubKey(value: string) {
  return encodeAddress(value);
}

/**
 *
 * @description Parse binary Contract ID and return Base58 representation
 *
 * @param value Address to parse (tz1, tz2, tz3 or KT1).
 */
export function encodeAddress(value: string | Uint8Array): string {
  let buf: Uint8Array;
  if (typeof value === 'string') {
    buf = hex2buf(value);
  } else {
    buf = value;
  }

  switch (buf[0]) {
    case 0: // implicit
      return encodeKeyHash(buf.slice(1));
    case 1: // contract hash
      return b58Encode(buf.slice(1, 21), Prefix.ContractHash);
    default:
      throw new Error('invalid address format');
  }
}

/**
 *
 * @description Base58 encode an address without predefined prefix
 * @param value Address to base58 encode (tz4) hex dec
 * @returns return address
 * @deprecated use encodeAddress instead
 */
export function encodeL2Address(value: string) {
  return b58Encode(value, Prefix.BLS12_381PublicKeyHash);
}

/**
 *
 * @description Parse binary public key and return Base58 representation
 *
 * @param value Binary key data
 */
export function encodeKey(value: string | Uint8Array): string {
  let buf: Uint8Array;
  if (typeof value === 'string') {
    buf = hex2buf(value);
  } else {
    buf = value;
  }

  let pre: Prefix;
  switch (buf[0]) {
    case 0:
      pre = Prefix.Ed25519PublicKey;
      break;
    case 1:
      pre = Prefix.Secp256k1PublicKey;
      break;
    case 2:
      pre = Prefix.P256PublicKey;
      break;
    case 3:
      pre = Prefix.BLS12_381PublicKey;
      break;
    default:
      throw new Error('invalid address format');
  }
  return b58Encode(buf.slice(1), pre);
}

/**
 *
 * @description Parse binary public key hash and return Base58 representation
 *
 * @param value Key hash to parse
 */
export function encodeKeyHash(value: string | Uint8Array): string {
  let buf: Uint8Array;
  if (typeof value === 'string') {
    buf = hex2buf(value);
  } else {
    buf = value;
  }

  let pre: Prefix;
  switch (buf[0]) {
    case 0:
      pre = Prefix.Ed25519PublicKeyHash;
      break;
    case 1:
      pre = Prefix.Secp256k1PublicKeyHash;
      break;
    case 2:
      pre = Prefix.P256PublicKeyHash;
      break;
    case 3:
      pre = Prefix.BLS12_381PublicKeyHash;
      break;
    default:
      throw new Error('invalid address format');
  }
  return b58Encode(buf.slice(1, 21), pre);
}

/**
 *
 * @description Convert an hex string to a Uint8Array
 *
 * @param hex Hex string to convert
 * @throws {@link ValueConversionError}
 */
export function hex2buf(hex: string): Uint8Array {
  hex = hex.startsWith('0x') ? hex.slice(2) : hex;
  if (hex.length % 2 !== 0) {
    throw new InvalidHexStringError(hex, `Expecting even number of characters`);
  }
  if (!hex.match(/^([\da-f]{2})*$/gi)) {
    throw new InvalidHexStringError(
      hex,
      `Only characters 0-9, a-f and A-F are expected. Optionally, it can be prefixed with '0x'`
    );
  }
  const res = new Uint8Array(hex.length / 2);
  let j = 0;
  for (let i = 0; i < hex.length; i += 2) {
    const ss = hex.slice(i, i + 2);
    const x = parseInt(ss, 16);
    if (Number.isNaN(x)) {
      throw new InvalidHexStringError(
        hex,
        `Only characters 0-9, a-f and A-F are expected. Optionally, it can be prefixed with '0x'`
      );
    }
    res[j++] = x;
  }
  return res;
}

/**
 *
 * @description Merge 2 buffers together
 *
 * @param b1 First buffer
 * @param b2 Second buffer
 */
export const mergebuf = (b1: Uint8Array, b2: Uint8Array): Uint8Array => {
  const r = new Uint8Array(b1.length + b2.length);
  r.set(b1);
  r.set(b2, b1.length);
  return r;
};

/**
 *
 * @description Flatten a michelson json representation to an array
 *
 * @param s michelson json
 */

export const mic2arr = function me2(s: any): any {
  let ret: any = [];
  if (Object.prototype.hasOwnProperty.call(s, 'prim')) {
    if (s.prim === 'Pair') {
      ret.push(me2(s.args[0]));
      ret = ret.concat(me2(s.args[1]));
    } else if (s.prim === 'Elt') {
      ret = {
        key: me2(s.args[0]),
        val: me2(s.args[1]),
      };
    } else if (s.prim === 'True') {
      ret = true;
    } else if (s.prim === 'False') {
      ret = false;
    }
  } else if (Array.isArray(s)) {
    const sc = s.length;
    for (let i = 0; i < sc; i++) {
      const n = me2(s[i]);
      if (typeof n.key !== 'undefined') {
        if (Array.isArray(ret)) {
          ret = {
            keys: [],
            vals: [],
          };
        }
        ret.keys.push(n.key);
        ret.vals.push(n.val);
      } else {
        ret.push(n);
      }
    }
  } else if (Object.prototype.hasOwnProperty.call(s, 'string')) {
    ret = s.string;
  } else if (Object.prototype.hasOwnProperty.call(s, 'int')) {
    ret = parseInt(s.int, 10);
  } else {
    ret = s;
  }
  return ret;
};

/**
 *
 * @description Convert a Uint8Array to an hex string
 *
 * @param buffer Uint8Array to convert
 */

export function buf2hex(bytes: ArrayLike<number>): string {
  return Array.from(bytes)
    .map((x) => ((x >> 4) & 0xf).toString(16) + (x & 0xf).toString(16))
    .join('');
}

/**
 *
 *  @description Gets Tezos address (PKH) from Public Key
 *
 *  @param publicKey Base58 Public Key
 *  @returns A string of the Tezos address (PKH) that was derived from the given Public Key
 */
export function getPkhfromPk(publicKey: string): string {
  const [key, pre] = b58DecodeAndCheckPrefix(publicKey);
  let pkhPre: Prefix;
  switch (pre) {
    case Prefix.P256PublicKey:
      pkhPre = Prefix.P256PublicKeyHash;
      break;
    case Prefix.Secp256k1PublicKey:
      pkhPre = Prefix.Secp256k1PublicKeyHash;
      break;
    case Prefix.Ed25519PublicKey:
      pkhPre = Prefix.Ed25519PublicKeyHash;
      break;
    case Prefix.BLS12_381PublicKey:
      pkhPre = Prefix.BLS12_381PublicKeyHash;
      break;
    default:
      throw new InvalidPublicKeyError(publicKey, ValidationResult.NO_PREFIX_MATCHED);
  }
  const hashed = blake2b(key, 20);
  return b58Encode(hashed, pkhPre);
}

/**
 *
 * @description Convert a string to bytes
 *
 * @param str String to convert
 * @deprecated use stringToBytes instead, same functionality with a more descriptive name
 */
export function char2Bytes(str: string) {
  return Buffer.from(str, 'utf8').toString('hex');
}

/**
 *
 * @description Convert a string to a byte string representation
 *
 * @param str String to convert
 */
export function stringToBytes(str: string) {
  return Buffer.from(str, 'utf8').toString('hex');
}

/**
 *
 * @description Convert bytes to a string
 *
 * @param str Bytes to convert
 * @deprecated use hexStringToBytes instead, same functionality with a more descriptive name
 */
export function bytes2Char(hex: string): string {
  return Buffer.from(hex2buf(hex)).toString('utf8');
}

/**
 *
 * @description Convert byte string representation to string
 *
 * @param str byte string to convert
 */
export function bytesToString(hex: string): string {
  return Buffer.from(hex2buf(hex)).toString('utf8');
}

/**
 *
 * @description Convert hex string/UintArray/Buffer to bytes
 *
 * @param hex String value to convert to bytes
 */
export function hex2Bytes(hex: string): Buffer {
  const hexDigits = stripHexPrefix(hex);
  if (!hexDigits.match(/^(0x)?([\da-f]{2})*$/gi)) {
    throw new InvalidHexStringError(
      hex,
      `Expecting even number of characters: 0-9, a-z, A-Z, optionally prefixed with 0x`
    );
  }
  return Buffer.from(hexDigits, 'hex');
}

/**
 *
 * @description Converts a number or Bignumber to hexadecimal  string
 *
 * @param val The value  that will be converted to a hexadecimal string value
 */
export function toHexBuf(val: number | BigNumber, bitLength = 8) {
  return Buffer.from(num2PaddedHex(val, bitLength), 'hex');
}
export function numToHexBuffer(val: number | BigNumber, bitLength = 8) {
  return Buffer.from(num2PaddedHex(val, bitLength), 'hex');
}

/**
 *
 * @description Converts a number or BigNumber to a padded hexadecimal string
 * @param val The value that will be converted into a padded hexadecimal string value
 * @param bitLength The length of bits
 *
 */
export function num2PaddedHex(val: number | BigNumber, bitLength = 8): string {
  if (new BigNumber(val).isPositive()) {
    const nibbleLength: number = Math.ceil(bitLength / 4);
    const hex: string = val.toString(16);

    // check whether nibble (4 bits) length is higher or lower than the current hex string length
    let targetLength: number = hex.length >= nibbleLength ? hex.length : nibbleLength;

    // make sure the hex string target length is even
    targetLength = targetLength % 2 == 0 ? targetLength : targetLength + 1;

    return padHexWithZero(hex, targetLength);
  } else {
    const twosCompliment: BigNumber = new BigNumber(2)
      .pow(bitLength)
      .minus(new BigNumber(val).abs());
    return twosCompliment.toString(16);
  }
}

function padHexWithZero(hex: string, targetLength: number): string {
  const padString = '0';
  if (hex.length >= targetLength) {
    return hex;
  } else {
    const padLength = targetLength - hex.length;
    return padString.repeat(padLength) + hex;
  }
}

/**
 *
 * @description Strips the first 2 characters of a hex string (0x)
 *
 * @param hex string to strip prefix from
 */
export function stripHexPrefix(hex: string): string {
  return hex.startsWith('0x') ? hex.slice(2) : hex;
}

/**
 * @description Decodes Base58 string, looks for known prefix and strips it
 * @param src Base58 string
 * @returns Payload and prefix
 */
export function b58DecodeAndCheckPrefix<T extends readonly Prefix[]>(
  src: string,
  allowed?: T
): [Uint8Array, T[number]];
export function b58DecodeAndCheckPrefix<T extends readonly Prefix[]>(
  src: string,
  allowed: T,
  payloadOnly: false
): [Uint8Array, T[number]];
export function b58DecodeAndCheckPrefix<T extends readonly Prefix[]>(
  src: string,
  allowed: T,
  payloadOnly: true
): Uint8Array;
export function b58DecodeAndCheckPrefix<T extends readonly Prefix[]>(
  src: string,
  allowed?: T,
  payloadOnly?: boolean
): [Uint8Array, T[number]] | Uint8Array {
  const buf = (() => {
    try {
      return bs58check.decode(src);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('checksum')) {
          throw new ParameterValidationError(ValidationResult.INVALID_CHECKSUM);
        } else {
          throw new ParameterValidationError(ValidationResult.INVALID_ENCODING);
        }
      } else {
        throw err;
      }
    }
  })();

  let key: keyof typeof Prefix;
  for (key in Prefix) {
    const p = Prefix[key];
    const pre = prefix[p];
    if (
      buf.length === pre.length + payloadLength[p] &&
      buf.slice(0, pre.length).every((v, i) => v == pre[i])
    ) {
      if (allowed !== undefined && allowed.indexOf(p) < 0) {
        throw new ParameterValidationError(ValidationResult.PREFIX_NOT_ALLOWED);
      }
      if (payloadOnly) {
        return buf.slice(pre.length);
      } else {
        return [buf.slice(pre.length), p];
      }
    }
  }
  throw new ParameterValidationError(ValidationResult.NO_PREFIX_MATCHED);
}

/**
 *
 * @description Add the prefix to a hex string or Uint8Array and Base58 encode it
 *
 * @param value Value to Base58 encode
 * @param pre prefix ID to append to the encoded string
 */
export function b58Encode(value: string | Uint8Array, pre: Prefix): string {
  const data = typeof value === 'string' ? hex2buf(value) : value;
  const p = prefix[pre];
  const n = new Uint8Array(p.length + data.length);
  n.set(p);
  n.set(data, p.length);
  return bs58check.encode(toBuffer(n));
}

export function splitAddress(addr: string): [string, string | null] {
  const i = addr.indexOf('%');
  if (i >= 0) {
    return [addr.slice(0, i), addr.slice(i)];
  } else {
    return [addr, null];
  }
}

export function compareArrays(a: ArrayLike<number>, b: ArrayLike<number>): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const aa = i < a.length ? a[i] : 0;
  const bb = i < b.length ? b[i] : 0;
  return aa < bb ? -1 : aa > bb ? 1 : 0;
}
