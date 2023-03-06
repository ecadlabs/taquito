import { hash } from '@stablelib/blake2b';
import {
  b58cencode,
  b58cdecode,
  prefix,
  isValidPrefix,
  InvalidKeyError,
  buf2hex,
} from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';
import { MinPk } from 'es-blst';

export class Tz4 {
  private _key: Uint8Array;
  private _publicKey: Uint8Array;

  constructor(private key: string, encrypted: boolean, decrypt: (k: any) => any) {
    const keyPrefix = key.substr(0, encrypted ? 5 : 4);
    if (!isValidPrefix(keyPrefix)) {
      throw new InvalidKeyError(key, 'Key contains invalid prefix');
    }

    this._key = decrypt(b58cdecode(this.key, prefix[keyPrefix]));
    console.log('_key: ', this._key);
    const sk = MinPk.PrivateKey.fromBytes(this._key);
    console.log('sk: ', sk);
    this._publicKey = sk.public().bytes();
  }

  async sign(bytes: string, bytesHash: Uint8Array) {
    const sk = MinPk.PrivateKey.fromBytes(this._key);
    const signature = sk.sign(bytesHash, 'aug');

    const signatureBuffer = toBuffer(signature);
    const sbytes = bytes + buf2hex(signatureBuffer);

    return {
      bytes,
      sig: b58cencode(signature.bytes(), prefix.sig),
      prefixSig: b58cencode(signature.bytes(), prefix.BLSig),
      sbytes,
    };
  }

  async publicKey(): Promise<string> {
    return b58cencode(this._publicKey, prefix['BLpk']);
  }

  async publicKeyHash(): Promise<string> {
    return b58cencode(hash(this._publicKey, 20), prefix.tz4);
  }

  async secretKey(): Promise<string> {
    return b58cencode(this._key, prefix['BLsk']);
  }
}
