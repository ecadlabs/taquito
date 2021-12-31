import { Token, TokenFactory } from './token';

export class OperationToken extends Token {
  static prim = 'operation';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): { [key: string]: any } {
    return val.string;
  }

  public Encode(...args: any[]): any {
    const val = args.pop();
    return { string: val };
  }

  public EncodeObject(val: any): any {
    return { string: val };
  }

  public ExtractSchema() {
    return OperationToken.prim;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (OperationToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  };

}
