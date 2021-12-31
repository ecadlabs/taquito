/**
 * @packageDocumentation
 * @module @taquito/tezbridge-signer
 */
import { b58cdecode, b58cencode, buf2hex, prefix, isValidPrefix } from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';

declare var tezbridge: any;

export { VERSION } from './version';
export class TezBridgeSigner {
  constructor() {
    if (typeof tezbridge === 'undefined') {
      throw new Error('tezbridge plugin could not be detected in your browser');
    }
  }

  async publicKeyHash(): Promise<string> {
    return tezbridge.request({ method: 'get_source' });
  }

  async publicKey(): Promise<string> {
    throw new Error('Public key cannot be exposed');
  }

  async secretKey(): Promise<string> {
    throw new Error('Secret key cannot be exposed');
  }

  async sign(bytes: string, _watermark?: Uint8Array) {
    const prefixSig = await tezbridge.request({
      method: 'raw_sign',
      bytes, // Any operation bytes as string
    });

    const pref = prefixSig.substr(0, 5);

    if (!isValidPrefix(pref)) {
      throw new Error('Unsupported signature given by tezbridge: ' + prefixSig);
    }

    const decoded = b58cdecode(prefixSig, prefix[pref]);

    return {
      bytes,
      sig: b58cencode(decoded, prefix.sig),
      prefixSig,
      sbytes: bytes + buf2hex(toBuffer(decoded)),
    };
  }
}
