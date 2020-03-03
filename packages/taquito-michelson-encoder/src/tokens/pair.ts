import { Token, TokenFactory, Semantic, ComparableToken } from './token';
import { OrToken } from './or';

export class PairToken extends ComparableToken {
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

  public ExtractSignature(): any {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

    const newSig = [];

    for (const leftSig of leftToken.ExtractSignature()) {
      for (const rightSig of rightToken.ExtractSignature()) {
        newSig.push([...leftSig, ...rightSig]);
      }
    }

    return newSig;
  }

  public ToBigMapKey(val: any) {
    return {
      key: this.EncodeObject(val),
      type: this.typeWithoutAnnotations(),
    };
  }

  public ToKey(val: any) {
    return this.Execute(val);
  }

  public EncodeObject(args: any): any {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    if (leftToken instanceof PairToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

    let leftValue;
    if (leftToken instanceof PairToken && !leftToken.hasAnnotations()) {
      leftValue = args;
    } else {
      leftValue = args[leftToken.annot()];
    }

    let rightValue;
    if (rightToken instanceof PairToken && !rightToken.hasAnnotations()) {
      rightValue = args;
    } else {
      rightValue = args[rightToken.annot()];
    }

    return {
      prim: 'Pair',
      args: [leftToken.EncodeObject(leftValue), rightToken.EncodeObject(rightValue)],
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

  public Execute(val: any, semantics?: Semantic): { [key: string]: any } {
    return this.traversal(
      leftToken => leftToken.Execute(val.args[0], semantics),
      rightToken => rightToken.Execute(val.args[1], semantics)
    );
  }

  public ExtractSchema(): any {
    return this.traversal(
      leftToken => leftToken.ExtractSchema(),
      rightToken => rightToken.ExtractSchema()
    );
  }

  public compare(val1: any, val2: any) {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    if (leftToken instanceof PairToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

    const getValue = (token: Token, args: any) => {
      if (token instanceof PairToken && !token.hasAnnotations()) {
        return args;
      } else {
        return args[token.annot()];
      }
    };

    if (leftToken instanceof ComparableToken && rightToken instanceof ComparableToken) {
      const result: number = leftToken.compare(
        getValue(leftToken, val1),
        getValue(leftToken, val2)
      );

      if (result === 0) {
        return rightToken.compare(getValue(rightToken, val1), getValue(rightToken, val2));
      }

      return result;
    }

    throw new Error('Not a comparable pair');
  }
}
