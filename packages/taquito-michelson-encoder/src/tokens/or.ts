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

  public Execute(val: any): any {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }
    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

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
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

    if (String(leftToken.annot()) === String(label) && !(leftToken instanceof OrToken)) {
      return { prim: 'Left', args: [leftToken.Encode(args.slice(0, args.length - 1))] };
    } else if (String(rightToken.annot()) === String(label) && !(rightToken instanceof OrToken)) {
      return { prim: 'Right', args: [rightToken.Encode(args.slice(0, args.length - 1))] };
    } else {
      if (leftToken instanceof OrToken) {
        let val = leftToken.Encode(args);
        if (val) {
          return { prim: 'Left', args: [val] };
        }
      }

      if (rightToken instanceof OrToken) {
        let val = rightToken.Encode(args);
        if (val) {
          return { prim: 'Right', args: [val] };
        }
      }
      return null;
    }
  }

  public ExtractSchema(): { [key: string]: any } {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;

    let leftValue;
    if (leftToken instanceof OrToken) {
      leftValue = leftToken.ExtractSchema();
      keyCount = Object.keys(leftValue).length;
    } else {
      leftValue = { [leftToken.annot()]: leftToken.ExtractSchema() };
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

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
