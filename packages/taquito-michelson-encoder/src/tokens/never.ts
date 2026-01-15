import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Never Token
 */
export class NeverTokenError extends TokenValidationError {
  name = 'NeverTokenError';
  constructor(
    public value: any,
    public token: NeverToken,
    message: string
  ) {
    super(value, token, message);
  }
}

export class NeverToken extends Token {
  static prim: 'never' = 'never' as const;
  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  /**
   * @throws {@link NeverTokenError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();
    throw new NeverTokenError(
      val,
      this,
      `Assigning a value to the type never is forbidden. Trying to assign ${JSON.stringify(val)}.`
    );
  }

  /**
   * @throws {@link NeverTokenError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    if (semantic && semantic[NeverToken.prim]) {
      return semantic[NeverToken.prim](val);
    }
    throw new NeverTokenError(
      val,
      this,
      `Assigning a value to the type never is forbidden. Trying to assign ${JSON.stringify(val)}.`
    );
  }

  /**
   * @throws {@link NeverTokenError}
   */
  public Execute(val: any) {
    throw new NeverTokenError(
      val,
      this,
      `There is no literal value for the type never. Trying to execute ${JSON.stringify(val)}.`
    );
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: NeverToken.prim,
      schema: NeverToken.prim,
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (NeverToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
