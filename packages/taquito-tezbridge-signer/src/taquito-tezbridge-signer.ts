/**
 * @packageDocumentation
 * @module @taquito/tezbridge-signer
 * @deprecated
 */
import {
  b58cdecode,
  b58cencode,
  buf2hex,
  prefix,
  isValidPrefix,
  ProhibitedActionError,
  InvalidSignatureError,
} from '@taquito/utils';
import toBuffer from 'typedarray-to-buffer';

// eslint-disable-next-line no-var
declare var tezbridge: any;

export { VERSION } from './version';

/**
 *  @category Error
 *  @description Error that indicates a general TezBridge plugin error
 */
export class TezBridgePluginError extends Error {
  public name = 'TezBridgePluginError';
  constructor(public message: string) {
    super(message);
  }
}

export class TezBridgeSigner {
  constructor() {
    if (typeof tezbridge === 'undefined') {
      throw new TezBridgePluginError('TezBridge plugin could not be detected in your browser');
    }
  }

  async publicKeyHash(): Promise<string> {
    return tezbridge.request({ method: 'get_source' });
  }

  async publicKey(): Promise<string> {
    throw new ProhibitedActionError('Public key cannot be exposed');
  }

  async secretKey(): Promise<string> {
    throw new ProhibitedActionError('Secret key cannot be exposed');
  }

  async sign(bytes: string, _watermark?: Uint8Array) {
    const prefixSig = await tezbridge.request({
      method: 'raw_sign',
      bytes, // Any operation bytes as string
    });

    const pref = prefixSig.substr(0, 5);

    if (!isValidPrefix(pref)) {
      throw new InvalidSignatureError(prefixSig, 'Unsupported signature given by TezBridge');
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
