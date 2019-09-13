import { Token, TokenFactory } from './token';
import { OrToken } from './or';

export class PairToken extends Token {
  static prim = 'pair';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Encode(args: any[]): any {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    const rightToken = this.createToken(this.val.args[1], this.idx + 1);

    return {
      prim: 'Pair',
      args: [leftToken.Encode(args), rightToken.Encode(args)],
    };
  }

  public Execute(val: any): { [key: string]: any } {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    const rightToken = this.createToken(this.val.args[1], this.idx + 1);

    let leftValue;
    if (leftToken instanceof PairToken) {
      leftValue = leftToken.Execute(val.args[0]);
    } else {
      leftValue = { [leftToken.annot()]: leftToken.Execute(val.args[0]) };
    }

    let rightValue;
    if (rightToken instanceof PairToken) {
      rightValue = rightToken.Execute(val.args[1]);
    } else {
      rightValue = { [rightToken.annot()]: rightToken.Execute(val.args[1]) };
    }

    const res = {
      ...leftValue,
      ...rightValue,
    };
    return res;
  }

  public ExtractSchema(): any {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    const rightToken = this.createToken(this.val.args[1], this.idx + 1);

    let leftValue;
    if (leftToken instanceof PairToken) {
      leftValue = leftToken.ExtractSchema();
    } else {
      leftValue = { [leftToken.annot()]: leftToken.ExtractSchema() };
    }

    let rightValue;
    if (rightToken instanceof PairToken) {
      rightValue = rightToken.ExtractSchema();
    } else {
      rightValue = { [rightToken.annot()]: rightToken.ExtractSchema() };
    }

    const res = {
      ...leftValue,
      ...rightValue,
    };
    return res;
  }
}
