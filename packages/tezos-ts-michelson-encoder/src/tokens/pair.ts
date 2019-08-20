import { Token, TokenFactory } from "./token";

export class PairToken extends Token {
  static prim = "pair";

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): { [key: string]: any } {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    const rightToken = this.createToken(this.val.args[1], this.idx + 1);

    let rightValue;
    if (rightToken instanceof PairToken) {
      rightValue = rightToken.Execute(val.args[1]);
    } else {
      rightValue = { [rightToken.annot]: rightToken.Execute(val.args[1]) };
    }

    const res = {
      [leftToken.annot]: leftToken.Execute(val.args[0]),
      ...rightValue
    };
    return res;
  }

  public ExtractSchema(): any {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    const rightToken = this.createToken(this.val.args[1], this.idx + 1);

    let rightValue;
    if (rightToken instanceof PairToken) {
      rightValue = rightToken.ExtractSchema();
    } else {
      rightValue = { [rightToken.annot]: rightToken.ExtractSchema() };
    }

    const res = {
      [leftToken.annot]: leftToken.ExtractSchema(),
      ...rightValue
    };
    return res;
  }
}
