import { MichelsonV1Expression, MichelsonV1ExpressionExtended } from '@taquito/rpc';
import { TokenSchema } from '../schema/types';
import { TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates a failure when encoding invalid or incorrect data (e.g. if an address is expected but a number is received)
 */
export abstract class TokenValidationError extends TaquitoError {
  name = 'ValidationError';

  constructor(public readonly value: any, public readonly token: Token, baseMessage: string) {
    super();
    const annot = this.token.annot();
    const annotText = annot ? `[${annot}] ` : '';
    this.message = `${annotText}${baseMessage}`;
  }
}

export type TokenFactory = (val: any, idx: number) => Token;

export interface Semantic {
  [key: string]: (value: MichelsonV1Expression, schema: MichelsonV1Expression) => any;
}

export interface SemanticEncoding {
  [key: string]: (value: any, type?: MichelsonV1Expression) => MichelsonV1Expression;
}

export abstract class Token {
  constructor(
    protected val: MichelsonV1ExpressionExtended,
    protected idx: number,
    protected fac: TokenFactory
  ) {}

  protected typeWithoutAnnotations() {
    const handleMichelsonExpression = (val: MichelsonV1Expression): MichelsonV1Expression => {
      if (typeof val === 'object') {
        if (Array.isArray(val)) {
          const array = val as MichelsonV1Expression[];
          return array.map((item) => handleMichelsonExpression(item));
        }
        const extended = val as MichelsonV1ExpressionExtended;
        if (extended.args) {
          return {
            prim: extended.prim,
            args: extended.args.map((x) => handleMichelsonExpression(x)),
          };
        } else {
          return {
            prim: extended.prim,
          };
        }
      }
      return val;
    };

    const handleMichelsonExtended = (
      val: MichelsonV1ExpressionExtended
    ): Omit<MichelsonV1ExpressionExtended, 'annots'> => {
      if (val.args) {
        return {
          prim: val.prim,
          args: val.args.map((x) => handleMichelsonExpression(x)),
        };
      } else {
        return {
          prim: val.prim,
        };
      }
    };

    return handleMichelsonExtended(this.val);
  }

  annot() {
    return (
      Array.isArray(this.val.annots) && this.val.annots.length > 0
        ? this.val.annots[0]
        : String(this.idx)
    ).replace(/(%|:)(_Liq_entry_)?/, '');
  }

  hasAnnotations() {
    return Array.isArray(this.val.annots) && this.val.annots.length;
  }

  get tokenVal() {
    return this.val;
  }

  public createToken = this.fac;

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public abstract ExtractSchema(): any;

  abstract generateSchema(): TokenSchema;

  public abstract Execute(val: any, semantics?: Semantic): any;

  public abstract Encode(_args: any[]): any;

  public abstract EncodeObject(args: any, semantics?: SemanticEncoding): any;

  public ExtractSignature() {
    return [[this.ExtractSchema()]];
  }

  abstract findAndReturnTokens(tokenToFind: string, tokens: Array<Token>): Array<Token>;
}

export type BigMapKeyType = string | number | object;

export abstract class ComparableToken extends Token {
  abstract ToBigMapKey(val: BigMapKeyType): {
    key: { [key: string]: string | object[] };
    type: { prim: string; args?: object[] };
  };
  abstract ToKey(val: string | MichelsonV1Expression): any;

  compare(o1: string, o2: string): number {
    if (o1 === o2) {
      return 0;
    }

    return o1 < o2 ? -1 : 1;
  }
}
