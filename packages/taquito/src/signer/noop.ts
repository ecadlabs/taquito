import { Signer } from '@taquito/core';
import { UnconfiguredSignerError } from './errors';
/**
 * @description Default signer implementation which does nothing and produce invalid signature
 * @throw {@link UnconfiguredSignerError}
 */
export class NoopSigner implements Signer {
  async publicKey(): Promise<string> {
    throw new UnconfiguredSignerError();
  }
  async publicKeyHash(): Promise<string> {
    throw new UnconfiguredSignerError();
  }
  async secretKey(): Promise<string> {
    throw new UnconfiguredSignerError();
  }
  async sign(_bytes: string, _watermark?: Uint8Array): Promise<any> {
    throw new UnconfiguredSignerError();
  }
}
