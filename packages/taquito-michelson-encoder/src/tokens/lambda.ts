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

  get paramSchema() {
    return this.createToken(this.val.args[0], this.idx);
  }

  get returnSchema() {
    return this.createToken(this.val.args[1], this.idx + 1);
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
    return {
      [LambdaToken.prim]: {
        parameters: this.paramSchema.ExtractSchema(),
        returns: this.returnSchema.ExtractSchema(),
      },
    };
  }

  generateSchema() {
    return {
      __michelsonType: LambdaToken.prim,
      schema: {
        parameters: this.paramSchema.generateSchema(),
        returns: this.returnSchema.generateSchema(),
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
