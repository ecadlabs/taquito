import { MichelsonMap } from '../michelson-map';
import { MapTokenSchema } from '../schema/types';
import {
  ComparableToken,
  Semantic,
  SemanticEncoding,
  Token,
  TokenFactory,
  TokenValidationError,
} from './token';

export class MapValidationError extends TokenValidationError {
  name = 'MapValidationError';
  constructor(public value: any, public token: MapToken, message: string) {
    super(value, token, message);
  }
}

export class MapToken extends Token {
  static prim: 'map' = 'map';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  get ValueSchema() {
    return this.createToken(this.val.args[1], 0);
  }

  get KeySchema(): ComparableToken {
    return this.createToken(this.val.args[0], 0) as any;
  }

  private isValid(value: any): MapValidationError | null {
    if (MichelsonMap.isMichelsonMap(value)) {
      return null;
    }

    return new MapValidationError(value, this, 'Value must be a MichelsonMap');
  }

  public Execute(val: any[], semantics?: Semantic): { [key: string]: any } {
    const map = new MichelsonMap(this.val);

    val.forEach((current) => {
      map.set(
        this.KeySchema.ToKey(current.args[0]),
        this.ValueSchema.Execute(current.args[1], semantics)
      );
    });
    return map;
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

    if (semantic && semantic[MapToken.prim]) {
      return semantic[MapToken.prim](val);
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

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return {
      map: {
        key: this.KeySchema.ExtractSchema(),
        value: this.ValueSchema.ExtractSchema(),
      },
    };
  }

  generateSchema(): MapTokenSchema {
    return {
      __michelsonType: MapToken.prim,
      schema: {
        key: this.KeySchema.generateSchema(),
        value: this.ValueSchema.generateSchema(),
      },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (MapToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.KeySchema.findAndReturnTokens(tokenToFind, tokens);
    this.ValueSchema.findAndReturnTokens(tokenToFind, tokens);
    return tokens;
  }
}
