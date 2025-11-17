import { b58Encode, PrefixV2 } from '@taquito/utils';
import * as sapling from '@airgap/sapling-wasm';
import { decryptKey } from './helpers';

/**
 * @description Holds the viewing key
 */
export class InMemoryViewingKey {
  #fullViewingKey: Buffer;
  constructor(fullViewingKey: string) {
    this.#fullViewingKey = Buffer.from(fullViewingKey, 'hex');
  }

  /**
   * @description Allows to instantiate the InMemoryViewingKey from an encrypted/unencrypted spending key
   *
   * @param spendingKey Base58Check-encoded spending key
   * @param password Optional password to decrypt the spending key
   * @example
   * ```
   * await InMemoryViewingKey.fromSpendingKey('sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L')
   * ```
   *
   */
  static async fromSpendingKey(spendingKey: string, password?: string) {
    const spendingKeyBuf = decryptKey(spendingKey, password);
    const viewingKey = await sapling.getExtendedFullViewingKeyFromSpendingKey(spendingKeyBuf);
    return new InMemoryViewingKey(viewingKey.toString('hex'));
  }

  /**
   * @description Retrieve the full viewing key
   * @returns Buffer representing the full viewing key
   *
   */
  getFullViewingKey() {
    return this.#fullViewingKey;
  }

  /**
   * @description Retrieve the outgoing viewing key
   * @returns Buffer representing the outgoing viewing key
   *
   */
  async getOutgoingViewingKey() {
    return sapling.getOutgoingViewingKey(this.#fullViewingKey);
  }

  /**
   * @description Retrieve the incoming viewing key
   * @returns Buffer representing the incoming viewing key
   *
   */
  async getIncomingViewingKey() {
    return sapling.getIncomingViewingKey(this.#fullViewingKey);
  }

  /**
   * @description Retrieve a payment address
   * @param addressIndex used to determine which diversifier should be used to derive the address, default is 0
   * @returns Base58Check-encoded address and its index
   *
   */
  async getAddress(addressIndex?: number) {
    const { index, raw } = await sapling.getPaymentAddressFromViewingKey(
      this.#fullViewingKey,
      addressIndex
    );
    return {
      address: b58Encode(raw, PrefixV2.SaplingAddress),
      addressIndex: index.readInt32LE(),
    };
  }
}
