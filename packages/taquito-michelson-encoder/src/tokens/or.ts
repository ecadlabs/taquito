import { OrTokenSchema } from '../schema/types';
import {
  Token,
  TokenFactory,
  Semantic,
  ComparableToken,
  SemanticEncoding,
  TokenValidationError,
} from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing an OrToken
 */
export class OrValidationError extends TokenValidationError {
  name = 'OrValidationError';
  constructor(
    public value: any,
    public token: OrToken,
    message: string
  ) {
    super(value, token, message);
  }
}

export class OrToken extends ComparableToken {
  static prim: 'or' = 'or' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory,
    protected parentTokenType?: 'Or' | 'Pair' | 'Other' | undefined
  ) {
    super(val, idx, fac, parentTokenType);
  }

  public Encode(args: any[]): any {
    const label = args[args.length - 1];

    const leftToken = this.createToken(this.val.args[0], this.getIdxForChildren(), 'Or');
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(
      this.val.args[1],
      this.getIdxForChildren() + keyCount,
      'Or'
    );

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
    const leftToken = this.createToken(this.val.args[0], this.getIdxForChildren(), 'Or');
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(
      this.val.args[1],
      this.getIdxForChildren() + keyCount,
      'Or'
    );

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

  /**
   * @throws {@link OrValidationError}
   */
  public EncodeObject(args: any, semantic?: SemanticEncoding): any {
    this.validateJavascriptObject(args);
    const label = Object.keys(args)[0];

    const leftToken = this.createToken(this.val.args[0], this.getIdxForChildren(), 'Or');
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(
      this.val.args[1],
      this.getIdxForChildren() + keyCount,
      'Or'
    );

    if (String(leftToken.annot()) === String(label) && !(leftToken instanceof OrToken)) {
      return { prim: 'Left', args: [leftToken.EncodeObject(args[label], semantic)] };
    } else if (String(rightToken.annot()) === String(label) && !(rightToken instanceof OrToken)) {
      return { prim: 'Right', args: [rightToken.EncodeObject(args[label], semantic)] };
    } else {
      if (leftToken instanceof OrToken) {
        const val = leftToken.EncodeObject(args, semantic);
        if (val) {
          return { prim: 'Left', args: [val] };
        }
      }

      if (rightToken instanceof OrToken) {
        const val = rightToken.EncodeObject(args, semantic);
        if (val) {
          return { prim: 'Right', args: [val] };
        }
      }
      return null;
    }
  }

  /**
   * @throws {@link OrValidationError}
   */
  private validateJavascriptObject(args: any): asserts args is Record<string, any> {
    if (
      typeof args !== 'object' ||
      Array.isArray(args) ||
      args === null ||
      Object.keys(args).length !== 1
    ) {
      throw new OrValidationError(
        args,
        this,
        `EncodeObject expects an object with a single key but got: ${JSON.stringify(args)}`
      );
    }
  }

  /**
   * @throws {@link OrValidationError}
   */
  public Execute(val: any, semantics?: Semantic): any {
    const leftToken = this.createToken(this.val.args[0], this.getIdxForChildren(), 'Or');
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }
    const rightToken = this.createToken(
      this.val.args[1],
      this.getIdxForChildren() + keyCount,
      'Or'
    );

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
      throw new OrValidationError(
        val,
        this,
        `Was expecting Left or Right prim but got: ${JSON.stringify(val.prim)}`
      );
    }
  }

  private traversal(
    getLeftValue: (token: Token) => any,
    getRightValue: (token: Token) => any,
    concat: (left: any, right: any) => any
  ) {
    const leftToken = this.createToken(this.val.args[0], this.getIdxForChildren(), 'Or');
    let keyCount = 1;
    let leftValue;
    if (leftToken instanceof OrToken) {
      leftValue = getLeftValue(leftToken);
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    } else {
      leftValue = { [leftToken.annot()]: getLeftValue(leftToken) };
    }

    const rightToken = this.createToken(
      this.val.args[1],
      this.getIdxForChildren() + keyCount,
      'Or'
    );
    let rightValue;
    if (rightToken instanceof OrToken) {
      rightValue = getRightValue(rightToken);
    } else {
      rightValue = { [rightToken.annot()]: getRightValue(rightToken) };
    }

    const res = concat(leftValue, rightValue);

    return res;
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
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

  generateSchema(): OrTokenSchema {
    return {
      __michelsonType: OrToken.prim,
      schema: this.traversal(
        (leftToken) => {
          if (leftToken instanceof OrToken) {
            return leftToken.generateSchema().schema;
          } else {
            return leftToken.generateSchema();
          }
        },
        (rightToken) => {
          if (rightToken instanceof OrToken) {
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
    const leftToken = this.createToken(this.val.args[0], this.getIdxForChildren(), 'Or');
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.ExtractSchema()).length;
    }

    const rightToken = this.createToken(
      this.val.args[1],
      this.getIdxForChildren() + keyCount,
      'Or'
    );

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

  protected getIdxForChildren(): number {
    if (Token.fieldNumberingStrategy === 'Legacy') {
      return this.idx;
    }
    return this.parentTokenType === 'Or' ? this.idx : 0;
  }
}
