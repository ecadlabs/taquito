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
 *  Error that indicates a failure happening when parsing encoding/executing Mutez
 */
export class MutezValidationError extends TokenValidationError {
  name = 'MutezValidationError';
  constructor(
    public value: any,
    public token: MutezToken,
    message: string
  ) {
    super(value, token, message);
  }
}

export class MutezToken extends ComparableToken {
  static prim: 'mutez' = 'mutez' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any) {
    return new BigNumber(val[Object.keys(val)[0]]);
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: MutezToken.prim,
      schema: MutezToken.prim,
    };
  }

  /**
   * @throws {@link MutezValidationError}
   */
  private validate(val: any) {
    if (typeof val === 'boolean' || val === null) {
      throw new MutezValidationError(val, this, `Value is not a number: ${val}`);
    }
    let bigNumber: BigNumber;
    try {
      bigNumber = new BigNumber(val);
    } catch {
      throw new MutezValidationError(val, this, `Value is not a number: ${val}`);
    }
    if (bigNumber.isNaN() || !bigNumber.isInteger()) {
      throw new MutezValidationError(val, this, `Value is not a number: ${val}`);
    }
    if (bigNumber.isLessThan(0)) {
      throw new MutezValidationError(val, this, `Value cannot be negative: ${val}`);
    }
    if (bigNumber.isGreaterThan('9223372036854775807')) {
      throw new MutezValidationError(val, this, `Value is too large: ${val}`);
    }
  }

  /**
   * @throws {@link MutezValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    return { int: new BigNumber(val).toFixed() };
  }

  /**
   * @throws {@link MutezValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);

    if (semantic && semantic[MutezToken.prim]) {
      return semantic[MutezToken.prim](val);
    }

    return { int: new BigNumber(val).toFixed() };
  }

  public ToBigMapKey(val: string | number) {
    return {
      key: { int: new BigNumber(val).toFixed() },
      type: { prim: MutezToken.prim },
    };
  }

  public ToKey({ int }: any) {
    return int;
  }

  compare(mutez1: string | number, mutez2: string | number) {
    return new BigNumber(mutez1).comparedTo(new BigNumber(mutez2)) ?? 0;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (MutezToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
