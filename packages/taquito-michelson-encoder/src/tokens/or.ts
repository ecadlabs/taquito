import { TokenSchema } from '../schema/types';
import { Token, TokenFactory, Semantic, ComparableToken } from './token';

export class OrToken extends ComparableToken {
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
        const val = leftToken.Encode(args);
        if (val) {
          return { prim: 'Left', args: [val] };
        }
      }

      if (rightToken instanceof OrToken) {
        const val = rightToken.Encode(args);
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
        const val = leftToken.EncodeObject(args);
        if (val) {
          return { prim: 'Left', args: [val] };
        }
      }

      if (rightToken instanceof OrToken) {
        const val = rightToken.EncodeObject(args);
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
      if (rightToken instanceof OrToken) {
        return rightToken.Execute(val.args[0], semantics);
      } else {
        return {
          [rightToken.annot()]: rightToken.Execute(val.args[0], semantics),
        };
      }
    } else if (val.prim === 'Left') {
      if (leftToken instanceof OrToken) {
        return leftToken.Execute(val.args[0], semantics);
      }
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
      (leftToken) => leftToken.ExtractSchema(),
      (rightToken) => rightToken.ExtractSchema(),
      (leftValue, rightValue) => ({
        ...leftValue,
        ...rightValue,
      })
    );
  }

  generateSchema(): TokenSchema {
    return {
      __michelsonType: OrToken.prim,
      schema: this.traversal(
        (leftToken) => {
          if (leftToken instanceof OrToken && !leftToken.hasAnnotations()) {
            return leftToken.generateSchema().schema;
          } else {
            return leftToken.generateSchema();
          }
        },
        (rightToken) => {
          if (rightToken instanceof OrToken && !rightToken.hasAnnotations()) {
            return rightToken.generateSchema().schema;
          } else {
            return rightToken.generateSchema();
          }
        },
        (leftValue, rightValue) => ({
          ...leftValue,
          ...rightValue,
        })
      ),
    };
  }

  private findToken(label: any): Token | null {
    const leftToken = this.createToken(this.val.args[0], this.idx);
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(this.val.args[1], this.idx + keyCount);

    if (
      String(leftToken.annot()) === String(label) &&
      !(leftToken instanceof OrToken) &&
      leftToken instanceof ComparableToken
    ) {
      return leftToken;
    } else if (
      String(rightToken.annot()) === String(label) &&
      !(rightToken instanceof OrToken) &&
      rightToken instanceof ComparableToken
    ) {
      return rightToken;
    } else {
      if (leftToken instanceof OrToken) {
        const tok = leftToken.findToken(label);
        if (tok) {
          return tok;
        }
      }

      if (rightToken instanceof OrToken) {
        const tok = rightToken.findToken(label);
        if (tok) {
          return tok;
        }
      }
      return null;
    }
  }

  compare(val1: any, val2: any): any {
    const labelVal1 = Object.keys(val1)[0];
    const labelVal2 = Object.keys(val2)[0];

    if (labelVal1 === labelVal2) {
      const token = this.findToken(labelVal1);
      if (token instanceof ComparableToken) {
        return token.compare(val1[labelVal1], val2[labelVal1]);
      }
    } else {
      const encoded1 = JSON.stringify(this.EncodeObject(val1));
      const encoded2 = JSON.stringify(this.EncodeObject(val2));
      return encoded1 < encoded2 ? -1 : 1;
    }
  }

  public ToKey(val: any) {
    return this.Execute(val);
  }

  public ToBigMapKey(val: any) {
    return {
      key: this.EncodeObject(val),
      type: this.typeWithoutAnnotations(),
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (OrToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.traversal(
      (leftToken) => leftToken.findAndReturnTokens(tokenToFind, tokens),
      (rightToken) => rightToken.findAndReturnTokens(tokenToFind, tokens),
      (leftValue, rightValue) => ({
        ...leftValue,
        ...rightValue,
      })
    );
    return tokens;
  }
}
