import { Token, TokenFactory, Semantic } from './token';

export class OrToken extends Token {
  static prim = 'or';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
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
      args.pop();
      return { prim: 'Left', args: [leftToken.Encode(args)] };
    } else if (String(rightToken.annot()) === String(label) && !(rightToken instanceof OrToken)) {
      args.pop();
      return { prim: 'Right', args: [rightToken.Encode(args)] };
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

  public ExtractSignature(): any {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

    const newSig = [];

    if (leftToken instanceof OrToken) {
      newSig.push(...leftToken.ExtractSignature());
    } else {
      for (const sig of leftToken.ExtractSignature()) {
        newSig.push([leftToken.annot(), ...sig]);
      }
    }

    if (rightToken instanceof OrToken) {
      newSig.push(...rightToken.ExtractSignature());
    } else {
      for (const sig of rightToken.ExtractSignature()) {
        newSig.push([rightToken.annot(), ...sig]);
      }
    }

    return newSig;
  }

  public EncodeObject(args: any): any {
    const label = Object.keys(args)[0];

    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

    if (String(leftToken.annot()) === String(label) && !(leftToken instanceof OrToken)) {
      return { prim: 'Left', args: [leftToken.EncodeObject(args[label])] };
    } else if (String(rightToken.annot()) === String(label) && !(rightToken instanceof OrToken)) {
      return { prim: 'Right', args: [rightToken.EncodeObject(args[label])] };
    } else {
      if (leftToken instanceof OrToken) {
        let val = leftToken.EncodeObject(args);
        if (val) {
          return { prim: 'Left', args: [val] };
        }
      }

      if (rightToken instanceof OrToken) {
        let val = rightToken.EncodeObject(args);
        if (val) {
          return { prim: 'Right', args: [val] };
        }
      }
      return null;
    }
  }

  public Execute(val: any, semantics?: Semantic): any {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }
    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

    if (val.prim === 'Right') {
      return rightToken.Execute(val.args[0], semantics);
    } else if (val.prim === 'Left') {
      return {
        [leftToken.annot()]: leftToken.Execute(val.args[0], semantics),
      };
    } else {
      throw new Error(`Was expecting Left or Right prim but got: ${val.prim}`);
    }
  }

  private traversal(
    getLeftValue: (token: Token) => any,
    getRightValue: (token: Token) => any,
    concat: (left: any, right: any) => any
  ) {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    let leftValue;
    if (leftToken instanceof OrToken && !leftToken.hasAnnotations()) {
      leftValue = getLeftValue(leftToken);
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    } else {
      leftValue = { [leftToken.annot()]: getLeftValue(leftToken) };
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);
    let rightValue;
    if (rightToken instanceof OrToken && !rightToken.hasAnnotations()) {
      rightValue = getRightValue(rightToken);
    } else {
      rightValue = { [rightToken.annot()]: getRightValue(rightToken) };
    }

    const res = concat(leftValue, rightValue);

    return res;
  }
  public ExtractSchema(): any {
    return this.traversal(
      leftToken => leftToken.ExtractSchema(),
      rightToken => rightToken.ExtractSchema(),
      (leftValue, rightValue) => ({
        ...leftValue,
        ...rightValue,
      })
    );
  }
}
