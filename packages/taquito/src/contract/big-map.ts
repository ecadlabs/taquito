import { Schema } from '@taquito/michelson-encoder';
import BigNumber from 'bignumber.js';
import { ContractProvider } from './interface';

export class BigMapAbstraction {
  constructor(private id: BigNumber, private schema: Schema, private provider: ContractProvider) {}

  async get(keyToEncode: string) {
    try {
      const id = await this.provider.getBigMapKeyByID(this.id.toString(), keyToEncode, this.schema);
      return id;
    } catch (e) {
      return undefined;
    }
  }

  toJSON() {
    return this.id.toString();
  }

  toString() {
    return this.id.toString();
  }
}
