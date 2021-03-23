import { Schema } from '@taquito/michelson-encoder';
import BigNumber from 'bignumber.js';
import { ContractProvider } from './interface';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';

export class BigMapAbstraction {
  constructor(private id: BigNumber, private schema: Schema, private provider: ContractProvider) {}

  async get<T>(keyToEncode: string) {
    try {
      const id = await this.provider.getBigMapKeyByID<T>(this.id.toString(), keyToEncode, this.schema);
      return id;
    } catch (e) {
      if (e instanceof HttpResponseError && e.status === STATUS_CODE.NOT_FOUND) {
        return undefined;
      } else {
        throw e;
      }
    }
  }

  /**
   *
   * @description Fetch multiple values in a big map
   * All values will be fetch on the same block level
   * If one of the key does not exist in the big map, its value will be set to undefined
   *
   * @param keysToEncode Array of keys to query (will be encoded properly according to the schema)
   * @returns An object containing the keys queried in the big map and their value in a well-formatted JSON object format
   *
   */
  async getMultipleValues<T>(keysToEncode: string[]) {
    return this.provider.getBigMapKeysByID<T>(this.id.toString(), keysToEncode, this.schema);
  }

  toJSON() {
    return this.id.toString();
  }

  toString() {
    return this.id.toString();
  }
}
