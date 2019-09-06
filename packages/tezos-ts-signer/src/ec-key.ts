import sodium from 'libsodium-wrappers';
import { b58cencode, b58cdecode, prefix, buf2hex } from '@tezos-ts/utils';
import toBuffer from 'typedarray-to-buffer';
import elliptic from 'elliptic';

const pref = {
  p256: {
    pk: prefix['p2pk'],
    sk: prefix['p2sk'],
    pkh: prefix.tz3,
    sig: prefix.p2sig,
  },
  secp256k1: {
    pk: prefix['sppk'],
    sk: prefix['spsk'],
    pkh: prefix.tz2,
    sig: prefix.spsig,
  },
};

/**
 * @description Provide signing logic for elliptic curve based key (tz2, tz3)
 */
export class ECKey {
  private _key: Uint8Array;
  private _publicKey: Uint8Array;

  /**
   *
   * @param curve Curve to use with the key
   * @param key Encoded private key
   * @param encrypted Is the private key encrypted
   * @param decrypt Decrypt function
   */
  constructor(
    private curve: 'p256' | 'secp256k1',
    private key: string,
    encrypted: boolean,
    decrypt: (k: any) => any
  ) {
    this._key = decrypt(b58cdecode(this.key, prefix[key.substr(0, encrypted ? 5 : 4)]));
    const keyPair = new elliptic.ec(this.curve).keyFromPrivate(this._key);
    const pref =
      keyPair
        .getPublic()
        .getY()
        .toArray()[31] % 2
        ? 3
        : 2;
    this._publicKey = toBuffer(
      new Uint8Array(
        [pref].concat(
          keyPair
            .getPublic()
            .getX()
            .toArray()
        )
      )
    );
  }

  /**
   *
   * @param bytes Bytes to sign
   * @param bytesHash Blake2b hash of the bytes to sign
   */
  async sign(bytes: string, bytesHash: Uint8Array) {
    const key = new elliptic.ec(this.curve).keyFromPrivate(this._key);
    const sig = key.sign(bytesHash, { canonical: true });
    const signature = new Uint8Array(sig.r.toArray().concat(sig.s.toArray()));
    const signatureBuffer = toBuffer(signature);
    const sbytes = bytes + buf2hex(signatureBuffer);

    return {
      bytes,
      sig: b58cencode(signature, prefix.sig),
      prefixSig: b58cencode(signature, pref[this.curve].sig),
      sbytes,
    };
  }

  /**
   * @returns Encoded public key
   */
  async publicKey(): Promise<string> {
    return b58cencode(this._publicKey, pref[this.curve].pk);
  }

  /**
   * @returns Encoded public key hash
   */
  async publicKeyHash(): Promise<string> {
    await sodium.ready;
    return b58cencode(
      sodium.crypto_generichash(20, new Uint8Array(this._publicKey)),
      pref[this.curve].pkh
    );
  }

  /**
   * @returns Encoded private key
   */
  async secretKey(): Promise<string> {
    let key = this._key;

    return b58cencode(key, pref[this.curve].sk);
  }
}

/**
 * @description Tz3 key class using the p256 curve
 */
export const Tz3 = ECKey.bind(null, 'p256');

/**
 * @description Tz3 key class using the secp256k1 curve
 */
export const Tz2 = ECKey.bind(null, 'secp256k1');
