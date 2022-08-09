import { InvalidSpendingKey } from '../error';
import { InMemoryViewingKey } from './in-memory-viewing-key';
import toBuffer from 'typedarray-to-buffer';
import { openSecretBox } from '@stablelib/nacl';
import * as sapling from '@airgap/sapling-wasm';
import pbkdf2 from 'pbkdf2';
import { Prefix, prefix, b58cdecode, b58cencode, ValidationResult } from '@taquito/utils';
import * as bip39 from 'bip39';

/**
 * @description holds the spending key
 * can instantiate from mnemonic word list or decrypt a encrypted spending key
 * with access to instantiate a InMemoryViewingKey
 */
export class InMemorySpendingKey {
  #skBuf: Buffer;
  #saplingViewingKey: InMemoryViewingKey | undefined;
  /**
   *
   * @param spendingKey unencrypted sask... or encrypted MMXj...
   * @param password required for MMXj encrypted keys
   */
  constructor(spendingKey: string, password?: string) {
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

      this.#skBuf = toBuffer(decrypted);
    } else {
      this.#skBuf = toBuffer(keyArr);
    }
  }

  /**
   *
   * @param mnemonic strings of words
   * @param derivationPath tezos current standard 'm/'
   * @returns InMemorySpendingKey class instantiated
   */

  static async fromMnemonic(mnemonic: string, derivationPath = 'm/') {
    // no password passed here. password provided only changes from sask -> MMXj
    const fullSeed = await bip39.mnemonicToSeed(mnemonic);

    const first32: Buffer = fullSeed.slice(0, 32);
    const second32: Buffer = fullSeed.slice(32);
    // reduce seed bytes must be 32 bytes reflecting both halves
    const seed = Buffer.from(first32.map((byte, index) => byte ^ second32[index]));

    const spendingKeyArr = new Uint8Array(
      await sapling.getExtendedSpendingKey(seed, derivationPath)
    );

    const spendingKey = b58cencode(spendingKeyArr, prefix[Prefix.SASK]);

    if (ValidationResult.VALID !== 3) {
      throw new InvalidSpendingKey(spendingKey);
    }

    return new InMemorySpendingKey(spendingKey);
  }

  /**
   *
   * @returns InMemoryViewingKey instantiated class
   */
  async getInMemoryViewingKey() {
    let vk: Buffer;
    if (!this.#saplingViewingKey) {
      vk = await sapling.getExtendedFullViewingKeyFromSpendingKey(this.#skBuf);
      this.#saplingViewingKey = new InMemoryViewingKey(vk.toString('hex'));
    }

    return this.#saplingViewingKey;
  }

  /**
   *
   * @returns return spending key string
   */
  getSpendingKey() {
    return b58cencode(this.#skBuf, prefix[Prefix.SASK]);
  }
}
