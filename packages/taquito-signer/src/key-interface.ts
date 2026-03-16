import { RawSignResult } from '@taquito/core';

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
  /**
   * Compare two public keys of the same elliptic curve
   * @param other the other PublicKey class to compare to
   * @returns -1 if this public key is less than the other, 0 if they are equal, 1 if this public key is greater than the other
   * @throws InvalidPublicKeyError
   */
  compare(other: PublicKey): number;

  /**
   * Hash of the public key (tz1, tz2, tz3, tz4 addresses)
   * @returns the hash of the public key
   */
  hash(): string;

  /**
   * Get the bytes of the public key without prefix
   * @param compress Whether to get the compressed format of the public key
   * @default true
   * @returns the bytes of the public key
   */
  bytes(compress?: boolean): Uint8Array;

  /**
   * Get the bytes of the public key with prefix
   * @returns the bytes of the public key
   */
  toProtocol(): Uint8Array;
}
