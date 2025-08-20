/**
 * @description Signer interface which is used across taquito in order to sign and inject operation
 */
export interface Signer {
  /**
   * @param op Message to sign
   * @param magicByte Magic bytes 11 for block, 12 for preattestation, 13 for attestation, 3 for generic, 5 for the PACK format of michelson
   * @description Sign the message and return an object with bytes, sig, prefixSig and sbytes
   */
  sign(op: string, magicByte?: Uint8Array): Promise<SignResult>;
  /**
   * @description Return the public key of the account used by the signer
   */
  publicKey(): Promise<string>;

  /**
   * @description Return the public key hash of the account used by the signer
   */
  publicKeyHash(): Promise<string>;

  /**
   * @description Optionally return the secret key of the account used by the signer
   */
  secretKey(): Promise<string | undefined>;

  /**
   * @description Sign the public key to prove possession for bls key and return an object with bytes, sig, prefixSig and sbytes
   */
  provePossession?(): Promise<RawSignResult>;
}

export interface SignResult {
  bytes: string;
  sig: string; // Base58 untyped signature ('sig...')
  prefixSig: string; // Base58 typed signature
  sbytes: string; // bytes + signature
}

export interface RawSignResult {
  sig: string; // Base58 untyped signature ('sig...')
  prefixSig: string; // Base58 typed signature
  rawSignature: Uint8Array;
}
