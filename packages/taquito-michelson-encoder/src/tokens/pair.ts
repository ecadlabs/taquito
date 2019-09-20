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

  private traversal(getLeftValue: (token: Token) => any, getRightValue: (token: Token) => any) {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    let leftValue;
    if (leftToken instanceof PairToken && !leftToken.hasAnnotations()) {
      leftValue = getLeftValue(leftToken);
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    } else {
      leftValue = { [leftToken.annot()]: getLeftValue(leftToken) };
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);
    let rightValue;
    if (rightToken instanceof PairToken && !rightToken.hasAnnotations()) {
      rightValue = getRightValue(rightToken);
    } else {
      rightValue = { [rightToken.annot()]: getRightValue(rightToken) };
    }

    const res = {
      ...leftValue,
      ...rightValue,
    };

    return res;
  }

  public Execute(val: any): { [key: string]: any } {
    return this.traversal(
      leftToken => leftToken.Execute(val.args[0]),
      rightToken => rightToken.Execute(val.args[1])
    );
  }

  public ExtractSchema(): any {
    return this.traversal(
      leftToken => leftToken.ExtractSchema(),
      rightToken => rightToken.ExtractSchema()
    );
  }
}
