/**
 * @packageDocumentation
 * @module @taquito/remote-signer
 */
import { HttpBackend, HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import {
  b58cdecode,
  b58cencode,
  buf2hex,
  hex2buf,
  isValidPrefix,
  mergebuf,
  prefix,
} from '@taquito/utils';
import sodium from 'libsodium-wrappers';
import elliptic from 'elliptic';
import toBuffer from 'typedarray-to-buffer';
import { BadSigningDataError, KeyNotFoundError, OperationNotAuthorizedError } from './errors';
import { Signer } from '@taquito/taquito';
interface PublicKeyResponse {
  public_key: string;
}

interface SignResponse {
  signature: string;
}

type curves = 'ed' | 'p2' | 'sp';

export interface RemoteSignerOptions {
  headers?: { [key: string]: string };
}

export { VERSION } from './version';

const pref = {
  ed: {
    pk: prefix['edpk'],
    sk: prefix['edsk'],
    pkh: prefix.tz1,
    sig: prefix.edsig,
  },
  p2: {
    pk: prefix['p2pk'],
    sk: prefix['p2sk'],
    pkh: prefix.tz3,
    sig: prefix.p2sig,
  },
  sp: {
    pk: prefix['sppk'],
    sk: prefix['spsk'],
    pkh: prefix.tz2,
    sig: prefix.spsig,
  },
};

export class RemoteSigner implements Signer {
  constructor(
    private pkh: string,
    private rootUrl: string,
    private options: RemoteSignerOptions = {},
    private http = new HttpBackend()
  ) {}

  async publicKeyHash(): Promise<string> {
    return this.pkh;
  }

  private createURL(path: string) {
    // Trim trailing slashes because it is assumed to be included in path
    return `${this.rootUrl.replace(/\/+$/g, '')}${path}`;
  }

  async publicKey(): Promise<string> {
    try {
      const { public_key } = await this.http.createRequest<PublicKeyResponse>({
        url: this.createURL(`/keys/${this.pkh}`),
        method: 'GET',
        headers: this.options.headers,
      });
      return public_key;
    } catch (ex) {
      if (ex instanceof HttpResponseError) {
        if (ex.status === STATUS_CODE.NOT_FOUND) {
          throw new KeyNotFoundError(`Key not found: ${this.pkh}`, ex);
        }
      }
      throw ex;
    }
  }

  async secretKey(): Promise<string> {
    throw new Error('Secret key cannot be exposed');
  }

  async sign(bytes: string, watermark?: Uint8Array) {
    try {
      let bb = hex2buf(bytes);
      if (typeof watermark !== 'undefined') {
        bb = mergebuf(watermark, bb);
      }
      const watermarkedBytes = buf2hex(toBuffer(bb));
      const { signature } = await this.http.createRequest<SignResponse>(
        {
          url: this.createURL(`/keys/${this.pkh}`),
          method: 'POST',
          headers: this.options.headers,
        },
        watermarkedBytes
      );
      let pref = signature.startsWith('sig')
        ? signature.substring(0, 3)
        : signature.substring(0, 5);

      if (!isValidPrefix(pref)) {
        throw new Error(`Unsupported signature given by remote signer: ${signature}`);
      }

      const decoded = b58cdecode(signature, prefix[pref]);

      const signatureVerified = await this.verify(watermarkedBytes, signature);
      if (!signatureVerified) {
        throw new Error(
          `Signature failed verification against public key:
          {
            bytes: ${watermarkedBytes},
            signature: ${signature}
          }`
        );
      }

      return {
        bytes,
        sig: b58cencode(decoded, prefix.sig),
        prefixSig: signature,
        sbytes: bytes + buf2hex(toBuffer(decoded)),
      };
    } catch (ex) {
      if (ex instanceof HttpResponseError) {
        if (ex.status === STATUS_CODE.NOT_FOUND) {
          throw new KeyNotFoundError(`Key not found: ${this.pkh}`, ex);
        } else if (ex.status === STATUS_CODE.FORBIDDEN) {
          throw new OperationNotAuthorizedError('Signing Operation not authorized', ex);
        } else if (ex.status === STATUS_CODE.BAD_REQUEST) {
          throw new BadSigningDataError('Invalid data', ex, {
            bytes,
            watermark,
          });
        }
      }
      throw ex;
    }
  }

  async verify(bytes: string, signature: string): Promise<boolean> {
    await sodium.ready;
    const publicKey = await this.publicKey();
    const curve = publicKey.substring(0, 2) as curves;
    const _publicKey = toBuffer(b58cdecode(publicKey, pref[curve].pk));

    let signaturePrefix = signature.startsWith('sig')
      ? signature.substr(0, 3)
      : signature.substr(0, 5);

    if (!isValidPrefix(signaturePrefix)) {
      throw new Error(`Unsupported signature given by remote signer: ${signature}`);
    }

    const publicKeyHash = b58cencode(sodium.crypto_generichash(20, _publicKey), pref[curve].pkh);
    if (publicKeyHash !== this.pkh) {
      throw new Error(
        `Requested public key does not match the initialized public key hash: {
          publicKey: ${publicKey},
          publicKeyHash: ${this.pkh}
        }`
      );
    }

    let sig;
    if (signature.substring(0, 3) === 'sig') {
      sig = b58cdecode(signature, prefix.sig);
    } else if (signature.substring(0, 5) === `${curve}sig`) {
      sig = b58cdecode(signature, pref[curve].sig);
    } else {
      throw new Error(`Invalid signature provided: ${signature}`);
    }

    const bytesHash = sodium.crypto_generichash(32, hex2buf(bytes));

    if (curve === 'ed') {
      try {
        return sodium.crypto_sign_verify_detached(sig, bytesHash, _publicKey);
      } catch (e) {
        return false;
      }
    }

    if (curve === 'sp') {
      const key = new elliptic.ec('secp256k1').keyFromPublic(_publicKey);
      const hexSig = buf2hex(toBuffer(sig));
      const match = hexSig.match(/([a-f\d]{64})/gi);
      if (match) {
        try {
          const [r, s] = match;
          return key.verify(bytesHash, { r, s });
        } catch (e) {
          return false;
        }
      }
      return false;
    }

    if (curve === 'p2') {
      const key = new elliptic.ec('p256').keyFromPublic(_publicKey);
      const hexSig = buf2hex(toBuffer(sig));
      const match = hexSig.match(/([a-f\d]{64})/gi);
      if (match) {
        try {
          const [r, s] = match;
          return key.verify(bytesHash, { r, s });
        } catch (e) {
          return false;
        }
      }
      return false;
    }

    throw new Error(`Curve '${curve}' not supported`);
  }
}
