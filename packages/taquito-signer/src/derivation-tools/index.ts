import { InvalidDerivationPathError } from '@taquito/core';

export * as ECDSA from './ecdsa';
export * as Ed25519 from './ed25519';

export const Hard = 0x80000000;

export interface ExtendedKey {
  readonly chainCode: Uint8Array;
  derive(index: number): ExtendedKey;
  derivePath(path: Iterable<number>): ExtendedKey;
}

export interface ExtendedPrivateKey extends ExtendedKey {
  derive(index: number): ExtendedPrivateKey;
  derivePath(path: number[]): ExtendedPrivateKey;
}

export class Path extends Array<number> {
  static from(iterable: Iterable<number> | ArrayLike<number>): Path {
    return super.from(iterable).map((x) => x >>> 0);
  }
  /**
   *
   * @param s derivation path eg: 44'/1729'/0'/0'
   * @returns applied hardened values
   */
  static fromString(s: string): Path {
    if (s.length === 0) {
      return new Path();
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
      const index = (parseInt(p, 10) | h) >>> 0;
      out.push(index);
    }
    return Path.from(out);
  }
}
