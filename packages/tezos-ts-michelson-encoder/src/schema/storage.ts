import { Token } from '../tokens/token';

import { BigMapToken } from '../tokens/bigmap';

import { createToken } from '../tokens/createToken';

import { RpcTransaction } from './model';

export class Schema {
  private root: Token;
  private bigMap?: BigMapToken;

  static fromRPCResponse(val: any) {
    return new Schema(val.script.code.find((x: any) => x.prim === 'storage')!.args[0]);
  }

  constructor(val: any) {
    this.root = createToken(val, 0);

    if (val.prim === 'pair' && val.args[0].prim === 'big_map') {
      this.bigMap = new BigMapToken(val.args[0], 0, createToken);
    }
  }

  Execute(val: any) {
    return this.root.Execute(val);
  }

  ExecuteOnBigMapDiff(diff: any) {
    if (!this.bigMap) {
      throw new Error('No big map schema');
    }

    return this.bigMap.Execute(diff);
  }

  ExecuteOnBigMapValue(key: any) {
    if (!this.bigMap) {
      throw new Error('No big map schema');
    }

    return this.bigMap.ValueSchema.Execute(key);
  }

  EncodeBigMapKey(key: string) {
    if (!this.bigMap) {
      throw new Error('No big map schema');
    }

    return this.bigMap.KeySchema.ToBigMapKey(key);
  }

  ExtractSchema() {
    return this.root.ExtractSchema();
  }

  ComputeState(tx: RpcTransaction[], state: any) {
    if (!this.bigMap) {
      throw new Error('No big map schema');
    }

    const bigMap = tx.reduce((prev, current) => {
      return {
        ...prev,
        ...this.ExecuteOnBigMapDiff(current.contents[0].metadata.operation_result.big_map_diff),
      };
    }, {});

    return {
      ...this.Execute(state),
      [this.bigMap.annot()]: bigMap,
    };
  }
}
