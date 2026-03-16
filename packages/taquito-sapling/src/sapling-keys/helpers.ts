import { InvalidSpendingKey } from '../errors';
import toBuffer from 'typedarray-to-buffer';
import { openSecretBox } from '@stablelib/nacl';
import pbkdf2 from 'pbkdf2';
import { PrefixV2, b58DecodeAndCheckPrefix } from '@taquito/utils';
import { ParameterValidationError } from '@taquito/core';

export function decryptKey(spendingKey: string, password?: string) {
  const [keyArr, pre] = (() => {
    try {
      return b58DecodeAndCheckPrefix(spendingKey, [
        PrefixV2.SaplingSpendingKey,
        PrefixV2.EncryptedSaplingSpendingKey,
      ]);
    } catch (err: unknown) {
      if (err instanceof ParameterValidationError) {
        throw new InvalidSpendingKey('invalid spending key');
      } else {
        throw err;
      }
    }
  })();

  if (pre === PrefixV2.EncryptedSaplingSpendingKey) {
    if (!password) {
      throw new InvalidSpendingKey('no password provided to decrypt');
    }

    const salt = toBuffer(keyArr.slice(0, 8));
    const encryptedSk = toBuffer(keyArr.slice(8));

    const encryptionKey = pbkdf2.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
    // Zero nonce is safe: fresh random salt per encryption produces unique PBKDF2-derived key.
    // See: https://gitlab.com/tezos/tezos/-/blob/master/src/lib_signer_backends/encrypted.ml
    const decrypted = openSecretBox(
      new Uint8Array(encryptionKey),
      new Uint8Array(24), // zero nonce - uniqueness provided by per-encryption derived key
      new Uint8Array(encryptedSk)
    );
    if (!decrypted) {
      throw new InvalidSpendingKey('incorrect password or unable to decrypt');
    }
    return toBuffer(decrypted);
  } else {
    return toBuffer(keyArr);
  }
}
