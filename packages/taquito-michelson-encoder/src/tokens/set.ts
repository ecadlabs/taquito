import { Token, TokenFactory, Semantic, TokenValidationError, ComparableToken } from './token';

export class SetValidationError extends TokenValidationError {
  name: string = 'SetValidationError';
  constructor(public value: any, public token: SetToken, message: string) {
    super(value, token, message);
  }
}

export class SetToken extends Token {
  static prim = 'set';

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

  private isValid(value: any): SetValidationError | null {
    if (Array.isArray(value)) {
      return null;
    }

    return new SetValidationError(value, this, 'Value must be an array');
  }

  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

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

  public EncodeObject(args: any): any {
    const err = this.isValid(args);
    if (err) {
      throw err;
    }

    return args
      .sort((a: any, b: any) => this.KeySchema.compare(a, b))
      .reduce((prev: any, current: any) => {
        return [...prev, this.KeySchema.EncodeObject(current)];
      }, []);
  }

  public ExtractSchema() {
    return SetToken.prim;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (SetToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.KeySchema.findAndReturnTokens(tokenToFind, tokens);
    return tokens;
  };

}
