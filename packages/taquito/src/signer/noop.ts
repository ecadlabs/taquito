import { Signer } from './interface';

/**
 *  @category Error
 *  @description Error that indicates the signer has been unconfigured in the TezosToolkit instance
 */
export class UnconfiguredSignerError extends Error {
  name = 'UnconfiguredSignerError';

  constructor() {
    super(
      'No signer has been configured. Please configure one by calling setProvider({signer}) on your TezosToolkit instance.'
    );
  }
}

/**
 * @description Default signer implementation which does nothing and produce invalid signature
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
