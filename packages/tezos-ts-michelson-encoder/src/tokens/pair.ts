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
    let keyCount = 1;
    if (leftToken instanceof PairToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

    return {
      prim: 'Pair',
      args: [leftToken.Encode(args), rightToken.Encode(args)],
    };
  }

  public Execute(val: any): { [key: string]: any } {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    let leftValue;
    if (leftToken instanceof PairToken) {
      leftValue = leftToken.Execute(val.args[0]);
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    } else {
      leftValue = { [leftToken.annot()]: leftToken.Execute(val.args[0]) };
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);
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
    let keyCount = 1;

    let leftValue;
    if (leftToken instanceof PairToken) {
      leftValue = leftToken.ExtractSchema();
      keyCount = Object.keys(leftValue).length;
    } else {
      leftValue = { [leftToken.annot()]: leftToken.ExtractSchema() };
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

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
