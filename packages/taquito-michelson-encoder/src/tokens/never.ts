import { Token, TokenFactory, TokenValidationError } from './token';

export class NeverTokenError extends TokenValidationError {
  name = 'NeverTokenError';
  constructor(public value: any, public token: NeverToken, message: string) {
    super(value, token, message);
  }
}

export class NeverToken extends Token {
  static prim = 'never';
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
  public EncodeObject(val: any): any {
    throw new NeverTokenError(val, this, 'Assigning a value to the type never is forbidden.');
  }
  public Execute(val: any) {
    throw new NeverTokenError(val, this, 'There is no literal value for the type never.');
  }
  public ExtractSchema() {
    return NeverToken.prim;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (NeverToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
