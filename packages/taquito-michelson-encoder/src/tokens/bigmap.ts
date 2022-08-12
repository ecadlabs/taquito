import { MichelsonMap } from '../michelson-map';
import { BigMapTokenSchema } from '../schema/types';
import {
  ComparableToken,
  Semantic,
  SemanticEncoding,
  Token,
  TokenFactory,
  TokenValidationError,
} from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing Big Map types
 */
export class BigMapValidationError extends TokenValidationError {
  name = 'BigMapValidationError';
  constructor(public value: any, public token: BigMapToken, message: string) {
    super(value, token, message);
  }
}

export class BigMapToken extends Token {
  static prim: 'big_map' = 'big_map';
  constructor(
    protected val: { prim: string; args: any[]; annots?: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  get ValueSchema() {
    return this.createToken(this.val.args[1], 0);
  }

  get KeySchema(): ComparableToken {
    return this.createToken(this.val.args[0], 0) as unknown as ComparableToken;
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return {
      big_map: {
        key: this.KeySchema.ExtractSchema(),
        value: this.ValueSchema.ExtractSchema(),
      },
    };
  }

  generateSchema(): BigMapTokenSchema {
    return {
      __michelsonType: BigMapToken.prim,
      schema: {
        key: this.KeySchema.generateSchema(),
        value: this.ValueSchema.generateSchema(),
      },
    };
  }

  private isValid(value: any): BigMapValidationError | null {
    if (MichelsonMap.isMichelsonMap(value)) {
      return null;
    }

    return new BigMapValidationError(value, this, 'Value must be a MichelsonMap');
  }

  private objLitToMichelsonMap(val: any): any {
    if (val instanceof MichelsonMap) return val;
    if (typeof val === 'object') {
      if (Object.keys(val).length === 0) {
        return new MichelsonMap();
      } else {
        return MichelsonMap.fromLiteral(val);
      }
    }
    return val;
  }

  public Encode(args: any[]): any {
    const val: MichelsonMap<any, any> = this.objLitToMichelsonMap(args.pop());

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return Array.from(val.keys())
      .sort((a: any, b: any) => this.KeySchema.compare(a, b))
      .map((key) => {
        return {
          prim: 'Elt',
          args: [this.KeySchema.EncodeObject(key), this.ValueSchema.EncodeObject(val.get(key))],
        };
      });
  }

  public EncodeObject(args: any, semantic?: SemanticEncoding): any {
    const val: MichelsonMap<any, any> = this.objLitToMichelsonMap(args);

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    if (semantic && semantic[BigMapToken.prim]) {
      return semantic[BigMapToken.prim](val, this.val);
    }

    return Array.from(val.keys())
      .sort((a: any, b: any) => this.KeySchema.compare(a, b))
      .map((key) => {
        return {
          prim: 'Elt',
          args: [this.KeySchema.EncodeObject(key), this.ValueSchema.EncodeObject(val.get(key))],
        };
      });
  }

  public TypecheckValue(val: unknown) {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }
  }

  public Execute(val: any[] | { int: string }, semantic?: Semantic) {
    if (semantic && semantic[BigMapToken.prim]) {
      return semantic[BigMapToken.prim](val as any, this.val);
    }

    if (Array.isArray(val)) {
      // Athens is returning an empty array for big map in storage
      // Internal: In taquito v5 it is still used to decode big map diff (as if they were a regular map)
      const map = new MichelsonMap(this.val);
      val.forEach((current) => {
        map.set(this.KeySchema.ToKey(current.args[0]), this.ValueSchema.Execute(current.args[1]));
      });
      return map;
    } else if ('int' in val) {
      // Babylon is returning an int with the big map id in contract storage
      return val.int;
    } else {
      throw new BigMapValidationError(
        val,
        this,
        `Big map is expecting either an array (Athens) or an object with an int property (Babylon). Got ${JSON.stringify(
          val
        )}`
      );
    }
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (BigMapToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.KeySchema.findAndReturnTokens(tokenToFind, tokens);
    this.ValueSchema.findAndReturnTokens(tokenToFind, tokens);
    return tokens;
  }
}
