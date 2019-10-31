import { b58cdecode, b58cencode, buf2hex, prefix, hex2buf, mergebuf } from '@taquito/utils';
import { HttpBackend, STATUS_CODE, HttpResponseError } from '@taquito/http-utils';
import toBuffer from 'typedarray-to-buffer';
import { KeyNotFoundError, OperationNotAuthorizedError, BadSigningDataError } from './errors';

interface PublicKeyResponse {
  public_key: string;
}

interface SignResponse {
  signature: string;
}

export class RemoteSigner {
  constructor(private pkh: string, private rootUrl: string, private http = new HttpBackend()) {}

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
      const { signature } = await this.http.createRequest<SignResponse>(
        { url: this.createURL(`/keys/${this.pkh}`), method: 'POST' },
        buf2hex(toBuffer(bb))
      );
      let pref = signature.startsWith('sig') ? signature.substr(0, 3) : signature.substr(0, 5);

      const decoded = b58cdecode(signature, prefix[pref]);

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
}
