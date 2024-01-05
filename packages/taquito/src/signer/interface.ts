/**
 * @description Signer interface which is used across taquito in order to sign and inject operation
 */
export interface Signer {
  /**
   *
   * @param op Operation to sign
   * @param magicByte Magic bytes 11 for block, 12 for preattestation/preendorsement, 13 for attestation/endorsements, 3 for generic, 5 for the PACK format of michelson
   */
  sign(
    op: string,
    magicByte?: Uint8Array
  ): Promise<{
    bytes: string;
    sig: string;
    prefixSig: string;
    sbytes: string;
  }>;
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
}
