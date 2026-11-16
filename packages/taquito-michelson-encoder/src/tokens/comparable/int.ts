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
 *  Error that indicates a failure happening when parsing encoding/executing Int
 */
export class IntValidationError extends TokenValidationError {
  name = 'IntValidationError';
  constructor(
    public value: any,
    public token: IntToken,
    message: string
  ) {
    super(value, token, message);
  }
}

export class IntToken extends ComparableToken {
  static prim: 'int' = 'int' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: { [key: string]: string }): { [key: string]: any } {
    return new BigNumber(val[Object.keys(val)[0]]);
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: IntToken.prim,
      schema: IntToken.prim,
    };
  }

  /**
   * @throws {@link IntValidationError}
   */
  private validate(val: any) {
    if (typeof val === 'boolean' || val === null) {
      throw new IntValidationError(val, this, `Value is not a number: ${JSON.stringify(val)}`);
    }
    let bigNumber: BigNumber;
    try {
      bigNumber = new BigNumber(val);
    } catch {
      throw new IntValidationError(val, this, `Value is not a number: ${JSON.stringify(val)}`);
    }
    if (bigNumber.isNaN() || !bigNumber.isInteger()) {
      throw new IntValidationError(val, this, `Value is not a number: ${JSON.stringify(val)}`);
    }
  }

  /**
   * @throws {@link IntValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    return { int: new BigNumber(val).toFixed() };
  }

  /**
   * @throws {@link IntValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);

    if (semantic && semantic[IntToken.prim]) {
      return semantic[IntToken.prim](val);
    }

    return { int: new BigNumber(val).toFixed() };
  }

  public ToBigMapKey(val: string | number) {
    return {
      key: { int: String(val) },
      type: { prim: IntToken.prim },
    };
  }

  public ToKey({ int }: any) {
    return int;
  }

  compare(int1: string | number, int2: string | number) {
    return new BigNumber(int1).comparedTo(new BigNumber(int2)) ?? 0;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (IntToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
