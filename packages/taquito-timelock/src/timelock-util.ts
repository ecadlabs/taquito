import bigInt, { BigInteger } from 'big-integer';
import { hash } from '@stablelib/blake2b';
import * as crypto from 'crypto';
import { TimelockInit, RNG } from './interface';

const defaultRNG: RNG = crypto;

export const RSA_MODULUS = bigInt(
  '25195908475657893494027183240048398571429282126204032027777137836043662020707595556264018525880784406918290641249515082189298559149176184502808489120072844992687392807287776735971418347270261896375014971824691165077613379859095700097330459748808428401797429100642458691817195118746121515172654632282216869987549182422433637259085141865462043576798423387184774447920739934236584823824281198163815010674810451660377306056201619676256133844143603833904414952634432190114657544454178424020924616515723350778707749817125772467962926386356373289912154831438167899885040445364023527381951378636564391212010397122822120720357'
);

function rand(rng: RNG = defaultRNG): number {
  const bytes = new Uint8Array(4);
  rng.getRandomValues(bytes);
  const x = ((bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | bytes[3]) >>> 0;
  return x / Math.pow(2, 32);
}

function randomInteger(rng: RNG, bits: number): BigInteger {
  const bytes = new Uint8Array(bits / 8);
  rng.getRandomValues(bytes);
  return bigInt.fromArray(Array.from(bytes), 256);
}

function nextPrime(n: BigInteger): BigInteger {
  if (n.compare(2) < 0) {
    return bigInt(2);
  }
  const limit = n.multiply(2);
  for (let p = n.next(); p.compare(limit) < 0; p = p.next()) {
    // use 25 bases like in GMP mpz_nextprime and thus in Tezos
    if (p.isProbablePrime(25, rand)) {
      return p;
    }
  }
  throw new Error('!!!nextPrime!!!'); // shouldn't happen
}

function generate(rng: RNG, mod: BigInteger): BigInteger {
  const m = mod.subtract(bigInt(2));
  return randomInteger(rng, mod.bitLength().toJSNumber()).mod(m).add(bigInt(2));
}

function toLE(x: BigInteger): number[] {
  return x.toArray(256).value.reverse();
}

function fromLE(x: number[]): BigInteger {
  return bigInt.fromArray(x.reverse(), 256);
}

const HASH_SEPARATOR = [0xff, 0x00, 0xff, 0x00, 0xff, 0x00, 0xff, 0x00];

function hashToPrime(
  time: number,
  value: BigInteger,
  key: BigInteger,
  mod: BigInteger
): BigInteger {
  const b: number[] = [
    ...new TextEncoder().encode(String(time)),
    ...HASH_SEPARATOR,
    ...toLE(mod),
    ...HASH_SEPARATOR,
    ...toLE(value),
    ...HASH_SEPARATOR,
    ...toLE(key),
  ];

  const sum = hash(new Uint8Array(b), 32, { key: new Uint8Array([32]) });
  const val = fromLE(Array.from(sum));
  return nextPrime(val);
}

function proveWesolowski(
  time: number,
  locked: BigInteger,
  unlocked: BigInteger,
  mod: BigInteger
): BigInteger {
  const l = hashToPrime(time, locked, unlocked, mod);
  let pi = bigInt(1);
  let r = bigInt(1);
  for (; time > 0; time -= 1) {
    const rr = r.multiply(2);
    r = rr.mod(l);
    const pi2 = pi.multiply(pi).mod(mod);
    if (rr.compare(l) >= 0) {
      pi = pi2.multiply(locked);
    } else {
      pi = pi2;
    }
  }
  return pi.mod(mod);
}

export function prove(
  time: number,
  locked: BigInteger,
  unlocked: BigInteger,
  mod: BigInteger = RSA_MODULUS
): TimelockProof {
  return new TimelockProof({
    vdfTuple: new Timelock({
      lockedValue: locked,
      unlockedValue: unlocked,
      vdfProof: proveWesolowski(time, locked, unlocked, mod),
      modulus: mod,
    }),
    nonce: bigInt(1),
  });
}

function unlockTimelock(time: number, locked: BigInteger, mod: BigInteger): BigInteger {
  if (locked.compare(bigInt(1)) <= 0) {
    return locked;
  }
  let x = locked;
  for (; time > 0; time -= 1) {
    x = x.multiply(x).mod(mod);
  }
  return x;
}

export function unlockAndProve(
  time: number,
  locked: BigInteger,
  mod: BigInteger = RSA_MODULUS
): TimelockProof {
  const unlocked = unlockTimelock(time, locked, mod);
  return prove(time, locked, unlocked, mod);
}

function verifyWesolowski(vdfTuple: Timelock, time: number): boolean {
  const l = hashToPrime(time, vdfTuple.lockedValue, vdfTuple.unlockedValue, vdfTuple.modulus);
  const ll = vdfTuple.vdfProof.modPow(l, vdfTuple.modulus);
  const r = bigInt(2).modPow(time, l);
  const rr = vdfTuple.lockedValue.modPow(r, vdfTuple.modulus);
  const unlocked = ll.multiply(rr).mod(vdfTuple.modulus);
  return unlocked.compare(vdfTuple.unlockedValue) === 0;
}

export function verify(locked: BigInteger, proof: TimelockProof, time: number): boolean {
  const randomizedChallenge = proof.vdfTuple.lockedValue.modPow(
    proof.nonce,
    proof.vdfTuple.modulus
  );
  return randomizedChallenge.compare(locked) === 0 && verifyWesolowski(proof.vdfTuple, time);
}

export class Timelock {
  lockedValue: BigInteger;
  unlockedValue: BigInteger;
  vdfProof: BigInteger;
  modulus: BigInteger;

  constructor({ lockedValue, unlockedValue, vdfProof, modulus }: TimelockInit) {
    this.lockedValue = lockedValue;
    this.unlockedValue = unlockedValue;
    this.vdfProof = vdfProof;
    this.modulus = modulus ?? RSA_MODULUS;
  }

  static precompute(time: number, mod: BigInteger = RSA_MODULUS, rng: RNG = defaultRNG): Timelock {
    const locked = generate(rng, mod);
    const unlocked = unlockTimelock(time, locked, mod);
    return new Timelock({
      lockedValue: locked,
      unlockedValue: unlocked,
      vdfProof: proveWesolowski(time, locked, unlocked, mod),
      modulus: mod,
    });
  }

  getProof(time: number, rng: RNG = defaultRNG): { lockedValue: BigInteger; proof: TimelockProof } {
    if (
      this.lockedValue.compare(bigInt(1)) < 1 ||
      this.unlockedValue.compare(bigInt(0)) < 1 ||
      this.vdfProof.compare(bigInt(0)) < 1 ||
      this.lockedValue.compare(this.modulus) > 0 ||
      this.unlockedValue.compare(this.modulus) > 0 ||
      this.vdfProof.compare(this.modulus) >= 0
    ) {
      throw new Error('Invalid argument');
    }
    if (!verifyWesolowski(this, time)) {
      throw new Error('Verification error');
    }
    const nonce = randomInteger(rng, 16 * 8);
    const lockedValue = this.lockedValue.modPow(nonce, this.modulus);
    return {
      lockedValue,
      proof: new TimelockProof({
        vdfTuple: this,
        nonce,
      }),
    };
  }

  encode(): Uint8Array {
    return new Uint8Array([
      ...encodeBigInt(this.lockedValue),
      ...encodeBigInt(this.unlockedValue),
      ...encodeBigInt(this.vdfProof),
    ]);
  }

  static fromArray(buf: Uint8Array, mod: BigInteger = RSA_MODULUS): [Timelock, number] {
    let i = 0;
    const [lockedValue, n1] = decodeBigInt(buf);
    i += n1;
    const [unlockedValue, n2] = decodeBigInt(buf.slice(i));
    i += n2;
    const [vdfProof, n3] = decodeBigInt(buf.slice(i));
    i += n3;
    return [
      new Timelock({
        lockedValue,
        unlockedValue,
        vdfProof,
        modulus: mod,
      }),
      i,
    ];
  }
}

const KDF_KEY = new TextEncoder().encode('Tezoskdftimelockv1');

export class TimelockProof {
  vdfTuple: Timelock;
  nonce: BigInteger;

  constructor({ vdfTuple, nonce }: { vdfTuple: Timelock; nonce: BigInteger }) {
    this.vdfTuple = vdfTuple;
    this.nonce = nonce;
  }

  symmetricKey(): Uint8Array {
    const updated = this.vdfTuple.unlockedValue.modPow(this.nonce, this.vdfTuple.modulus);
    return hash(new TextEncoder().encode(String(updated)), 32, { key: KDF_KEY });
  }

  encode(): Uint8Array {
    return new Uint8Array([...this.vdfTuple.encode(), ...encodeBigInt(this.nonce)]);
  }

  static fromArray(buf: Uint8Array, mod: BigInteger = RSA_MODULUS): [TimelockProof, number] {
    let i = 0;
    const [vdfTuple, n1] = Timelock.fromArray(buf, mod);
    i += n1;
    const [nonce, n2] = decodeBigInt(buf.slice(i));
    i += n2;
    return [new TimelockProof({ vdfTuple, nonce }), i];
  }
}

export function encodeBigInt(v: BigInteger): number[] {
  if (v.isNegative()) {
    throw new Error('Negative value');
  }
  const res: number[] = [];
  for (let i = 0; ; i++) {
    const x = v.and(bigInt(0x7f)).toJSNumber();
    v = v.shiftRight(7);
    if (!v.isZero()) {
      res.push(x | 0x80);
    } else {
      res.push(x);
      break;
    }
  }
  return res;
}

export function decodeBigInt(buf: ArrayLike<number>): [BigInteger, number] {
  let shift = 0;
  let i = 0;
  let res = bigInt(0);
  while (i < buf.length) {
    const x = buf[i];
    res = res.add(bigInt(x & 0x7f).shiftLeft(shift));
    shift += 7;
    i++;
    if ((x & 0x80) === 0) break;
  }
  return [res, i];
}
