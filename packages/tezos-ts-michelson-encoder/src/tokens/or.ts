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
        [leftToken.annot()]: leftToken.Execute(val.args[0]),
      };
    }
  }

  public Encode(args: any[]): any {
    const label = args[args.length - 1];

    const leftToken = this.createToken(this.val.args[0], this.idx);
    const rightToken = this.createToken(this.val.args[1], this.idx + 1);
    if (String(leftToken.annot()) === String(label)) {
      return { prim: 'Left', args: [leftToken.Encode(args.slice(0, args.length - 1))] };
    } else if (String(rightToken.annot()) === String(label)) {
      return { prim: 'Right', args: [rightToken.Encode(args.slice(0, args.length - 1))] };
    } else {
      return { prim: 'Right', args: [rightToken.Encode(args)] };
    }
  }

  public ExtractSchema(): { [key: string]: any } {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    const rightToken = this.createToken(this.val.args[1], this.idx + 1);

    let leftValue;
    if (leftToken instanceof OrToken) {
      leftValue = leftToken.ExtractSchema();
    } else {
      leftValue = { [leftToken.annot()]: leftToken.ExtractSchema() };
    }

    let rightValue;
    if (rightToken instanceof OrToken) {
      rightValue = rightToken.ExtractSchema();
    } else {
      rightValue = { [rightToken.annot()]: rightToken.ExtractSchema() };
    }

    return {
      ...leftValue,
      ...rightValue,
    };
  }
}
