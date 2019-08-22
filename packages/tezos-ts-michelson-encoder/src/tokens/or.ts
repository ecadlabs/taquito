import { Token, TokenFactory } from './token';

export class OrToken extends Token {
  static prim = 'or';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any) {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    const rightToken = this.createToken(this.val.args[1], this.idx + 1);

    if (val.prim === 'Right') {
      return rightToken.Execute(val.args[0]);
    } else {
      return {
        [leftToken.annot]: leftToken.Execute(val.args[0]),
      };
    }
  }

  public ExtractSchema(): { [key: string]: any } {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    const rightToken = this.createToken(this.val.args[1], this.idx + 1);

    let leftValue;
    if (leftToken instanceof OrToken) {
      leftValue = leftToken.ExtractSchema();
    } else {
      leftValue = { [leftToken.annot]: leftToken.ExtractSchema() };
    }

    let rightValue;
    if (rightToken instanceof OrToken) {
      rightValue = rightToken.ExtractSchema();
    } else {
      rightValue = { [rightToken.annot]: rightToken.ExtractSchema() };
    }

    return {
      ...leftValue,
      ...rightValue,
    };
  }
}
