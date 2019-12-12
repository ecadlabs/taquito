import { Signer } from './interface';

/**
 * @description Default signer implementation which does nothing and produce invalid signature
 */
export class NoopSigner implements Signer {
  async publicKey() {
    return '';
  }
  async publicKeyHash() {
    return '';
  }

  async sign(bytes: string, _watermark?: Uint8Array) {
    return {
      bytes,
      sig: '',
      prefixSig: '',
      sbytes: bytes,
    };
  }
}
