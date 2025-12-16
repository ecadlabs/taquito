import { ListTokenSchema } from '../schema/types';
import { Token, TokenFactory, Semantic, TokenValidationError, SemanticEncoding } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a List
 */
export class ListValidationError extends TokenValidationError {
  name = 'ListValidationError';
  constructor(public value: any, public token: ListToken, message: string) {
    super(value, token, message);
  }
}

export class ListToken extends Token {
  static prim: 'list' = 'list' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  get valueSchema() {
    return this.createToken(this.val.args[0], this.idx);
  }

  /**
   * @throws {@link ListValidationError}
   */
  private validate(value: any) {
    if (!Array.isArray(value)) {
      throw new ListValidationError(
        value,
        this,
        `Value ${JSON.stringify(value)} is not a valid array`
      );
    }
  }

  /**
   * @throws {@link ListValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    const schema = this.createToken(this.val.args[0], 0);
    return val.reduce((prev: any, current: any) => {
      return [...prev, schema.EncodeObject(current)];
    }, []);
  }

  /**
   * @throws {@link ListValidationError}
   */
  public Execute(val: any, semantics?: Semantic) {
    const schema = this.createToken(this.val.args[0], 0);

    this.validate(val);

    return val.reduce((prev: any, current: any) => {
      return [...prev, schema.Execute(current, semantics)];
    }, []);
  }

  /**
   * @throws {@link ListValidationError}
   */
  public EncodeObject(args: any, semantic?: SemanticEncoding): any {
    const schema = this.createToken(this.val.args[0], 0);

    this.validate(args);

    if (semantic && semantic[ListToken.prim]) {
      return semantic[ListToken.prim](args);
    }

    return args.reduce((prev: any, current: any) => {
      return [...prev, schema.EncodeObject(current)];
    }, []);
  }

  generateSchema(): ListTokenSchema {
    return {
      __michelsonType: ListToken.prim,
      schema: this.valueSchema.generateSchema(),
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (ListToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.createToken(this.val.args[0], this.idx).findAndReturnTokens(tokenToFind, tokens);
    return tokens;
  }
}
