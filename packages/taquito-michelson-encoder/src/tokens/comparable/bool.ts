import { Token, TokenFactory, ComparableToken } from '../token';

export class BoolToken extends ComparableToken {
  static prim = 'bool';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): boolean {
    return String(val.prim).toLowerCase() === 'true' ? true : false;
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return { prim: val ? 'True' : 'False' };
  }

  public EncodeObject(val: any) {
    return { prim: val ? 'True' : 'False' };
  }

  public ExtractSchema() {
    return BoolToken.prim;
  }

  ToBigMapKey(val: string): { key: { [key: string]: string }; type: { prim: string } } {
    return {
      key: this.EncodeObject(val),
      type: { prim: BoolToken.prim },
    };
  }

  ToKey(val: string) {
    return this.EncodeObject(val);
  }

  compare(val1: any, val2: any) {
    if ((val1 && val2) || (!val1 && !val2)) {
      return 0;
    } else if (val1) {
      return 1;
    } else {
      return -1;
    }
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (BoolToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  };

}
