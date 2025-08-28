import { RawSignResult } from '@taquito/taquito';

export interface SigningKey {
  sign(message: Uint8Array): Promise<RawSignResult>;
  publicKey(): Promise<string>;
  publicKeyHash(): Promise<string>;
  secretKey(): Promise<string>;
  provePossession?: () => Promise<RawSignResult>;
}

export interface SigningKeyWithProofOfPossession extends SigningKey {
  provePossession(): Promise<RawSignResult>;
}

export function isPOP(k: SigningKey): k is SigningKeyWithProofOfPossession {
  return 'provePossession' in k;
}
