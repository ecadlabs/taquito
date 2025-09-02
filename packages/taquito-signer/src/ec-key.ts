import { hash as blake2b } from '@stablelib/blake2b';
import {
  PrefixV2,
  b58DecodeAndCheckPrefix,
  b58Encode,
  compareArrays,
  InvalidPublicKeyError,
} from '@taquito/utils';
import elliptic from 'elliptic';
import { SigningKey, PublicKey } from './key-interface';
import { RawSignResult } from '@taquito/taquito';
import KeyPair from 'elliptic/lib/elliptic/ec/key';
import { InvalidCurveError } from './errors';

type Curve = 'p256' | 'secp256k1';

type CurvePrefix = {
  [curve in Curve]: {
    pk: PrefixV2;
    sk: PrefixV2;
    pkh: PrefixV2;
    sig: PrefixV2;
    tag: number;
  };
};

const pref: CurvePrefix = {
  p256: {
    pk: PrefixV2.P256PublicKey,
    sk: PrefixV2.P256SecretKey,
    pkh: PrefixV2.P256PublicKeyHash,
    sig: PrefixV2.P256Signature,
    tag: 2,
  },
  secp256k1: {
    pk: PrefixV2.Secp256k1PublicKey,
    sk: PrefixV2.Secp256k1SecretKey,
    pkh: PrefixV2.Secp256k1PublicKeyHash,
    sig: PrefixV2.Secp256k1Signature,
    tag: 1,
  },
};

class ECKeyBase {
  constructor(public readonly keyPair: elliptic.ec.KeyPair) {}

  curve(): Curve {
    switch (this.keyPair.ec.curve) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      case (elliptic.curves as any).secp256k1.curve:
        return 'secp256k1';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      case (elliptic.curves as any).p256.curve:
        return 'p256';
      default:
        throw new InvalidCurveError('unknown curve');
    }
  }
}

/**
 * @description Provide signing logic for elliptic curve based key (tz2, tz3)
 */
export class ECKey extends ECKeyBase implements SigningKey {
  /**
   *
   * @param key Encoded private key
   * @param decrypt Decrypt function
   * @throws {@link InvalidKeyError}
   */
  constructor(key: string, decrypt?: (k: Uint8Array) => Uint8Array) {
    const [keyData, prefix] = b58DecodeAndCheckPrefix(key, [
      PrefixV2.Secp256k1EncryptedSecretKey,
      PrefixV2.P256EncryptedSecretKey,
      PrefixV2.Secp256k1SecretKey,
      PrefixV2.P256SecretKey,
    ]);
    const [decKey, curve] = ((): [Uint8Array, Curve] => {
      switch (prefix) {
        case PrefixV2.Secp256k1EncryptedSecretKey:
        case PrefixV2.P256EncryptedSecretKey:
          if (decrypt === undefined) {
            throw new Error('decryption function is not provided');
          } else {
            return [
              decrypt(keyData),
              prefix === PrefixV2.Secp256k1EncryptedSecretKey ? 'secp256k1' : 'p256',
            ];
          }
        case PrefixV2.Secp256k1SecretKey:
          return [keyData, 'secp256k1'];
        default:
          return [keyData, 'p256'];
      }
    })();

    super(new elliptic.ec(curve).keyFromPrivate(decKey));
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param bytesHash Blake2b hash of the bytes to sign
   */
  sign(bytes: Uint8Array): RawSignResult {
    const hash = blake2b(bytes, 32);
    const sig = this.keyPair.sign(hash, { canonical: true });

    const signature = new Uint8Array(64);
    const r = sig.r.toArray();
    const s = sig.s.toArray();
    signature.set(r, 32 - r.length);
    signature.set(s, 64 - s.length);

    return {
      rawSignature: signature,
      sig: b58Encode(signature, PrefixV2.GenericSignature),
      prefixSig: b58Encode(signature, pref[this.curve()].sig),
    };
  }

  /**
   * @returns Encoded public key
   */
  publicKey(): PublicKey {
    return new ECPublicKey(this.keyPair.ec.keyFromPublic(this.keyPair));
  }

  /**
   * @returns Encoded private key
   */
  secretKey(): string {
    return b58Encode(new Uint8Array(this.keyPair.getPrivate().toArray()), pref[this.curve()].sk);
  }
}

function isKeyPair(src: unknown): src is elliptic.ec.KeyPair {
  return src instanceof KeyPair;
}

export class ECPublicKey extends ECKeyBase implements PublicKey {
  constructor(src: string);
  constructor(src: elliptic.ec.KeyPair);
  constructor(src: Uint8Array, curve: Curve);
  constructor(src: string | Uint8Array | elliptic.ec.KeyPair, curve?: Curve) {
    const key = (() => {
      if (isKeyPair(src)) {
        return src;
      } else {
        const [key, crv] = ((): [Uint8Array, Curve] => {
          if (typeof src === 'string') {
            const [key, pre] = b58DecodeAndCheckPrefix(src, [
              PrefixV2.Secp256k1PublicKey,
              PrefixV2.P256PublicKey,
            ]);
            return [key, pre === PrefixV2.Secp256k1PublicKey ? 'secp256k1' : 'p256'];
          } else if (curve !== undefined) {
            return [src, curve];
          } else {
            throw new InvalidCurveError('missing curve type');
          }
        })();
        return new elliptic.ec(crv).keyFromPublic(key);
      }
    })();
    super(key);
  }

  compare(other: PublicKey): number {
    if (other instanceof ECPublicKey) {
      if (this.curve() === other.curve()) {
        const compress = this.curve() === 'secp256k1';
        return compareArrays(this.bytes(compress), other.bytes(compress));
      } else if (this.curve() === 'secp256k1') {
        return -1;
      } else {
        return 1;
      }
    } else {
      throw new InvalidPublicKeyError('ECDSA key expected');
    }
  }

  hash(): string {
    const key = this.bytes();
    return b58Encode(blake2b(key, 20), pref[this.curve()].pkh);
  }

  bytes(compress: boolean = true): Uint8Array {
    return new Uint8Array(this.keyPair.getPublic(compress, 'array'));
  }

  toProtocol(): Uint8Array {
    const key = this.bytes();
    const res = new Uint8Array(key.length + 1);
    res[0] = pref[this.curve()].tag;
    res.set(key, 1);
    return res;
  }

  toString(): string {
    const key = this.bytes();
    return b58Encode(key, pref[this.curve()].pk);
  }
}
