import { Schema } from '@taquito/michelson-encoder';
import BigNumber from 'bignumber.js';
import { ContractProvider } from './interface';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';

export class BigMapAbstraction {
  constructor(private id: BigNumber, private schema: Schema, private provider: ContractProvider) {}

  /**
   *
   * @description Fetch one value in a big map
   * 
   * @param keysToEncode Key to query (will be encoded properly according to the schema)
   * @param block optional block level to fetch the values from (head will be use by default)
   * @returns Return a well formatted json object of a big map value or undefined if the key is not found in the big map
   *
   */
  async get<T>(keyToEncode: string, block?: number) {
    try {
      const id = await this.provider.getBigMapKeyByID<T>(this.id.toString(), keyToEncode, this.schema, block);
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
   * All values will be fetched on the same block level. If a block is specified in the request, the values will be fetched at it. 
   * Otherwise, a first request will be done to the node to fetch the level of the head and all values will be fetched at this level.
   * If one of the keys does not exist in the big map, its value will be set to undefined.
   *
   * @param keysToEncode Array of keys to query (will be encoded properly according to the schema)
   * @param block optional block level to fetch the values from
   * @returns An object containing the keys queried in the big map and their value in a well-formatted JSON object format
   *
   */
  async getMultipleValues<T>(keysToEncode: string[], block?: number) {
    return this.provider.getBigMapKeysByID<T>(this.id.toString(), keysToEncode, this.schema, block);
  }

  toJSON() {
    return this.id.toString();
  }

  toString() {
    return this.id.toString();
  }
}
