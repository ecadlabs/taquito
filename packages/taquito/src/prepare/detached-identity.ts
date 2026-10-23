import {
  b58DecodeAndCheckPrefix,
  getPkhfromPk,
  PrefixV2,
  publicKeyHashPrefixes,
  publicKeyPrefixes,
  verifySignature,
} from '@taquito/utils';
import { RevealParams } from '../operations/types';

/** Public identity used to prepare operations without a signer. */
export interface DetachedIdentity {
  pkh: string;
  publicKey?: string;
  /** BLS proof of possession, required when revealing a BLS account. */
  proof?: string;
}

export function validateDetachedIdentity(identity: DetachedIdentity): Readonly<DetachedIdentity> {
  const { pkh, publicKey, proof } = identity;
  b58DecodeAndCheckPrefix(pkh, publicKeyHashPrefixes);
  if (publicKey !== undefined) {
    b58DecodeAndCheckPrefix(publicKey, publicKeyPrefixes);
    if (getPkhfromPk(publicKey) !== pkh)
      throw new Error('Public key does not match detached identity');
  }
  if (proof !== undefined) {
    if (!pkh.startsWith('tz4') || publicKey === undefined) {
      throw new Error('A proof requires a BLS public key');
    }
    b58DecodeAndCheckPrefix(proof, [PrefixV2.BLS12_381Signature]);
    const [bytes] = b58DecodeAndCheckPrefix(publicKey, [PrefixV2.BLS12_381PublicKey]);
    if (!verifySignature(bytes, publicKey, proof, undefined, true)) {
      throw new Error('Invalid BLS proof of possession');
    }
  }
  return Object.freeze({ pkh, publicKey, proof });
}

export function detachedRevealParams(
  identity: Readonly<DetachedIdentity>,
  params: RevealParams
): RevealParams {
  if (params.proof !== undefined && params.proof !== identity.proof) {
    throw new Error('Reveal proof differs from detached identity');
  }
  return { ...params, proof: identity.proof };
}

export function detachedProof(identity: Readonly<DetachedIdentity>): string {
  if (identity.proof === undefined)
    throw new Error('A BLS proof of possession is required to reveal this account');
  return identity.proof;
}
