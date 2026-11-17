import {
  Token,
  TokenFactory,
  ComparableToken,
  TokenValidationError,
  SemanticEncoding,
} from '../token';
import BigNumber from 'bignumber.js';
import { BaseTokenSchema } from '../../schema/types';

/**
 *  @category Error
 *  Error that indicates a failure happening when parsing encoding/executing Nat
 */
export class NatValidationError extends TokenValidationError {
  name = 'NatValidationError';
  constructor(
    public value: any,
    public token: NatToken,
    message: string
  ) {
    super(value, token, message);
  }
}

export class NatToken extends ComparableToken {
  static prim: 'nat' = 'nat' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): { [key: string]: any } {
    return new BigNumber(val[Object.keys(val)[0]]);
  }

  /**
   * @throws {@link NatValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    return { int: new BigNumber(val).toFixed() };
  }

  /**
   * @throws {@link NatValidationError}
   */
  private validate(val: any) {
    if (typeof val === 'boolean' || val === null) {
      throw new NatValidationError(val, this, `Value is not a number: ${JSON.stringify(val)}`);
    }
    let bigNumber: BigNumber;
    try {
      bigNumber = new BigNumber(val);
    } catch {
      throw new NatValidationError(val, this, `Value is not a number: ${JSON.stringify(val)}`);
    }
    if (bigNumber.isNaN() || !bigNumber.isInteger()) {
      throw new NatValidationError(val, this, `Value is not a number: ${JSON.stringify(val)}`);
    }
    if (bigNumber.isLessThan(0)) {
      throw new NatValidationError(val, this, `Value cannot be negative: ${JSON.stringify(val)}`);
    }
  }

  /**
   * @throws {@link NatValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);

    if (semantic && semantic[NatToken.prim]) {
      return semantic[NatToken.prim](val);
    }

    return { int: new BigNumber(val).toFixed() };
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: NatToken.prim,
      schema: NatToken.prim,
    };
  }

  public ToBigMapKey(val: string | number) {
    return {
      key: { int: String(val) },
      type: { prim: NatToken.prim },
    };
  }

  public ToKey({ int }: any) {
    return new BigNumber(int);
  }

  compare(nat1: string | number, nat2: string | number) {
    return new BigNumber(nat1).comparedTo(new BigNumber(nat2)) ?? 0;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (NatToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
