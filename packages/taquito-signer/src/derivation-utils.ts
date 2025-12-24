import { SigningKey } from "./key-interface";
import { InvalidDerivationPathError } from '@taquito/core';
import { InvalidDerivationIndexError, InvalidMnemonicError, InvalidSeedLengthError } from './errors';
import * as Bip39 from 'bip39';
import { Curve as ECCurve } from "./ec-key";

export type Curve = ECCurve | 'ed25519' | 'bip25519' | 'bls12-381';

/**
 * @description Converts big endian unsigned integer to bigint
 */
export function arrayToBigInt(src: Uint8Array): bigint {
  let out = BigInt(0);
  for (const x of src) {
    out = (out << BigInt(8)) | BigInt(x);
  }
  return out;
}

/**
 * @description Converts bigint to big endian array with optional padding
 */
export function bigIntToArray(n: bigint, size?: number): Uint8Array {
  const out = [];
  let i = 0;
  while (size === undefined && n !== BigInt(0) || size !== undefined && i < size) {
    out.push(Number(BigInt.asUintN(8, n)));
    n = n >> BigInt(8);
    i++;
  }
  if (n !== BigInt(0)) {
    throw new Error('number is too large');
  }
  if (out.length === 0) {
    out.push(0);
  }
  return new Uint8Array(out.reverse());
}

export interface ParentSigningKey extends SigningKey {
  /**
   * @description Derive Nth child using curve-specific algorithm
   * @returns the child key
   */
  derive(index: number): this;
}

export interface FromSeedConstructor<T extends SigningKey> {
  /**
   * @description constructs a signing key from BIP-32/ERC-2333 seed
   * @returns the signing key
   */
  fromSeed(seed: Uint8Array): T;
}

export type Path = Iterable<number>;
export const Hard = 0x80000000;

/**
 * @description returns numeric representation of the derivation path
 * @param s derivation path string eg: 44'/1729'/0'/0'
 */
export function pathFromString(s: string): number[] {
  if (s.length === 0) {
    return [];
  }
  let parts = s.split('/');
  const out: number[] = [];
  if (parts[0] === 'm') {
    parts = parts.slice(1);
  }
  for (let p of parts) {
    if (p.length === 0) {
      throw new InvalidDerivationPathError(s, `: Invalid BIP32 path`);
    }
    let h = 0;
    const last = p[p.length - 1];
    if (last === "'" || last === 'h' || last === 'H') {
      h = Hard;
      p = p.slice(0, p.length - 1);
    }
    const index = parseInt(p, 10) | h;
    out.push(index);
  }
  return out;
}


/**
 * @description returns string representation of the path in canonical format starting with 'm/'
 */
export function pathToString(path: Path): string {
  let out = "m";
  for (const x of path) {
    out += "/" + String(x & ~Hard);
    if ((x & Hard) !== 0) {
      out += "'";
    }
  }
  return out;
}

/**
 * @description returns derived child key
 */
export function derivePath<T extends ParentSigningKey>(parent: T, path: Path | string): T {
  const p = typeof path === 'string' ? pathFromString(path) : path;
  for (const x of p) {
    try {
      parent = parent.derive(x);
    } catch (err: unknown) {
      if (err instanceof InvalidDerivationIndexError) {
        throw new InvalidDerivationPathError(pathToString(p));
      } else {
        throw err;
      }
    }
  }
  return parent;
}

// MinSeedSize is the minimal allowed seed byte length
export const minSeedSize = 16;
// MaxSeedSize is the maximal allowed seed byte length
export const maxSeedSize = 64;

/**
 * @description constructs a signing key from BIP-32/ERC-2333 seed and returns its derivative (a child key)
 */
export function deriveSigningKeyFromSeed<T extends ParentSigningKey, C extends FromSeedConstructor<T>>(ctor: C, seed: Uint8Array, path: Path | string): T {
  if (seed.length < minSeedSize || seed.length > maxSeedSize) {
    throw new InvalidSeedLengthError(seed.length);
  }
  const parent = ctor.fromSeed(seed);
  return derivePath(parent, path);
}

/**
 * @description constructs a signing key from BIP-39 mnemonic
 */
export function signingKeyFromMnemonic<T extends SigningKey, C extends FromSeedConstructor<T>>(ctor: C, mnemonic: string, password?: string): T {
  if (!Bip39.validateMnemonic(mnemonic)) {
    throw new InvalidMnemonicError(mnemonic);
  }
  const seed = Bip39.mnemonicToSeedSync(mnemonic, password);
  if (seed.length < minSeedSize || seed.length > maxSeedSize) {
    throw new InvalidSeedLengthError(seed.length);
  }
  return ctor.fromSeed(seed);
}

export const DefaultPath = "44'/1729'/0'/0'";

export interface FromMnemonicParams {
  mnemonic: string;
  password?: string;
  derivationPath?: string | Path;
}

/**
 * @description constructs a signing key from BIP-39 mnemonic and returns its derivative (a child key)
 */
export function deriveSigningKeyFromMnemonic<T extends ParentSigningKey, C extends FromSeedConstructor<T>>(ctor: C, { mnemonic, password, derivationPath = DefaultPath }: FromMnemonicParams): T {
  const parent = signingKeyFromMnemonic<T, C>(ctor, mnemonic, password);
  return derivePath<T>(parent, derivationPath);
}
