import { Schema } from '@taquito/michelson-encoder';
import BigNumber from 'bignumber.js';
import { ContractProvider } from './interface';
import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';

export class BigMapAbstraction {
  constructor(private id: BigNumber, private schema: Schema, private provider: ContractProvider) { }

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

  toJSON() {
    return this.id.toString();
  }

  toString() {
    return this.id.toString();
  }
}
