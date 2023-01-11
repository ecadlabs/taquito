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
  verifySignature,
  validateKeyHash,
  ValidationResult,
  ProhibitedActionError,
  InvalidSignatureError,
} from '@taquito/utils';
import { InvalidKeyHashError } from '@taquito/core';
import { hash } from '@stablelib/blake2b';
import toBuffer from 'typedarray-to-buffer';
import {
  BadSigningDataError,
  KeyNotFoundError,
  OperationNotAuthorizedError,
  PublicKeyMismatch,
} from './errors';
import { Signer } from '@taquito/taquito';

/**
 *  @category Error
 *  @description Error
 */
export class SignatureVerificationFailedError extends Error {
  public name = 'SignatureVerificationFailedError';
  constructor(public bytes: string, public signature: string) {
    super(
      `
        Signature failed verification against public key: 
        {
          bytes: ${bytes},
          signature: ${signature}
        }
      `
    );
  }
}

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
  ) {
    if (validateKeyHash(this.pkh) !== ValidationResult.VALID) {
      throw new InvalidKeyHashError(this.pkh);
    }
  }

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
    throw new ProhibitedActionError('Secret key cannot be exposed');
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
      const pref = signature.startsWith('sig')
        ? signature.substring(0, 3)
        : signature.substring(0, 5);

      if (!isValidPrefix(pref)) {
        throw new InvalidSignatureError(signature, 'Unsupported signature given by remote signer');
      }

      const decoded = b58cdecode(signature, prefix[pref]);

      const pk = await this.publicKey();
      await this.verifyPublicKey(pk);
      const signatureVerified = verifySignature(watermarkedBytes, pk, signature);
      if (!signatureVerified) {
        throw new SignatureVerificationFailedError(watermarkedBytes, signature);
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

  async verifyPublicKey(publicKey: string) {
    const curve = publicKey.substring(0, 2) as curves;
    const _publicKey = b58cdecode(publicKey, pref[curve].pk);

    const publicKeyHash = b58cencode(hash(_publicKey, 20), pref[curve].pkh);
    if (publicKeyHash !== this.pkh) {
      throw new PublicKeyMismatch(publicKeyHash, this.pkh);
    }
  }
}
