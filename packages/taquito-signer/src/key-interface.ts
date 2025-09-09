import { RawSignResult } from '@taquito/taquito';

export interface SigningKey {
  sign(message: Uint8Array): RawSignResult;
  publicKey(): PublicKey;
  secretKey(): string;
  provePossession?: () => RawSignResult;
}

export interface SigningKeyWithProofOfPossession extends SigningKey {
  provePossession(): RawSignResult;
}

export function isPOP(k: SigningKey): k is SigningKeyWithProofOfPossession {
  return 'provePossession' in k;
}

export interface PublicKey {
  compare(other: PublicKey): number;
  hash(): string;
  bytes(compress?: boolean): Uint8Array;
  toProtocol(): Uint8Array;
}
