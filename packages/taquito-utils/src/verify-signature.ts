import { verify } from '@stablelib/ed25519';
import { hash } from '@stablelib/blake2b';
import {
  b58cdecode,
  buf2hex,
  hex2buf,
  Prefix,
  prefix,
  validatePublicKey,
  validateSignature,
  ValidationResult,
} from './taquito-utils';
import elliptic from 'elliptic';
import toBuffer from 'typedarray-to-buffer';
import { InvalidMessageError, InvalidPublicKeyError, InvalidSignatureError } from './errors';

type PkPrefix = Prefix.EDPK | Prefix.SPPK | Prefix.P2PK | Prefix.BLPK;
type SigPrefix = Prefix.EDSIG | Prefix.SPSIG | Prefix.P2SIG | Prefix.SIG;

/**
 * @description Verify signature of a payload
 *
 * @param messageBytes The forged message including the magic byte (11 for block,
 *        12 for preendorsement, 13 for endorsement, 3 for generic, 5 for the PACK format of michelson)
 * @param publicKey The public key to verify the signature against
 * @param signature The signature to verify
 * @returns A boolean indicating if the signature matches
 *
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
  messageBytes: string,
  publicKey: string,
  signature: string
): boolean {
  const pkPrefix = validatePkAndExtractPrefix(publicKey);
  const sigPrefix = validateSigAndExtractPrefix(signature);

  const decodedPublicKey = b58cdecode(publicKey, prefix[pkPrefix]);
  const decodedSig = b58cdecode(signature, prefix[sigPrefix]);
  const bytesHash = hash(hex2buf(validateMessageNotEmpty(messageBytes)), 32);

  if (pkPrefix === Prefix.EDPK) {
    return verifyEdSignature(decodedSig, bytesHash, decodedPublicKey);
  } else if (pkPrefix === Prefix.SPPK) {
    return verifySpSignature(decodedSig, bytesHash, decodedPublicKey);
  } else if (pkPrefix === Prefix.P2PK) {
    return verifyP2Signature(decodedSig, bytesHash, decodedPublicKey);
  } else {
    return false;
  }
}

function validateMessageNotEmpty(message: string) {
  if (message === '') {
    throw new InvalidMessageError(
      message,
      'The message provided for verifying signature cannot be empty.'
    );
  }
  return message;
}

export function validatePkAndExtractPrefix(publicKey: string): PkPrefix {
  if (publicKey === '') {
    throw new InvalidPublicKeyError(publicKey, 'Public key cannot be empty');
  }
  const pkPrefix = publicKey.substring(0, 4);
  const validation = validatePublicKey(publicKey);
  if (validation !== ValidationResult.VALID) {
    if (validation === ValidationResult.INVALID_CHECKSUM) {
      throw new InvalidPublicKeyError(publicKey, 'The public key provided has an invalid checksum');
    } else if (validation === ValidationResult.INVALID_LENGTH) {
      throw new InvalidPublicKeyError(publicKey, 'The public key provided has an invalid length');
    } else if (validation === ValidationResult.NO_PREFIX_MATCHED) {
      throw new InvalidPublicKeyError(
        publicKey,
        `The public key provided has an unsupported prefix: ${pkPrefix}`
      );
    }
  }
  return pkPrefix as PkPrefix;
}

function validateSigAndExtractPrefix(signature: string): SigPrefix {
  const signaturePrefix = signature.startsWith('sig')
    ? signature.substr(0, 3)
    : signature.substr(0, 5);
  const validation = validateSignature(signature);
  if (validation !== ValidationResult.VALID) {
    if (validation === ValidationResult.INVALID_CHECKSUM) {
      throw new InvalidSignatureError(signature, `invalid checksum`);
    } else if (validation === ValidationResult.INVALID_LENGTH) {
      throw new InvalidSignatureError(signature, 'invalid length');
    } else if (validation === ValidationResult.NO_PREFIX_MATCHED) {
      throw new InvalidSignatureError(signaturePrefix, 'unsupported prefix');
    }
  }
  return signaturePrefix as SigPrefix;
}

function verifyEdSignature(
  decodedSig: Uint8Array,
  bytesHash: Uint8Array,
  decodedPublicKey: Uint8Array
) {
  try {
    return verify(decodedPublicKey, bytesHash, decodedSig);
  } catch (e) {
    return false;
  }
}

function verifySpSignature(
  decodedSig: Uint8Array,
  bytesHash: Uint8Array,
  decodedPublicKey: Uint8Array
) {
  const key = new elliptic.ec('secp256k1').keyFromPublic(decodedPublicKey);
  return verifySpOrP2Sig(decodedSig, bytesHash, key);
}

function verifyP2Signature(
  decodedSig: Uint8Array,
  bytesHash: Uint8Array,
  decodedPublicKey: Uint8Array
) {
  const key = new elliptic.ec('p256').keyFromPublic(decodedPublicKey);
  return verifySpOrP2Sig(decodedSig, bytesHash, key);
}

function verifySpOrP2Sig(decodedSig: Uint8Array, bytesHash: Uint8Array, key: elliptic.ec.KeyPair) {
  const hexSig = buf2hex(toBuffer(decodedSig));
  const match = hexSig.match(/([a-f\d]{64})/gi);
  if (match) {
    try {
      const [r, s] = match;
      return key.verify(bytesHash, { r, s });
    } catch (e) {
      return false;
    }
  }
  return false;
}
