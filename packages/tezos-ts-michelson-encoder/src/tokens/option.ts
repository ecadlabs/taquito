import { Token, TokenFactory } from "./token";

export class OptionToken extends Token {
  static prim = "option";

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any) {
    const schema = this.createToken(this.val.args[0], 0);
    return schema.Execute(val.args[0]);
  }

  public ExtractSchema() {
    return OptionToken.prim;
  }
}
