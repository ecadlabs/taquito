import { MichelsonV1Expression, MichelsonV1ExpressionExtended, ScriptResponse } from '@taquito/rpc';
import { BigMapToken } from '../tokens/bigmap';
import { createToken } from '../tokens/createToken';
import { OrToken } from '../tokens/or';
import { PairToken } from '../tokens/pair';
import { BigMapKeyType, Semantic, Token, TokenValidationError } from '../tokens/token';
import { RpcTransaction } from './model';
import { Falsy } from './types';

const schemaTypeSymbol = Symbol.for('taquito-schema-type-symbol');

// collapse comb pair
function collapse(val: Token['val'] | any[], prim: string = PairToken.prim): Token['val'] {
  if (Array.isArray(val)) {
    return collapse(
      {
        prim: prim,
        args: val,
      },
      prim
    );
  }
  if (val.prim === prim && val.args && val.args.length > 2) {
    return {
      ...val,
      args: [
        val.args![0],
        {
          prim: prim,
          args: val.args?.slice(1),
        },
      ],
    };
  }
  return val;
}

function deepEqual(a: Token['val'] | any[], b: Token['val'] | any[]): boolean {
  const ac = collapse(a);
  const bc = collapse(b);
  return (
    ac.prim === bc.prim &&
    ((ac.args === undefined && bc.args === undefined) ||
      (ac.args !== undefined &&
        bc.args !== undefined &&
        ac.args.length === bc.args.length &&
        ac.args.every((v, i) => deepEqual(v, bc.args?.[i])))) &&
    ((ac.annots === undefined && bc.annots === undefined) ||
      (ac.annots !== undefined &&
        bc.annots !== undefined &&
        ac.annots.length === bc.annots.length &&
        ac.annots.every((v, i) => v === bc.annots?.[i])))
  );
}

/**
 * @warn Our current smart contract abstraction feature is currently in preview. It's API is not final, and it may not cover every use case (yet). We will greatly appreciate any feedback on this feature.
 */
export class Schema {
  private root: Token;

  public [schemaTypeSymbol] = true;

  public static isSchema(obj: any): obj is Schema {
    return obj && obj[schemaTypeSymbol] === true;
  }

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

  constructor(readonly val: MichelsonV1Expression) {
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

  Typecheck(val: any) {
    if (this.root instanceof BigMapToken && Number.isInteger(Number(val))) {
      return true;
    }
    try {
      this.root.EncodeObject(val);
      return true;
    } catch (ex) {
      return false;
    }
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

  EncodeBigMapKey(key: BigMapKeyType) {
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

  /**
   * @description Look up in top-level pairs of the storage to find a value matching the specified type
   *
   * @returns The first value found that match the type or `undefined` if no value is found
   *
   * @param storage storage to parse to find the value
   * @param valueType type of value to look for
   *
   */
  FindFirstInTopLevelPair<T extends MichelsonV1Expression>(storage: any, valueType: any) {
    return this.findValue(this.root['val'], storage, valueType) as T | undefined;
  }

  private findValue(schema: Token['val'] | any[], storage: any, valueToFind: any): any {
    if (deepEqual(valueToFind, schema)) {
      return storage;
    }
    if (Array.isArray(schema) || schema['prim'] === 'pair') {
      const sch = collapse(schema);
      const str = collapse(storage, 'Pair');
      if (sch.args === undefined || str.args === undefined) {
        throw new Error('Tokens have no arguments'); // unlikely
      }
      return (
        this.findValue(sch.args[0], str.args[0], valueToFind) ||
        this.findValue(sch.args[1], str.args[1], valueToFind)
      );
    }
  }

  /**
   * @description Look up the schema to find any occurrence of a particular token.
   *
   * @returns an array of tokens of the specified kind or an empty array if no token was found
   *
   * @param tokenToFind string representing the prim property of the token to find
   *
   * @example
   * ```
   * Useful to find all global constants in a script, an array of GlobalConstantToken is returned:
   *
   * const schema = new Schema(script);
   * const allGlobalConstantTokens = schema.findToken('constant');
   * ```
   *
   */
  findToken(tokenToFind: string): Array<Token> {
    const tokens: Array<Token> = [];
    return this.root.findAndReturnTokens(tokenToFind, tokens);
  }
}
