import { Token, TokenFactory } from './token';

export class LambdaToken extends Token {
  static prim = 'lambda';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any) {
    if (val.string) {
      return val.string;
    } else {
      return val;
    }
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return val;
  }

  public EncodeObject(val: any): any {
    return val;
  }

  public ExtractSchema() {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    const rightToken = this.createToken(this.val.args[1], this.idx + 1);
    return {
      [LambdaToken.prim]: {
        parameters: leftToken.ExtractSchema(),
        returns: rightToken.ExtractSchema(),
      },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (LambdaToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.createToken(this.val.args[0], this.idx).findAndReturnTokens(tokenToFind, tokens);
    this.createToken(this.val.args[1], this.idx).findAndReturnTokens(tokenToFind, tokens);
    return tokens;
  }
}
