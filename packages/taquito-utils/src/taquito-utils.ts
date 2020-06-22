/*
 * Some code in this file is originally from sotez and eztz
 * Copyright (c) 2018 Andrew Kishino
 * Copyright (c) 2017 Stephen Andrews
 */

import { Buffer } from 'buffer';
import { prefix } from './constants';
const blake = require('blakejs');
const bs58check = require('bs58check');

export * from './validators';

export { prefix, Prefix, prefixLength } from './constants';

/**
 *
 * @description Hash a string using the BLAKE2b algorithm, base58 encode the hash obtained and appends the prefix 'expr' to it
 *
 * @param value Value in hex
 */
export function encodeExpr(value: string) {
  const blakeHash = blake.blake2b(hex2buf(value), null, 32);
  return b58cencode(blakeHash, prefix['expr']);
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
  const buf: Buffer = bs58check.decode(payload);

  const prefixMap = {
    [prefix.tz1.toString()]: '0000',
    [prefix.tz2.toString()]: '0001',
    [prefix.tz3.toString()]: '0002',
  };

  let pref = prefixMap[new Uint8Array(buf.slice(0, 3)).toString()];
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
 * @description Base58 encode a public key using predefined prefix
 *
 * @param value Public Key to base58 encode
 */
export function encodePubKey(value: string) {
  if (value.substring(0, 2) === '00') {
    const pref: { [key: string]: Uint8Array } = {
      '0000': prefix.tz1,
      '0001': prefix.tz2,
      '0002': prefix.tz3,
    };

    return b58cencode(value.substring(4), pref[value.substring(0, 4)]);
  }

  return b58cencode(value.substring(2, 42), prefix.KT);
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
 * @param value Key to base58 encode
 */
export function encodeKeyHash(value: string) {
  if (value[0] === '0') {
    const pref: { [key: string]: Uint8Array } = {
      '00': new Uint8Array([6, 161, 159]),
      '01': new Uint8Array([6, 161, 161]),
      '02': new Uint8Array([6, 161, 164]),
    };

    return b58cencode(value.substring(2), pref[value.substring(0, 2)]);
  }
}

/**
 *
 * @description Convert an hex string to a Uint8Array
 *
 * @param hex Hex string to convert
 */
export const hex2buf = (hex: string): Uint8Array => {
  return new Uint8Array(hex.match(/[\da-f]{2}/gi)!.map((h) => parseInt(h, 16)));
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
 * @description Convert a buffer to an hex string
 *
 * @param buffer Buffer to convert
 */
export const buf2hex = (buffer: Buffer): string => {
  const byteArray = new Uint8Array(buffer);
  const hexParts: string[] = [];
  byteArray.forEach((byte: any) => {
    const hex = byte.toString(16);
    const paddedHex = `00${hex}`.slice(-2);
    hexParts.push(paddedHex);
  });
  return hexParts.join('');
};
