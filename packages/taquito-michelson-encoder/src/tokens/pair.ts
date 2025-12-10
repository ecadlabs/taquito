import { Token, TokenFactory, Semantic, ComparableToken, SemanticEncoding } from './token';
import { OrToken } from './or';
import { PairTokenSchema } from '../schema/types';
import { MichelsonV1Expression, MichelsonV1ExpressionExtended } from '@taquito/rpc';
import { TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates in invalid token argument being passed
 */
export class TokenArgumentValidationError extends TaquitoError {
  public name = 'TokenArgumentValidationError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure occurring when doing a comparison of tokens
 */
export class TokenComparisonError extends TaquitoError {
  public name = 'TokenComparisonError';
  constructor(
    public val1: string,
    public val2: string
  ) {
    super();
    this.message = `Tokens ${JSON.stringify(val1)} and ${JSON.stringify(val2)} are not comparable`;
  }
}

// collapse comb pair
/**
 * @throws {@link TokenArgumentValidationError}
 */
function collapse(val: Token['val'] | any[], prim: string = PairToken.prim): [any, any] {
  if (Array.isArray(val)) {
    return collapse(
      {
        prim: prim,
        args: val,
      },
      prim
    );
  }
  if (val.args === undefined) {
    throw new TokenArgumentValidationError(
      `The value ${JSON.stringify(
        val
      )} is an invalid PairToken with no arguments, a pair must have two or more arguments.`
    );
  }
  if (val.args.length > 2) {
    return [
      val.args[0],
      {
        prim: prim,
        args: val.args.slice(1),
      },
    ];
  }
  return [val.args[0], val.args[1]];
}
export class PairToken extends ComparableToken {
  static prim: 'pair' = 'pair' as const;

  constructor(
    val: MichelsonV1Expression,
    idx: number,
    fac: TokenFactory,
    parentTokenType?: 'Or' | 'Pair' | 'Other' | undefined
  ) {
    super(
      Array.isArray(val)
        ? {
            prim: PairToken.prim,
            args: val,
          }
        : (val as MichelsonV1ExpressionExtended).prim
          ? (val as MichelsonV1ExpressionExtended)
          : ({
              prim: PairToken.prim,
              args: val,
            } as MichelsonV1ExpressionExtended),
      idx,
      fac,
      parentTokenType
    );
  }

  private args(): [any, any] {
    // collapse comb pair
    return collapse(this.val);
  }

  private tokens(): [Token, Token] {
    let cnt = 0;
    return this.args().map((a) => {
      const tok = this.createToken(a, this.getIdxForChildren() + cnt, 'Pair');
      if (tok instanceof PairToken) {
        cnt += Object.keys(tok.generateSchema()).length;
      } else {
        cnt++;
      }
      return tok;
    }) as [Token, Token];
  }

  public Encode(args: any[]): any {
    return {
      prim: 'Pair',
      args: this.tokens().map((t) => t.Encode(args)),
    };
  }

  public ExtractSignature(): any {
    const args = this.args();
    const leftToken = this.createToken(args[0], this.getIdxForChildren(), 'Pair');
    let keyCount = 1;
    if (leftToken instanceof OrToken) {
      keyCount = Object.keys(leftToken.generateSchema()).length;
    }

    const rightToken = this.createToken(args[1], this.getIdxForChildren() + keyCount, 'Pair');

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

  public EncodeObject(args: any, semantic?: SemanticEncoding): any {
    const [leftToken, rightToken] = this.tokens();

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
      args: [
        leftToken.EncodeObject(leftValue, semantic),
        rightToken.EncodeObject(rightValue, semantic),
      ],
    };
  }

  private traversal(getLeftValue: (token: Token) => any, getRightValue: (token: Token) => any) {
    const args = this.args();

    const leftToken = this.createToken(args[0], this.getIdxForChildren(), 'Pair');
    let keyCount = 1;
    let leftValue;
    if (leftToken instanceof PairToken && !leftToken.hasAnnotations()) {
      leftValue = getLeftValue(leftToken);
      if (leftToken instanceof PairToken) {
        keyCount = Object.keys(leftToken.generateSchema()).length;
      }
    } else {
      leftValue = { [leftToken.annot()]: getLeftValue(leftToken) };
    }

    const rightToken = this.createToken(args[1], this.getIdxForChildren() + keyCount, 'Pair');
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
    const args = collapse(val, 'Pair');
    return this.traversal(
      (leftToken) => leftToken.Execute(args[0], semantics),
      (rightToken) => rightToken.Execute(args[1], semantics)
    );
  }

  generateSchema(): PairTokenSchema {
    return {
      __michelsonType: PairToken.prim,
      schema: this.traversal(
        (leftToken) => {
          if (leftToken instanceof PairToken && !leftToken.hasAnnotations()) {
            return leftToken.generateSchema().schema;
          } else {
            return leftToken.generateSchema();
          }
        },
        (rightToken) => {
          if (rightToken instanceof PairToken && !rightToken.hasAnnotations()) {
            return rightToken.generateSchema().schema;
          } else {
            return rightToken.generateSchema();
          }
        }
      ),
    };
  }

  /**
   * @throws {@link TokenComparisonError}
   */
  public compare(val1: any, val2: any) {
    const [leftToken, rightToken] = this.tokens();

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

    throw new TokenComparisonError(val1, val2);
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (PairToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.tokens().map((t) => t.findAndReturnTokens(tokenToFind, tokens));
    return tokens;
  }

  protected getIdxForChildren(): number {
    if (Token.fieldNumberingStrategy === 'Legacy') {
      return this.idx;
    }
    return this.parentTokenType === 'Pair' ? this.idx : 0;
  }
}
