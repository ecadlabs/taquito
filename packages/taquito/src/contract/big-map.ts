import { UnsupportedActionError } from '@taquito/core';
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

  /**
   *
   * Fetch one finite page of values and the hash of the block it was read at
   * Pass the returned block hash as `block` to read the next pages from the same snapshot.
   *
   * @param options optional offset (default 0), length (1 to 1000, default 100) and block (default to the block of this abstraction, then head)
   * @returns The decoded values, in unspecified order, and the block hash
   * @throws {@link @taquito/core!UnsupportedActionError | UnsupportedActionError} if the storage provider cannot read big-map values
   * @throws {@link @taquito/core!InvalidBigMapParameterError | InvalidBigMapParameterError} if the page options are invalid
   * @throws {@link @taquito/core!RpcError | RpcError} if the read provider returns an invalid response
   *
   */
  async getValuesPage<T>(options: BigMapValuesOptions = {}): Promise<BigMapValuesPage<T>> {
    if (typeof this.provider.getBigMapValuesPageByID !== 'function') {
      throw new UnsupportedActionError('The storage provider does not support big-map value reads');
    }
    return this.provider.getBigMapValuesPageByID<T>(
      this.id.toString(),
      this.schema,
      this.withDefaultBlock(options)
    );
  }

  /**
   *
   * Fetch one finite page of values with a single request
   * The block is not resolved to a hash. Use getValuesPage to read several pages from one snapshot.
   *
   * @param options optional offset (default 0), length (1 to 1000, default 100) and block (default to the block of this abstraction, then head)
   * @returns The decoded values, in unspecified order
   * @throws {@link @taquito/core!UnsupportedActionError | UnsupportedActionError} if the storage provider cannot read big-map values
   * @throws {@link @taquito/core!InvalidBigMapParameterError | InvalidBigMapParameterError} if the page options are invalid
   * @throws {@link @taquito/core!RpcError | RpcError} if the read provider returns an invalid response
   *
   */
  async listValues<T>(options: BigMapValuesOptions = {}): Promise<T[]> {
    if (typeof this.provider.listBigMapValuesByID !== 'function') {
      throw new UnsupportedActionError('The storage provider does not support big-map value reads');
    }
    return this.provider.listBigMapValuesByID<T>(
      this.id.toString(),
      this.schema,
      this.withDefaultBlock(options)
    );
  }

  /**
   *
   * Check if the big map has no values, with a single request that reads at most one value
   * RPC errors, including 404 for an unknown big-map ID, are not converted.
   *
   * @param block optional block level to check (default to the block of this abstraction, then head)
   * @throws {@link @taquito/core!UnsupportedActionError | UnsupportedActionError} if the storage provider cannot read big-map values
   * @throws {@link @taquito/core!RpcError | RpcError} if the read provider returns an invalid response
   *
   */
  async isEmpty(block?: BlockIdentifier): Promise<boolean> {
    if (typeof this.provider.isBigMapEmptyByID !== 'function') {
      throw new UnsupportedActionError('The storage provider does not support big-map value reads');
    }
    return this.provider.isBigMapEmptyByID(this.id.toString(), block ?? this.defaultBlock);
  }

  private withDefaultBlock(options: BigMapValuesOptions): BigMapValuesOptions {
    // Leave null or non-object options to the provider, which rejects them.
    if (options === null || typeof options !== 'object') return options;
    return { ...options, block: options.block ?? this.defaultBlock };
  }

  toJSON() {
    return this.id.toString();
  }

  toString() {
    return this.id.toString();
  }
}
