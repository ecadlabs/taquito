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
import { Prefix, prefix, prefixLength } from './constants';
import { validatePkAndExtractPrefix } from './verify-signature';
import { hash } from '@stablelib/blake2b';
import blake from 'blakejs';
import bs58check from 'bs58check';
import { ValueConversionError } from './errors';
import BigNumber from 'bignumber.js';
import { InvalidHexStringError } from '@taquito/core';
export * from './validators';
export { VERSION } from './version';

export { prefix, Prefix, prefixLength } from './constants';

export { verifySignature, validatePkAndExtractPrefix } from './verify-signature';
export * from './errors';

export { format } from './format';

/**
 *
 * @description Hash a string using the BLAKE2b algorithm, base58 encode the hash obtained and appends the prefix 'expr' to it
 *
 * @param value Value in hex
 */
export function encodeExpr(value: string) {
  const blakeHash = blake.blake2b(hex2buf(value), undefined, 32);
  return b58cencode(blakeHash, prefix['expr']);
}

/**
 *
 * @description Return the operation hash of a signed operation
 * @param value Value in hex of a signed operation
 */
export function encodeOpHash(value: string) {
  const blakeHash = blake.blake2b(hex2buf(value), undefined, 32);
  return b58cencode(blakeHash, prefix.o);
}

/**
 *
 * @description Base58 encode a string or a Uint8Array and append a prefix to it
 *
 * @param value Value to base58 encode
 * @param prefix prefix to append to the encoded string
 */
export function b58cencode(value: string | Uint8Array, prefix: Uint8Array) {
  const payloadAr = typeof value === 'string' ? Uint8Array.from(Buffer.from(value, 'hex')) : value;

  const n = new Uint8Array(prefix.length + payloadAr.length);
  n.set(prefix);
  n.set(payloadAr, prefix.length);

  return bs58check.encode(Buffer.from(n.buffer));
}

/**
 *
 * @description Base58 decode a string and remove the prefix from it
 *
 * @param value Value to base58 decode
 * @param prefix prefix to remove from the decoded string
 */
export const b58cdecode = (enc: string, prefixArg: Uint8Array): Uint8Array =>
  bs58check.decode(enc).slice(prefixArg.length);

/**
 *
 * @description Base58 decode a string with predefined prefix
 *
 * @param value Value to base58 decode
 */
export function b58decode(payload: string) {
  const buf = bs58check.decode(payload);

  const prefixMap = {
    [prefix.tz1.toString()]: '0000',
    [prefix.tz2.toString()]: '0001',
    [prefix.tz3.toString()]: '0002',
    [prefix.tz4.toString()]: '0003',
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
 *
 * @description b58 decode a string without predefined prefix
 * @param value
 * @returns string of bytes
 * @deprecated use b58decode instead
 */
export function b58decodeL2Address(payload: string) {
  const buf = bs58check.decode(payload);

  // tz4 address currently
  return buf2hex(buf.slice(3, 42));
}

/**
 *
 * @description Base58 encode an address using predefined prefix
 *
 * @param value Address to base58 encode (tz1, tz2, tz3 or KT1)
 * @deprecated use encodeAddress instead, same functionality with a more descriptive name
 */
export function encodePubKey(value: string) {
  if (value.substring(0, 2) === '00') {
    const pref: { [key: string]: Uint8Array } = {
      '0000': prefix.tz1,
      '0001': prefix.tz2,
      '0002': prefix.tz3,
      '0003': prefix.tz4,
    };

    return b58cencode(value.substring(4), pref[value.substring(0, 4)]);
  }
  return b58cencode(value.substring(2, 42), prefix.KT);
}

/**
 *
 * @description Base58 encode an address using predefined prefix (tz1, tz2, tz3, or KT1 without annotation)
 *
 * @param value Address to base58 encode (tz1, tz2, tz3 or KT1). Supports value with or without '0x' prefix
 */
export function encodeAddress(value: string) {
  if (value.substring(0, 2) === '0x') {
    value = value.slice(2);
  }

  if (value.substring(0, 2) === '00') {
    const pref: { [key: string]: Uint8Array } = {
      '0000': prefix.tz1,
      '0001': prefix.tz2,
      '0002': prefix.tz3,
      '0003': prefix.tz4,
    };

    return b58cencode(value.substring(4), pref[value.substring(0, 4)]);
  }
  return b58cencode(value.substring(2, 42), prefix.KT);
}
/**
 *
 * @description Base58 encode an address without predefined prefix
 * @param value Address to base58 encode (tz4) hex dec
 * @returns return address
 * @deprecated use encodeAddress instead
 */
export function encodeL2Address(value: string) {
  return b58cencode(value, prefix.tz4);
}
/**
 *
 * @description Base58 encode a key according to its prefix
 *
 * @param value Key to base58 encode
 */
export function encodeKey(value: string) {
  if (value[0] === '0') {
    const pref: { [key: string]: Uint8Array } = {
      '00': new Uint8Array([13, 15, 37, 217]),
      '01': new Uint8Array([3, 254, 226, 86]),
      '02': new Uint8Array([3, 178, 139, 127]),
    };

    return b58cencode(value.substring(2), pref[value.substring(0, 2)]);
  }
}

/**
 *
 * @description Base58 encode a key hash according to its prefix
 *
 * @param value Key hash to base58 encode
 */
export function encodeKeyHash(value: string) {
  if (value[0] === '0') {
    const pref: { [key: string]: Uint8Array } = {
      '00': new Uint8Array([6, 161, 159]),
      '01': new Uint8Array([6, 161, 161]),
      '02': new Uint8Array([6, 161, 164]),
      '03': new Uint8Array([6, 161, 167]),
    };

    return b58cencode(value.substring(2), pref[value.substring(0, 2)]);
  }
}

/**
 *
 * @description Convert an hex string to a Uint8Array
 *
 * @param hex Hex string to convert
 * @throws {@link ValueConversionError}
 */
export const hex2buf = (hex: string): Uint8Array => {
  if (hex.length % 2 !== 0) {
    throw new InvalidHexStringError(hex, `: Expecting even number of characters`);
  }
  const hexDigits = stripHexPrefix(hex);
  if (!hexDigits.match(/^([\da-f]{2})*$/gi)) {
    throw new InvalidHexStringError(
      hex,
      `: Only characters 0-9, a-f and A-F are expected. Optionally, it can be prefixed with '0x'`
    );
  }
  const out = new Uint8Array(hexDigits.length / 2);
  let j = 0;
  for (let i = 0; i < hexDigits.length; i += 2) {
    const v = parseInt(hexDigits.slice(i, i + 2), 16);
    if (Number.isNaN(v)) {
      throw new ValueConversionError(hex, 'Uint8Array');
    }
    out[j++] = v;
  }
  return out;
};

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
export const buf2hex = (buffer: Uint8Array): string => {
  const hexParts: string[] = [];
  buffer.forEach((byte) => {
    const hex = byte.toString(16);
    const paddedHex = `00${hex}`.slice(-2);
    hexParts.push(paddedHex);
  });
  return hexParts.join('');
};

/**
 *
 *  @description Gets Tezos address (PKH) from Public Key
 *
 *  @param publicKey Public Key
 *  @returns A string of the Tezos address (PKH) that was derived from the given Public Key
 */
export const getPkhfromPk = (publicKey: string): string => {
  let encodingPrefix;
  let prefixLen;

  const keyPrefix = validatePkAndExtractPrefix(publicKey);
  const decoded = b58cdecode(publicKey, prefix[keyPrefix]);

  switch (keyPrefix) {
    case Prefix.EDPK:
      encodingPrefix = prefix[Prefix.TZ1];
      prefixLen = prefixLength[Prefix.TZ1];
      break;
    case Prefix.SPPK:
      encodingPrefix = prefix[Prefix.TZ2];
      prefixLen = prefixLength[Prefix.TZ2];
      break;
    case Prefix.P2PK:
      encodingPrefix = prefix[Prefix.TZ3];
      prefixLen = prefixLength[Prefix.TZ3];
      break;
    case Prefix.BLPK:
      encodingPrefix = prefix[Prefix.TZ4];
      prefixLen = prefixLength[Prefix.TZ4];
  }

  const hashed = hash(decoded, prefixLen);
  const result = b58cencode(hashed, encodingPrefix);

  return result;
};

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
      `: Expecting even number of characters: 0-9, a-z, A-Z, optionally prefixed with 0x`
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
