import { MichelsonV1Expression, MichelsonV1ExpressionExtended } from '@taquito/rpc';
import { TokenSchema } from '../schema/types';
import { TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates a failure when encoding invalid or incorrect data (e.g. if an address is expected but a number is received)
 */
export abstract class TokenValidationError extends TaquitoError {
  name = 'TokenValidationError';

  constructor(
    public readonly value: any,
    public readonly token: Token,
    baseMessage: string
  ) {
    super();
    const annot = this.token.annot();
    const annotText = annot ? `[${annot}] ` : '';
    this.message = `${annotText}${baseMessage}`;
  }
}

export type TokenFactory = (
  val: any,
  idx: number,
  parentTokenType?: 'Or' | 'Pair' | 'Other'
) => Token;

export interface Semantic {
  [key: string]: (value: MichelsonV1Expression, schema: MichelsonV1Expression) => any;
}

export interface SemanticEncoding {
  [key: string]: (value: any, type?: MichelsonV1Expression) => MichelsonV1Expression;
}

/**
 * @description Possible strategies for mapping between javascript classes and Michelson values
 * Legacy: The old behaviour: { annot1: 'some value', annot2: 'other Value', annot3: { 2: 'yet another value', 3: 'also some value' }}
 * ResetFieldNumbersInNestedObjects: { annot1: 'some value', annot2: 'other Value', annot3: { 0: 'yet another value', 1: 'also some value' }}
 * Latest: This will include new changes as we might implement in the future. This is the suggested value if it does not break your code
 */
export type FieldNumberingStrategy = 'Legacy' | 'ResetFieldNumbersInNestedObjects' | 'Latest';

export abstract class Token {
  private static _fieldNumberingStrategy: FieldNumberingStrategy = 'Latest';

  /**
   * @description Gets the strategy used for field numbering in Token execute/encode/decode to convert Michelson values to/from javascript objects, returns a value of type {@link FieldNumberingStrategy} that controls how field numbers are calculated
   */
  static get fieldNumberingStrategy() {
    return Token._fieldNumberingStrategy;
  }

  /**
   * @description Sets the strategy used for field numbering in Token execute/encode/decode to convert Michelson values to/from javascript objects, accepts a value of type {@link FieldNumberingStrategy} that controls how field numbers are calculated
   */
  static set fieldNumberingStrategy(value: FieldNumberingStrategy) {
    Token._fieldNumberingStrategy = value;
  }

  constructor(
    protected val: MichelsonV1ExpressionExtended,
    protected idx: number,
    protected fac: TokenFactory,
    protected parentTokenType?: 'Or' | 'Pair' | 'Other'
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

  abstract generateSchema(): TokenSchema;

  public abstract Execute(val: any, semantics?: Semantic): any;

  public abstract Encode(_args: any[]): any;

  public abstract EncodeObject(args: any, semantics?: SemanticEncoding): any;

  public ExtractSignature() {
    return [[this.generateSchema()]];
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
    return o1 < o2 ? -1 : o1 > o2 ? 1 : 0;
  }
}
