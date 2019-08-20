import { Token, TokenFactory } from "../token";

export class BoolToken extends Token {
  static prim = "bool";

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): { [key: string]: any } {
    return val.prim;
  }

  public ExtractSchema() {
    return BoolToken.prim;
  }
}
