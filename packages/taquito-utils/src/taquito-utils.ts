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
import { PrefixV2, prefixV2, payloadLength } from './constants';
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
export { PrefixV2, prefixV2, payloadLength } from './constants';
export { verifySignature, BLS12_381_DST, POP_DST } from './verify-signature';
export * from './errors';
export { format } from './format';

/**
 * @description list of prefixes that can be used to decode an address
 */
export const addressPrefixes = [
  PrefixV2.P256PublicKeyHash,
  PrefixV2.Secp256k1PublicKeyHash,
  PrefixV2.Ed25519PublicKeyHash,
  PrefixV2.BLS12_381PublicKeyHash,
  PrefixV2.ContractHash,
  PrefixV2.SmartRollupHash,
  // PrefixV2.ZkRollupHash,
];

/**
 * @description list of prefixes that can be used to decode a public key
 */
export const publicKeyPrefixes = [
  PrefixV2.P256PublicKey,
  PrefixV2.Secp256k1PublicKey,
  PrefixV2.Ed25519PublicKey,
  PrefixV2.BLS12_381PublicKey,
];

/**
 * @description list of prefixes that can be used to decode a public key hash
 */
export const publicKeyHashPrefixes = [
  PrefixV2.P256PublicKeyHash,
  PrefixV2.Secp256k1PublicKeyHash,
  PrefixV2.Ed25519PublicKeyHash,
  PrefixV2.BLS12_381PublicKeyHash,
];

/**
 * @description list of prefixes that can be used to decode a signature
 */
export const signaturePrefixes = [
  PrefixV2.P256Signature,
  PrefixV2.Secp256k1Signature,
  PrefixV2.Ed25519Signature,
  PrefixV2.BLS12_381Signature,
  PrefixV2.GenericSignature,
];

/**
 * @description Decodes Base58 string, looks for known prefix and strips it
 * @param src Base58 string
 * @returns Payload and prefix
 * @example b58DecodeAndCheckPrefix('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM') // returns [Uint8Array, PrefixV2.Ed25519PublicKeyHash]
 * @example b58DecodeAndCheckPrefix('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM', [PrefixV2.Ed25519PublicKeyHash]) // returns [Uint8Array, PrefixV2.Ed25519PublicKeyHash]
 * @example b58DecodeAndCheckPrefix('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM', [PrefixV2.Ed25519PublicKeyHash], true) // returns Uint8Array
 */
export function b58DecodeAndCheckPrefix<T extends readonly PrefixV2[]>(
  src: string,
  allowed?: T
): [Uint8Array, T[number]];
export function b58DecodeAndCheckPrefix<T extends readonly PrefixV2[]>(
  src: string,
  allowed: T,
  payloadOnly: false
): [Uint8Array, T[number]];
export function b58DecodeAndCheckPrefix<T extends readonly PrefixV2[]>(
  src: string,
  allowed: T,
  payloadOnly: true
): Uint8Array;
export function b58DecodeAndCheckPrefix<T extends readonly PrefixV2[]>(
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

  let key: keyof typeof PrefixV2;
  for (key in PrefixV2) {
    const p = PrefixV2[key];
    const pre = prefixV2[p];
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
 * @description Decode a Base58 public key and return its binary representation
 * @param value Value to decode
 * @param fmt optional format of the decoded return value, 'hex' or 'array'
 * @returns string or Uint8Array of bytes
 * @example b58DecodePublicKey('edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh') // return '0060842d4ba23a9940ef5dcf4404fdaa430cfaaccb5029fad06cb5ea894e4562ae'
 */
export function b58DecodePublicKey(value: string, fmt?: 'hex'): string;
export function b58DecodePublicKey(value: string, fmt: 'array'): Uint8Array;
export function b58DecodePublicKey(value: string, fmt?: 'hex' | 'array'): Uint8Array | string {
  const [data, pre] = b58DecodeAndCheckPrefix(value, publicKeyPrefixes);
  let tag: number;
  switch (pre) {
    case PrefixV2.Ed25519PublicKey:
      tag = 0;
      break;
    case PrefixV2.Secp256k1PublicKey:
      tag = 1;
      break;
    case PrefixV2.P256PublicKey:
      tag = 2;
      break;
    case PrefixV2.BLS12_381PublicKey:
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
 * @description Decode a Base58 public key hash and return its binary representation
 * @param value Value to decode
 * @param fmt optional format of the decoded return value, 'hex' or 'array'
 * @returns string or Uint8Array of bytes
 * @example b58DecodePublicKeyHash('tz2MVED1t9Jery77Bwm1m5YhUx8Wp5KWWRQe') // return '0001907d6a7e9f084df840d6e67ffa8db5464f87d4d1'
 */
export function b58DecodePublicKeyHash(value: string, fmt?: 'hex'): string;
export function b58DecodePublicKeyHash(value: string, fmt: 'array'): Uint8Array;
export function b58DecodePublicKeyHash(value: string, fmt?: 'hex' | 'array'): Uint8Array | string {
  const [data, pre] = b58DecodeAndCheckPrefix(value, publicKeyHashPrefixes);
  const buf = new Uint8Array(21);
  let tag: number;
  switch (pre) {
    case PrefixV2.Ed25519PublicKeyHash:
      tag = 0;
      break;
    case PrefixV2.Secp256k1PublicKeyHash:
      tag = 1;
      break;
    case PrefixV2.P256PublicKeyHash:
      tag = 2;
      break;
    case PrefixV2.BLS12_381PublicKeyHash:
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
 * @description Decode a Base58 string and assert tz4 type
 * @param value a bls address(tz4) to decode
 * @param fmt optional format of the decoded return value, 'hex' or 'array'
 * @returns string or Uint8Array of bytes
 * @example b58DecodeBlsAddress('tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8') // return 'af2dc3c40667abc0e89c0ef40171d22aed08d5eb'
 */
export function b58DecodeBlsAddress(value: string, fmt?: 'hex'): string;
export function b58DecodeBlsAddress(value: string, fmt: 'array'): Uint8Array;
export function b58DecodeBlsAddress(value: string, fmt?: 'hex' | 'array'): Uint8Array | string {
  const [buf, pre] = b58DecodeAndCheckPrefix(value);
  if (pre !== PrefixV2.BLS12_381PublicKeyHash) {
    throw new InvalidKeyError(ValidationResult.NO_PREFIX_MATCHED);
  }
  if (fmt !== undefined && fmt === 'array') {
    return buf;
  } else {
    return buf2hex(buf);
  }
}

/**
 * @description Decode a Base58 contract ID and return its binary representation
 * @param value Value to decode
 * @param fmt optional format of the decoded return value, 'hex' or 'array'
 * @returns string or Uint8Array of bytes
 * @example b58DecodeAddress('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM') // return '0000e96b9f8b19af9c7ffa0c0480e1977b295850961f'
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
    pre === PrefixV2.ContractHash ||
    pre === PrefixV2.SmartRollupHash ||
    pre === PrefixV2.ZkRollupHash
  ) {
    let tag: number;
    switch (pre) {
      case PrefixV2.ContractHash:
        tag = 1;
        break;
      case PrefixV2.SmartRollupHash:
        tag = 3;
        break;
      case PrefixV2.ZkRollupHash:
        tag = 4;
        break;
    }
    buf[0] = tag;
    buf.set(data, 1);
  } else {
    let tag: number;
    switch (pre) {
      case PrefixV2.Ed25519PublicKeyHash:
        tag = 0;
        break;
      case PrefixV2.Secp256k1PublicKeyHash:
        tag = 1;
        break;
      case PrefixV2.P256PublicKeyHash:
        tag = 2;
        break;
      case PrefixV2.BLS12_381PublicKeyHash:
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
 *  @description Gets Tezos address (PKH) from Public Key
 *  @param publicKey Base58 Public Key
 *  @returns A string of the Tezos address (PKH) that was derived from the given Public Key
 *  @example getPkhfromPk('edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh') // return 'tz2MVED1t9Jery77Bwm1m5YhUx8Wp5KWWRQe'
 */
export function getPkhfromPk(publicKey: string): string {
  const [key, pre] = b58DecodeAndCheckPrefix(publicKey);
  let pkhPre: PrefixV2;
  switch (pre) {
    case PrefixV2.P256PublicKey:
      pkhPre = PrefixV2.P256PublicKeyHash;
      break;
    case PrefixV2.Secp256k1PublicKey:
      pkhPre = PrefixV2.Secp256k1PublicKeyHash;
      break;
    case PrefixV2.Ed25519PublicKey:
      pkhPre = PrefixV2.Ed25519PublicKeyHash;
      break;
    case PrefixV2.BLS12_381PublicKey:
      pkhPre = PrefixV2.BLS12_381PublicKeyHash;
      break;
    default:
      throw new InvalidPublicKeyError(publicKey, ValidationResult.NO_PREFIX_MATCHED);
  }
  const hashed = blake2b(key, 20);
  return b58Encode(hashed, pkhPre);
}

/**
 * @description Add the prefix to a hex string or Uint8Array and Base58 encode it
 * @param value Value to Base58 encode
 * @param pre prefix ID to append to the encoded string
 * @example b58Encode('e96b9f8b19af9c7ffa0c0480e1977b295850961f', PrefixV2.Ed25519PublicKeyHash) // returns 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'
 */
export function b58Encode(value: string | Uint8Array, pre: PrefixV2): string {
  const data = typeof value === 'string' ? hex2buf(value) : value;
  const p = prefixV2[pre];
  const n = new Uint8Array(p.length + data.length);
  n.set(p);
  n.set(data, p.length);
  return bs58check.encode(toBuffer(n));
}

/**
 * @description Parse binary public key and return Base58 representation
 * @param value Binary key data
 * @returns return prefixed public key
 * @example encodeKey('02033aba7da4a2e7b5dd9f074555c118829aff16213ea1b65859686bd5fcfeaf3616') // return 'p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi'
 */
export function encodeKey(value: string | Uint8Array): string {
  let buf: Uint8Array;
  if (typeof value === 'string') {
    buf = hex2buf(value);
  } else {
    buf = value;
  }

  let pre: PrefixV2;
  switch (buf[0]) {
    case 0:
      pre = PrefixV2.Ed25519PublicKey;
      break;
    case 1:
      pre = PrefixV2.Secp256k1PublicKey;
      break;
    case 2:
      pre = PrefixV2.P256PublicKey;
      break;
    case 3:
      pre = PrefixV2.BLS12_381PublicKey;
      break;
    default:
      throw new Error('invalid address format');
  }
  return b58Encode(buf.slice(1), pre);
}

/**
 * @description Parse binary public key hash and return Base58 representation
 * @param value Key hash to parse
 * @returns return prefixed public key hash
 * @example encodeKeyHash('0001907d6a7e9f084df840d6e67ffa8db5464f87d4d1') // return 'tz2MVED1t9Jery77Bwm1m5YhUx8Wp5KWWRQe'
 */
export function encodeKeyHash(value: string | Uint8Array): string {
  let buf: Uint8Array;
  if (typeof value === 'string') {
    buf = hex2buf(value);
  } else {
    buf = value;
  }

  let pre: PrefixV2;
  switch (buf[0]) {
    case 0:
      pre = PrefixV2.Ed25519PublicKeyHash;
      break;
    case 1:
      pre = PrefixV2.Secp256k1PublicKeyHash;
      break;
    case 2:
      pre = PrefixV2.P256PublicKeyHash;
      break;
    case 3:
      pre = PrefixV2.BLS12_381PublicKeyHash;
      break;
    default:
      throw new Error('invalid address format');
  }
  return b58Encode(buf.slice(1, 21), pre);
}

/**
 * @description Parse binary Contract ID and return Base58 representation
 * @param value Address to parse (tz1, tz2, tz3, KT1, or sr1).
 * @example encodeAddress('0000e96b9f8b19af9c7ffa0c0480e1977b295850961f') // return 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'
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
      return b58Encode(buf.slice(1, 21), PrefixV2.ContractHash);
    case 3: // smart rollup hash
      return b58Encode(buf.slice(1, 21), PrefixV2.SmartRollupHash);
    case 4: // zk rollup hash
      return b58Encode(buf.slice(1, 21), PrefixV2.ZkRollupHash);
    default:
      throw new Error('invalid address format');
  }
}

/**
 * @description Base58 encode an address without predefined prefix
 * @param value Address to base58 encode (tz4) hex dec
 * @returns return address
 * @example encodeBlsAddress('af2dc3c40667abc0e89c0ef40171d22aed08d5eb') // return 'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8'
 */
export function encodeBlsAddress(value: string) {
  return b58Encode(value, PrefixV2.BLS12_381PublicKeyHash);
}

/**
 * @description convert a fragment of Michelson code in hex string to an 'expr' prefix + base58 encoded BLAKE2b hash string
 * @param value a fragment of Michelson code in hex string
 * @returns return 'expr' prefix + base58 encoded BLAKE2b hash
 * @example encodeExpr('050a000000160000b2e19a9e74440d86c59f13dab8a18ff873e889ea') // return 'exprv6UsC1sN3Fk2XfgcJCL8NCerP5rCGy1PRESZAqr7L2JdzX55EN'
 */
export function encodeExpr(value: string): string {
  const blakeHash = blake2b(hex2buf(value), 32);
  return b58Encode(blakeHash, PrefixV2.ScriptExpr);
}

/**
 * @description convert a signed operation in hex string to an 'op' prefix + base58 encoded BLAKE2b hash string
 * @param value signed operation in hex string
 * @returns return 'op' prefix + base58 encoded BLAKE2b hash
 * @example encodeOpHash('0f185d8a30061e8134c162dbb7a6c3ab8f5fdb153363ccd6149b49a33481156a6c00b2e19a9e74440d86c59f13dab8a18ff873e889eaa304ab05da13000001f1585a7384f36e45fb43dc37e8ce172bced3e05700ff0000000002002110c033f3a990c2e46a3d6054ecc2f74072aae7a34b5ac4d9ce9edc11c2410a97695682108951786f05b361da03b97245dc9897e1955e08b5b8d9e153b0bdeb0d') // return 'opapqvVXmebRTCFd2GQFydr4tJj3V5QocQuTmuhbatcHm4Seo2t'
 */
export function encodeOpHash(value: string) {
  const blakeHash = blake2b(hex2buf(value), 32);
  return b58Encode(blakeHash, PrefixV2.OperationHash);
}

/**
 * @description Convert an hex string to a Uint8Array
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
 * @description Merge 2 buffers together
 * @param b1 First buffer
 * @param b2 Second buffer
 */
export function mergebuf(b1: Uint8Array, b2: Uint8Array): Uint8Array {
  const r = new Uint8Array(b1.length + b2.length);
  r.set(b1);
  r.set(b2, b1.length);
  return r;
}

/**
 * @description Flatten a michelson json representation to an array
 * @param s michelson json
 */
export function mic2arr(s: any): any {
  let ret: any = [];
  if (Object.prototype.hasOwnProperty.call(s, 'prim')) {
    if (s.prim === 'Pair') {
      ret.push(mic2arr(s.args[0]));
      ret = ret.concat(mic2arr(s.args[1]));
    } else if (s.prim === 'Elt') {
      ret = {
        key: mic2arr(s.args[0]),
        val: mic2arr(s.args[1]),
      };
    } else if (s.prim === 'True') {
      ret = true;
    } else if (s.prim === 'False') {
      ret = false;
    }
  } else if (Array.isArray(s)) {
    const sc = s.length;
    for (let i = 0; i < sc; i++) {
      const n = mic2arr(s[i]);
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
}

/**
 * @description Convert a Uint8Array to an hex string
 * @param buffer Uint8Array to convert
 */

export function buf2hex(bytes: ArrayLike<number>): string {
  return Array.from(bytes)
    .map((x) => ((x >> 4) & 0xf).toString(16) + (x & 0xf).toString(16))
    .join('');
}

/**
 * @description Convert a string to a byte string representation
 * @param str String to convert
 */
export function stringToBytes(str: string) {
  return Buffer.from(str, 'utf8').toString('hex');
}

/**
 * @description Convert byte string representation to string
 * @param hex byte string to convert
 */
export function bytesToString(hex: string): string {
  return Buffer.from(hex2buf(hex)).toString('utf8');
}

/**
 * @description Convert hex string/UintArray/Buffer to bytes
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
 * @description Converts a number or Bignumber to hexadecimal  string
 * @param val The value  that will be converted to a hexadecimal string value
 */
export function toHexBuf(val: number | BigNumber, bitLength = 8) {
  return Buffer.from(num2PaddedHex(val, bitLength), 'hex');
}
export function numToHexBuffer(val: number | BigNumber, bitLength = 8) {
  return Buffer.from(num2PaddedHex(val, bitLength), 'hex');
}

/**
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

/**
 * @deprecated use b58DecodeAndCheckPrefix instead, this function will be removed in the next minor release
 * @description Base58 decode a string and remove the prefix from it
 * @param enc Value to base58 decode
 * @param prefixArg prefix to remove from the decoded string
 */
export function b58cdecode(enc: string, prefixArg: Uint8Array): Uint8Array {
  return bs58check.decode(enc).slice(prefixArg.length);
}

/**
 * @deprecated use b58Encode instead, this function will be removed in the next minor release
 * @description Base58 encode a string or a Uint8Array and append a prefix to it
 * @param value Value to base58 encode
 * @param prefix prefix to append to the encoded string
 */
export function b58cencode(value: string | Uint8Array, prefix: Uint8Array): string {
  const payloadAr = typeof value === 'string' ? hex2buf(value) : value;
  const n = new Uint8Array(prefix.length + payloadAr.length);
  n.set(prefix);
  n.set(payloadAr, prefix.length);
  return bs58check.encode(toBuffer(n));
}

/**
 * @deprecated use b58DecodePublicKey, b58DecodePublicKeyHash, b58DecodeBlsAddress, b58DecodeAddress instead, this function will be removed in the next minor release
 * @description Base58 decode a string with predefined prefix
 * @param payload Value to base58 decode
 */
export function b58decode(payload: string) {
  const buf = bs58check.decode(payload);

  const prefixMap = {
    [prefixV2[PrefixV2.Ed25519PublicKeyHash].toString()]: '0000',
    [prefixV2[PrefixV2.Secp256k1PublicKeyHash].toString()]: '0001',
    [prefixV2[PrefixV2.P256PublicKeyHash].toString()]: '0002',
    [prefixV2[PrefixV2.BLS12_381PublicKeyHash].toString()]: '0003',
  };

  const pref = prefixMap[new Uint8Array(buf.slice(0, 3)).toString()];
  if (pref) {
    // tz addresses
    const hex = buf2hex(buf.slice(3));
    return pref + hex;
  } else {
    // other (kt addresses)
    return '01' + buf2hex(buf.slice(3, 42)) + '00';
  }
}

/**
 * @deprecated use b58DecodeBlsAddress instead, this function will be removed in the next minor release
 * @description b58 decode a string without predefined prefix
 * @param payload Value to base58 decode
 * @returns string of bytes
 */
export function b58decodeL2Address(payload: string) {
  const buf = bs58check.decode(payload);

  // tz4 address currently
  return buf2hex(buf.slice(3, 42));
}

/**
 * @deprecated use encodeAddress instead, this function will be removed in the next minor release
 * @description Base58 encode an address using predefined prefix
 * @param value Address to base58 encode (tz1, tz2, tz3 or KT1)
 */
export function encodePubKey(value: string) {
  return encodeAddress(value);
}

/**
 * @deprecated use encodeBlsAddress instead, this function will be removed in the next minor release
 * @description Base58 encode an address without predefined prefix
 * @param value Address to base58 encode (tz4) hex dec
 * @returns return address
 */
export function encodeL2Address(value: string) {
  return b58cencode(value, prefixV2[PrefixV2.BLS12_381PublicKeyHash]);
}

/**
 * @deprecated use stringToBytes instead, this function will be removed in the next minor release
 * @description Convert a string to bytes
 * @param str String to convert
 */
export function char2Bytes(str: string) {
  return Buffer.from(str, 'utf8').toString('hex');
}

/**
 * @deprecated use bytesToString instead, this function will be removed in the next minor release
 * @description Convert bytes to a string
 * @param hex Bytes to convert
 */
export function bytes2Char(hex: string): string {
  return Buffer.from(hex2buf(hex)).toString('utf8');
}
