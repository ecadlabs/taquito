import { MichelsonV1Expression, MichelsonV1ExpressionExtended, ScriptResponse } from '@taquito/rpc';
import { BigMapToken } from '../tokens/bigmap';
import { createToken } from '../tokens/createToken';
import { OrToken } from '../tokens/or';
import { PairToken } from '../tokens/pair';
import { Semantic, Token, TokenValidationError } from '../tokens/token';
import { RpcTransaction } from './model';
import { Falsy } from './types';

/**
 * @warn Our current smart contract abstraction feature is currently in preview. It's API is not final, and it may not cover every use case (yet). We will greatly appreciate any feedback on this feature.
 */
export class Schema {
  private root: Token;

  // TODO: Should we deprecate this?
  private bigMap?: BigMapToken;

  static fromRPCResponse(val: { script: ScriptResponse }) {
    const storage: Falsy<MichelsonV1ExpressionExtended> =
      val &&
      val.script &&
      Array.isArray(val.script.code) &&
      (val.script.code.find((x: any) => x.prim === 'storage') as MichelsonV1ExpressionExtended);

    if (!storage || !Array.isArray(storage.args)) {
      throw new Error('Invalid rpc response passed as arguments');
    }

    return new Schema(storage.args[0]);
  }

  private isExpressionExtended(
    val: any
  ): val is Required<Pick<MichelsonV1ExpressionExtended, 'prim' | 'args'>> {
    return 'prim' in val && Array.isArray(val.args);
  }

  constructor(val: MichelsonV1Expression) {
    this.root = createToken(val, 0);

    if (this.root instanceof BigMapToken) {
      this.bigMap = this.root;
    } else if (this.isExpressionExtended(val) && val.prim === 'pair') {
      const exp = val.args[0];
      if (this.isExpressionExtended(exp) && exp.prim === 'big_map') {
        this.bigMap = new BigMapToken(exp, 0, createToken);
      }
    }
  }

  private removeTopLevelAnnotation(obj: any) {
    // PairToken and OrToken can have redundant top level annotation in their storage
    if (this.root instanceof PairToken || this.root instanceof OrToken) {
      if (this.root.hasAnnotations() && typeof obj === 'object' && Object.keys(obj).length === 1) {
        return obj[Object.keys(obj)[0]];
      }
    }

    return obj;
  }

  Execute(val: any, semantics?: Semantic) {
    const storage = this.root.Execute(val, semantics);

    return this.removeTopLevelAnnotation(storage);
  }

  ExecuteOnBigMapDiff(diff: any[], semantics?: Semantic) {
    if (!this.bigMap) {
      throw new Error('No big map schema');
    }

    if (!Array.isArray(diff)) {
      throw new Error('Invalid big map diff. It must be an array');
    }

    const eltFormat = diff.map(({ key, value }) => ({ args: [key, value] }));

    return this.bigMap.Execute(eltFormat, semantics);
  }

  ExecuteOnBigMapValue(key: any, semantics?: Semantic) {
    if (!this.bigMap) {
      throw new Error('No big map schema');
    }

    return this.bigMap.ValueSchema.Execute(key, semantics);
  }

  EncodeBigMapKey(key: string) {
    if (!this.bigMap) {
      throw new Error('No big map schema');
    }

    try {
      return this.bigMap.KeySchema.ToBigMapKey(key);
    } catch (ex) {
      throw new Error('Unable to encode big map key: ' + ex);
    }
  }

  Encode(_value?: any) {
    try {
      return this.root.EncodeObject(_value);
    } catch (ex) {
      if (ex instanceof TokenValidationError) {
        throw ex;
      }

      throw new Error(`Unable to encode storage object. ${ex}`);
    }
  }

  ExtractSchema() {
    return this.removeTopLevelAnnotation(this.root.ExtractSchema());
  }

  /**
   * @deprecated
   */
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
