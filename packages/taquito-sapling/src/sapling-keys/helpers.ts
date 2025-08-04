import { InvalidSpendingKey } from '../errors';
import toBuffer from 'typedarray-to-buffer';
import { openSecretBox } from '@stablelib/nacl';
import pbkdf2 from 'pbkdf2';
import { Prefix, b58DecodeAndCheckPrefix } from '@taquito/utils';
import { ParameterValidationError } from '@taquito/core';

export function decryptKey(spendingKey: string, password?: string) {
  const [keyArr, pre] = (() => {
    try {
      return b58DecodeAndCheckPrefix(spendingKey, [Prefix.SaplingSpendingKey, Prefix.EncryptedSaplingSpendingKey]);
    } catch (err: unknown) {
      if (err instanceof ParameterValidationError) {
        throw new InvalidSpendingKey(spendingKey, 'invalid spending key');
      } else {
        throw err;
      }
    }
  })()

  if (pre === Prefix.EncryptedSaplingSpendingKey) {
    if (!password) {
      throw new InvalidSpendingKey(spendingKey, 'no password provided to decrypt');
    }

    const salt = toBuffer(keyArr.slice(0, 8));
    const encryptedSk = toBuffer(keyArr.slice(8));

    const encryptionKey = pbkdf2.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
    const decrypted = openSecretBox(
      new Uint8Array(encryptionKey),
      new Uint8Array(24),
      new Uint8Array(encryptedSk)
    );
    if (!decrypted) {
      throw new InvalidSpendingKey(spendingKey, 'incorrect password or unable to decrypt');
    }
    return toBuffer(decrypted);
  } else {
    return toBuffer(keyArr);
  }
}
