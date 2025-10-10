import {
  MichelsonV1Expression,
  MichelsonV1ExpressionBase,
  MichelsonV1ExpressionExtended,
  ScriptResponse,
} from '@taquito/rpc';
import { BigMapToken } from '../tokens/bigmap';
import { createToken } from '../tokens/createToken';
import { MapToken } from '../tokens/map';
import { OrToken } from '../tokens/or';
import { PairToken } from '../tokens/pair';
import { TicketToken } from '../tokens/ticket';
import { TicketDeprecatedToken } from '../tokens/ticket-deprecated';
import {
  BigMapKeyType,
  Semantic,
  SemanticEncoding,
  Token,
  TokenValidationError,
} from '../tokens/token';
import {
  InvalidRpcResponseError,
  InvalidBigMapSchemaError,
  InvalidBigMapDiffError,
  BigMapEncodingError,
  StorageEncodingError,
  MissingArgumentError,
} from './errors';
import { RpcTransaction } from './model';
import { TokenSchema } from './types';

const schemaTypeSymbol = Symbol.for('taquito-schema-type-symbol');

// collapse comb pair
function collapse(
  val: Token['val'] | MichelsonV1Expression,
  prim: string = PairToken.prim
): Token['val'] {
  if (Array.isArray(val)) {
    return collapse(
      {
        prim: prim,
        args: val,
      },
      prim
    );
  }
  const extended = val as MichelsonV1ExpressionExtended;
  if (extended.prim === prim && extended.args && extended.args.length > 2) {
    return {
      ...extended,
      args: [
        extended.args?.[0],
        {
          prim: prim,
          args: extended.args?.slice(1),
        },
      ],
    };
  }
  return extended;
}

export function deepEqual(
  a: MichelsonV1Expression | undefined,
  b: MichelsonV1Expression | undefined
): boolean {
  if (a === undefined || b === undefined) {
    return a === b;
  }
  const ac = collapse(a);
  const bc = collapse(b);
  return (
    ac.prim === bc.prim &&
    ((ac.args === undefined && bc.args === undefined) ||
      (ac.args !== undefined &&
        bc.args !== undefined &&
        ac.args.length === bc.args.length &&
        ac.args.every((v, i) => deepEqual(v, bc.args?.[i] ?? {})))) &&
    ((ac.annots === undefined && bc.annots === undefined) ||
      (ac.annots !== undefined &&
        bc.annots !== undefined &&
        ac.annots.length === bc.annots.length &&
        ac.annots.every((v, i) => v === bc.annots?.[i])))
  );
}

/**
 * @warn Our current smart contract abstraction feature is currently in preview. Its API is not final, and it may not cover every use case (yet). We will greatly appreciate any feedback on this feature.
 */
export class Schema {
  private root: Token;

  public [schemaTypeSymbol] = true;

  public static isSchema(obj: Schema): boolean {
    return obj && obj[schemaTypeSymbol] === true;
  }

  // TODO: Should we deprecate this?
  private bigMap?: BigMapToken;

  /**
   * @throws {@link InvalidRpcResponseError}
   */
  static fromRPCResponse(val: { script: ScriptResponse }) {
    if (!val) {
      throw new InvalidRpcResponseError(val, 'the RPC response is empty');
    }
    if (!val.script) {
      throw new InvalidRpcResponseError(val, 'the RPC response has no script');
    }
    if (!Array.isArray(val.script.code)) {
      throw new InvalidRpcResponseError(val, 'The response.script.code should be an array');
    }
    let code = val.script.code;
    while (code.length === 1 && Array.isArray(code[0])) {
      code = code[0];
    }
    const storage = code.find(
      (x) => 'prim' in x && x.prim === 'storage'
    ) as MichelsonV1ExpressionExtended;
    if (!storage || !Array.isArray(storage.args)) {
      throw new InvalidRpcResponseError(
        val,
        'The response.script.code has an element of type {prim: "storage"}, but its args is not an array'
      );
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

  /**
   * @description Validates that a value matches the schema type.
   * Performs type checking with special handling for BigMap, Ticket, and nested Map tokens.
   *
   * @param val - The value to validate against the schema
   * @returns Returns true if validation passes, false if validation fails
   */
  Typecheck(val: any) {
    if (this.root instanceof BigMapToken && Number.isInteger(Number(val))) {
      return true;
    }
    if (this.root instanceof TicketToken && val.ticketer && val.value && val.amount) {
      return true;
    }
    if (this.root instanceof TicketDeprecatedToken && val.ticketer && val.value && val.amount) {
      return true;
    }
    if (this.root instanceof MapToken && this.root.ValueSchema instanceof BigMapToken) {
      return true;
    }

    try {
      this.root.EncodeObject(val);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * @throws {@link InvalidBigMapSchemaError}
   * @throws {@link InvalidBigMapDiffError}
   */
  ExecuteOnBigMapDiff(diff: any[], semantics?: Semantic) {
    if (!this.bigMap) {
      throw new InvalidBigMapSchemaError('Big map schema is undefined');
    }

    if (!Array.isArray(diff)) {
      throw new InvalidBigMapDiffError(
        `Big map diff must be an array, got: ${JSON.stringify(diff)}`,
        diff
      );
    }

    const eltFormat = diff.map(({ key, value }) => ({ args: [key, value] }));

    return this.bigMap.Execute(eltFormat, semantics);
  }

  /**
   * @throws {@link InvalidBigMapSchemaError}
   */
  ExecuteOnBigMapValue(key: any, semantics?: Semantic) {
    if (!this.bigMap) {
      throw new InvalidBigMapSchemaError('Big map schema is undefined');
    }

    return this.bigMap.ValueSchema.Execute(key, semantics);
  }

  /**
   * @throws {@link InvalidBigMapSchemaError}
   * @throws {@link BigMapEncodingError}
   */
  EncodeBigMapKey(key: BigMapKeyType) {
    if (!this.bigMap) {
      throw new InvalidBigMapSchemaError('Big map schema is undefined');
    }

    try {
      return this.bigMap.KeySchema.ToBigMapKey(key);
    } catch (ex) {
      throw new BigMapEncodingError('key', ex, this.bigMap.KeySchema, key);
    }
  }

  /**
   * @throws {@link TokenValidationError}
   * @throws {@link StorageEncodingError}
   */
  Encode(value?: any, semantics?: SemanticEncoding) {
    try {
      return this.root.EncodeObject(value, semantics);
    } catch (ex) {
      if (ex instanceof TokenValidationError) {
        throw ex;
      }
      throw new StorageEncodingError('storage object', ex, this.root, value, semantics);
    }
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  ExtractSchema() {
    return this.removeTopLevelAnnotation(this.root.ExtractSchema());
  }

  /**
   * @description Produce a representation of the storage schema.
   * Note: Provide guidance on how to write the storage object for the origination operation with Taquito.
   */
  generateSchema(): TokenSchema {
    return this.removeTopLevelAnnotation(this.root.generateSchema());
  }

  /**
   * @deprecated
   * @throws {@link InvalidBigMapSchemaError}
   */
  ComputeState(tx: RpcTransaction[], state: any) {
    if (!this.bigMap) {
      throw new InvalidBigMapSchemaError('Big map schema is undefined');
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

  // TODO check these type casts
  /**
   * @throws {@link MissingArgumentError}
   */
  private findValue(
    schema: MichelsonV1Expression,
    storage: any,
    valueToFind: any
  ): MichelsonV1ExpressionBase | undefined {
    if (deepEqual(valueToFind, schema)) {
      return storage;
    }
    if (Array.isArray(schema) || (schema as MichelsonV1ExpressionExtended).prim === 'pair') {
      const sch = collapse(schema);
      const strg = collapse(storage, 'Pair');
      if (sch.args === undefined || strg.args === undefined) {
        throw new MissingArgumentError('Tokens have no arguments'); // unlikely
      }
      if (sch.args[0])
        return (
          // unsafe
          this.findValue(sch.args[0] as MichelsonV1ExpressionExtended, strg.args[0], valueToFind) ||
          this.findValue(sch.args[1] as MichelsonV1ExpressionExtended, strg.args[1], valueToFind)
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
