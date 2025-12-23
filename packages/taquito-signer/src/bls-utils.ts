import { HKDF } from '@stablelib/hkdf';
import { SHA256, hash as sha256 } from '@stablelib/sha256';

function ikmToLamportSK(ikm: Uint8Array, salt: Uint8Array): Uint8Array[] {
  const prk = new HKDF(SHA256, ikm, salt);
  const okm = prk.expand(255 * 32);
  const out = [];
  for (let off = 0; off < okm.length; off += 32) {
    out.push(okm.slice(off, off + 32));
  }
  return out;
}

function uint32BE(n: number): Uint8Array {
  const b = new ArrayBuffer(4);
  const v = new DataView(b);
  v.setUint32(0, n, false);
  return new Uint8Array(b);
}

export function parentSKToLamportPK(parentSK: Uint8Array, index: number): { lamport0: Uint8Array[], lamport1: Uint8Array[], compressed: Uint8Array } {
  const salt = uint32BE(index);
  const lamport0 = ikmToLamportSK(parentSK, salt)
  const notIKM = new Uint8Array(parentSK.map(x => ~x));
  const lamport1 = ikmToLamportSK(notIKM, salt);
  const out = new SHA256();
  for (const x of lamport0) {
    out.update(sha256(x));
  }
  for (const x of lamport1) {
    out.update(sha256(x));
  }
  return { lamport0, lamport1, compressed: out.digest() };
}

export function arrayToBigInt(src: Uint8Array): bigint {
  let out = BigInt(0);
  for (const x of src) {
    out = (out << BigInt(8)) | BigInt(x);
  }
  return out;
}

export function bigIntToArray(n: bigint): Uint8Array {
  const out = [];
  while (n !== BigInt(0)) {
    out.push(Number(BigInt.asUintN(8, n)));
    n = n >> BigInt(8);
  }
  if (out.length === 0) {
    out.push(0);
  }
  return new Uint8Array(out.reverse());
}

export function hkdfModR(ikm: Uint8Array, info: Uint8Array = new Uint8Array(0)): Uint8Array {
  const r = BigInt("52435875175126190479447740508185965837690552500527637822603658699938581184513");
  let salt = new TextEncoder().encode("BLS-SIG-KEYGEN-SALT-");
  for (; ;) {
    salt = new Uint8Array(sha256(salt));
    const t1 = new Uint8Array(ikm.length + 1);
    t1.set(ikm, 0);
    const t2 = new Uint8Array(info.length + 2);
    t2.set(info, 0);
    t2[t2.length - 1] = 48;
    const prk = new HKDF(SHA256, t1, salt, t2);
    const okm = prk.expand(48);
    const sk = arrayToBigInt(okm) % r;
    if (sk !== BigInt(0)) {
      return bigIntToArray(sk);
    }
  }
}

export function deriveChildSK(parentSK: Uint8Array, index: number): Uint8Array {
  const { compressed } = parentSKToLamportPK(parentSK, index);
  return hkdfModR(compressed);
}