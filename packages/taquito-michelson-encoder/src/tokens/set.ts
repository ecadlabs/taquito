import { SetTokenSchema } from '../schema/types';
import {
  Token,
  TokenFactory,
  Semantic,
  TokenValidationError,
  ComparableToken,
  SemanticEncoding,
} from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Set
 */
export class SetValidationError extends TokenValidationError {
  name = 'SetValidationError';
  constructor(
    public value: any,
    public token: SetToken,
    message: string
  ) {
    super(value, token, message);
  }
}

export class SetToken extends Token {
  static prim: 'set' = 'set' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  get KeySchema(): ComparableToken {
    return this.createToken(this.val.args[0], 0) as any;
  }

  /**
   * @throws {@link SetValidationError}
   */
  private validate(value: any) {
    if (!Array.isArray(value)) {
      throw new SetValidationError(value, this, `Value ${JSON.stringify(value)} is not an array`);
    }
  }

  /**
   * @throws {@link SetValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    return val
      .sort((a: any, b: any) => this.KeySchema.compare(a, b))
      .reduce((prev: any, current: any) => {
        return [...prev, this.KeySchema.EncodeObject(current)];
      }, []);
  }

  public Execute(val: any, semantics?: Semantic) {
    return val.reduce((prev: any, current: any) => {
      return [...prev, this.KeySchema.Execute(current, semantics)];
    }, []);
  }

  /**
   * @throws {@link SetValidationError}
   */
  public EncodeObject(args: any, semantic?: SemanticEncoding): any {
    this.validate(args);

    if (semantic && semantic[SetToken.prim]) {
      return semantic[SetToken.prim](args);
    }

    return args
      .sort((a: any, b: any) => this.KeySchema.compare(a, b))
      .reduce((prev: any, current: any) => {
        return [...prev, this.KeySchema.EncodeObject(current)];
      }, []);
  }

  generateSchema(): SetTokenSchema {
    return {
      __michelsonType: SetToken.prim,
      schema: this.KeySchema.generateSchema(),
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (SetToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.KeySchema.findAndReturnTokens(tokenToFind, tokens);
    return tokens;
  }
}
