import { verify as verifyEd25519 } from '@stablelib/ed25519';
import { hash as blake2b } from '@stablelib/blake2b';
import {
  b58DecodeAndCheckPrefix,
  buf2hex,
  hex2buf,
  mergebuf,
  Prefix,
  publicKeyPrefixes,
  signaturePrefixes,
} from './taquito-utils';
import elliptic from 'elliptic';
import { InvalidMessageError, InvalidPublicKeyError, InvalidSignatureError, ParameterValidationError } from '@taquito/core';
import { bls12_381 } from '@noble/curves/bls12-381';

export const BLS12_381_DST = "BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_POP_";

/**
 * @description Verify signature of a payload
 *
 * @param message The forged message including the magic byte (11 for block,
 *        12 for preattestation, 13 for attestation, 3 for generic, 5 for the PACK format of michelson)
 * @param publicKey The public key to verify the signature against
 * @param signature The signature to verify
 * @returns A boolean indicating if the signature matches
 * @throws {@link InvalidPublicKeyError} | {@link InvalidSignatureError} | {@link InvalidMessageError}
 * @example
 * ```
 * const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
 * const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
 * const sig = 'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'
 *
 * const response = verifySignature(message, pk, sig);
 * ```
 *
 */
export function verifySignature(
  message: string | Uint8Array,
  publicKey: string,
  signature: string,
  watermark?: Uint8Array
): boolean {
  const [pk, pre] = (() => {
    try {
      return b58DecodeAndCheckPrefix(publicKey, publicKeyPrefixes);
    } catch (err: unknown) {
      if (err instanceof ParameterValidationError) {
        throw new InvalidPublicKeyError(publicKey, err.result);
      } else {
        throw err;
      }
    }
  })();

  const sig = (() => {
    try {
      const [sig] = b58DecodeAndCheckPrefix(signature, signaturePrefixes);
      return sig;
    } catch (err: unknown) {
      if (err instanceof ParameterValidationError) {
        throw new InvalidSignatureError(signature, err.result);
      } else {
        throw err;
      }
    }
  })();

  let msg: Uint8Array;
  if (typeof message === 'string') {
    msg = hex2buf(message);
  } else {
    msg = message;
  }

  if (msg.length === 0) {
    throw new InvalidMessageError(buf2hex(msg), `can't be empty`);
  }

  if (typeof watermark !== 'undefined') {
    msg = mergebuf(watermark, msg);
  }

  switch (pre) {
    case Prefix.P256PublicKey:
      return verifyP2Signature(sig, msg, pk);
    case Prefix.Secp256k1PublicKey:
      return verifySpSignature(sig, msg, pk);
    case Prefix.Ed25519PublicKey:
      return verifyEdSignature(sig, msg, pk);
    default:
      return verifyBLSSignature(sig, msg, pk);
  }
}

function verifyEdSignature(sig: Uint8Array, msg: Uint8Array, publicKey: Uint8Array): boolean {
  const hash = blake2b(msg, 32);
  try {
    return verifyEd25519(publicKey, hash, sig);
  } catch {
    return false;
  }
}

function verifySpSignature(sig: Uint8Array, msg: Uint8Array, publicKey: Uint8Array): boolean {
  const key = new elliptic.ec('secp256k1').keyFromPublic(publicKey);
  return verifySpOrP2Sig(sig, msg, key);
}

function verifyP2Signature(sig: Uint8Array, msg: Uint8Array, publicKey: Uint8Array): boolean {
  const key = new elliptic.ec('p256').keyFromPublic(publicKey);
  return verifySpOrP2Sig(sig, msg, key);
}

function verifySpOrP2Sig(sig: Uint8Array, msg: Uint8Array, key: elliptic.ec.KeyPair): boolean {
  const r = sig.slice(0, 32);
  const s = sig.slice(32);
  const hash = blake2b(msg, 32);
  try {
    return key.verify(hash, { r, s });
  } catch {
    return false;
  }
}

const bls = bls12_381.longSignatures; // AKA MinPK

function verifyBLSSignature(sig: Uint8Array, msg: Uint8Array, publicKey: Uint8Array): boolean {
  try {
    const point = bls.hash(msg, BLS12_381_DST);
    return bls.verify(sig, point, publicKey);
  } catch {
    return false;
  }
}