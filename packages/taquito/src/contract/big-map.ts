import { normalizeBigMapValuesOptions } from './big-map-values-options';
import { UnsupportedActionError } from '@taquito/core';
import { isBlockHashIdentifier } from '../read-provider/interface';
import { Schema, BigMapKeyType } from '@taquito/michelson-encoder';
import BigNumberJs from 'bignumber.js';
type BigNumber = InstanceType<typeof BigNumberJs>;
const BigNumber = BigNumberJs;
import { StorageProvider, BigMapValuesOptions, BigMapValuesPage } from './interface';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { BlockIdentifier } from '../read-provider/interface';

export class BigMapAbstraction {
  constructor(
    private id: BigNumber,
    private schema: Schema,
    private provider: StorageProvider,
    private defaultBlock?: BlockIdentifier
  ) {}

  /**
   *
   * Fetch one value in a big map
   *
   * @param keyToEncode Key to query (will be encoded properly according to the schema)
   * @param block optional block level to fetch the values from (head will be use by default)
   * @returns Return a well formatted json object of a big map value or undefined if the key is not found in the big map
   *
   */
  async get<T>(keyToEncode: BigMapKeyType, block?: BlockIdentifier) {
    try {
      const id = await this.provider.getBigMapKeyByID<T>(
        this.id.toString(),
        keyToEncode,
        this.schema,
        block ?? this.defaultBlock
      );
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
   * Fetch multiple values in a big map
   * All values will be fetched on the same block level. If a block is specified in the request, the values will be fetched at it.
   * Otherwise, a first request will be done to the node to fetch the level of the head and all values will be fetched at this level.
   * If one of the keys does not exist in the big map, its value will be set to undefined.
   *
   * @param keysToEncode Array of keys to query (will be encoded properly according to the schema)
   * @param block optional block level to fetch the values from
   * @param batchSize optional batch size representing the number of requests to execute in parallel
   * @returns A MichelsonMap containing the keys queried in the big map and their value in a well-formatted JSON object format
   *
   */
  async getMultipleValues<T>(
    keysToEncode: Array<BigMapKeyType>,
    block?: BlockIdentifier,
    batchSize = 5
  ) {
    return this.provider.getBigMapKeysByID<T>(
      this.id.toString(),
      keysToEncode,
      this.schema,
      block ?? this.defaultBlock,
      batchSize
    );
  }

  /** Read one page and expose its exact block hash for subsequent manual pagination. */
  async getValuesPage<T>(options: BigMapValuesOptions = {}): Promise<BigMapValuesPage<T>> {
    const { offset, length, block } = normalizeBigMapValuesOptions(options);
    if (typeof this.provider.getBigMapValuesPageByID !== 'function')
      throw new UnsupportedActionError(
        'The storage provider does not support big-map values pages'
      );
    const result = await this.provider.getBigMapValuesPageByID<T>(this.id.toString(), this.schema, {
      offset,
      length,
      block: block ?? this.defaultBlock,
    });
    if (
      !Array.isArray(result?.values) ||
      result.values.length > length ||
      !isBlockHashIdentifier(result.blockHash)
    )
      throw new TypeError('Invalid big-map values page');
    return result;
  }

  /** Return only the decoded values of one finite page. Ordering is unspecified. */
  async getValues<T>(options: BigMapValuesOptions = {}): Promise<T[]> {
    return (await this.getValuesPage<T>(options)).values;
  }

  /** Check one value at a snapshot. RPC errors, including 404, are preserved. */
  async isEmpty(block?: BlockIdentifier): Promise<boolean> {
    return (await this.getValues({ length: 1, block })).length === 0;
  }

  toJSON() {
    return this.id.toString();
  }

  toString() {
    return this.id.toString();
  }
}
