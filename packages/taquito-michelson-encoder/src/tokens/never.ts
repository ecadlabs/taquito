import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

export class NeverTokenError extends TokenValidationError {
  name = 'NeverTokenError';
  constructor(public value: any, public token: NeverToken, message: string) {
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
  public Encode(args: any[]): any {
    const val = args.pop();
    throw new NeverTokenError(val, this, 'Assigning a value to the type never is forbidden.');
  }
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    if (semantic && semantic[NeverToken.prim]) {
      return semantic[NeverToken.prim](val);
    }
    throw new NeverTokenError(val, this, 'Assigning a value to the type never is forbidden.');
  }
  public Execute(val: any) {
    throw new NeverTokenError(val, this, 'There is no literal value for the type never.');
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return NeverToken.prim;
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
