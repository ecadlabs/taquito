import { InvalidSpendingKey } from '../errors';
import toBuffer from 'typedarray-to-buffer';
import { openSecretBox } from '@stablelib/nacl';
import pbkdf2 from 'pbkdf2';
import { Prefix, prefix, b58cdecode } from '@taquito/utils';

export function decryptKey(spendingKey: string, password?: string) {
  const keyArr = b58cdecode(spendingKey, prefix[Prefix.SASK]);
  // exit first if no password and key is encrypted
  if (!password && spendingKey.slice(0, 4) !== 'sask') {
    throw new InvalidSpendingKey(spendingKey, 'no password Provided to decrypt');
  }

  if (password && spendingKey.slice(0, 4) !== 'sask') {
    const salt = toBuffer(keyArr.slice(0, 8));
    const encryptedSk = toBuffer(keyArr.slice(8));

    const encryptionKey = pbkdf2.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
    const decrypted = openSecretBox(
      new Uint8Array(encryptionKey),
      new Uint8Array(24),
      new Uint8Array(encryptedSk)
    );
    if (!decrypted) {
      throw new InvalidSpendingKey(spendingKey, 'Encrypted Spending Key or Password Incorrect');
    }

    return toBuffer(decrypted);
  } else {
    return toBuffer(keyArr);
  }
}
