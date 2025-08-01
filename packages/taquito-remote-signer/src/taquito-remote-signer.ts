/**
 * @packageDocumentation
 * @module @taquito/remote-signer
 */
import { HttpBackend, HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import {
  buf2hex,
  hex2buf,
  mergebuf,
  verifySignature,
  validateKeyHash,
  ValidationResult,
  Prefix,
  b58DecodeAndCheckPrefix,
  getPkhfromPk,
  b58Encode,
} from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';
import {
  BadSigningDataError,
  OperationNotAuthorizedError,
  PublicKeyVerificationError,
  SignatureVerificationError,
} from './errors';
import { Signer } from '@taquito/taquito';
import {
  InvalidSignatureError,
  InvalidKeyHashError,
  ProhibitedActionError,
  PublicKeyNotFoundError,
  ParameterValidationError,
} from '@taquito/core';

interface PublicKeyResponse {
  public_key: string;
}

interface SignResponse {
  signature: string;
}


export interface RemoteSignerOptions {
  headers?: { [key: string]: string };
}

export { VERSION } from './version';

export class RemoteSigner implements Signer {
  constructor(
    private pkh: string,
    private rootUrl: string,
    private options: RemoteSignerOptions = {},
    private http = new HttpBackend()
  ) {
    const pkhValidation = validateKeyHash(this.pkh);
    if (pkhValidation !== ValidationResult.VALID) {
      throw new InvalidKeyHashError(this.pkh, pkhValidation);
    }
  }

  async publicKeyHash(): Promise<string> {
    return this.pkh;
  }

  private createURL(path: string) {
    // Trim trailing slashes because it is assumed to be included in path
    // the regex solution is prone to ReDoS. Please see: https://stackoverflow.com/questions/6680825/return-string-without-trailing-slash#comment124306698_6680877
    // We also got a CodeQL error for the regex based solution
    let rootUrl = this.rootUrl;
    while (rootUrl.endsWith('/')) {
      rootUrl = rootUrl.slice(0, -1);
    }
    return `${rootUrl}${path}`;
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
          throw new PublicKeyNotFoundError(this.pkh, ex);
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

      const [decoded] = (() => {
        try {
          return b58DecodeAndCheckPrefix(signature, [Prefix.GenericSignature, Prefix.Secp256k1Signature, Prefix.Ed25519Signature, Prefix.P256Signature]);
        } catch (err: unknown) {
          if (err instanceof ParameterValidationError) {
            throw new InvalidSignatureError(signature, err.result);
          } else {
            throw err;
          }
        }
      })();

      const pk = await this.publicKey();
      await this.verifyPublicKey(pk);
      const signatureVerified = verifySignature(watermarkedBytes, pk, signature);
      if (!signatureVerified) {
        throw new SignatureVerificationError(watermarkedBytes, signature);
      }

      return {
        bytes,
        sig: b58Encode(decoded, Prefix.GenericSignature),
        prefixSig: signature,
        sbytes: bytes + buf2hex(toBuffer(decoded)),
      };
    } catch (ex) {
      if (ex instanceof HttpResponseError) {
        if (ex.status === STATUS_CODE.NOT_FOUND) {
          throw new PublicKeyNotFoundError(this.pkh, ex);
        } else if (ex.status === STATUS_CODE.FORBIDDEN) {
          throw new OperationNotAuthorizedError('Signing Operation not authorized', ex);
        } else if (ex.status === STATUS_CODE.BAD_REQUEST) {
          throw new BadSigningDataError(ex, bytes, watermark);
        }
      }
      throw ex;
    }
  }

  async verifyPublicKey(publicKey: string) {
    const pkh = getPkhfromPk(publicKey);
    if (this.pkh !== pkh) {
      throw new PublicKeyVerificationError(publicKey, pkh, this.pkh);
    }
  }
}
