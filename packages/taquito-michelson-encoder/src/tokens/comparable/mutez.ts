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
 *  @description Error that indicates a failure happening when parsing encoding/executing Mutez
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
    const bigNumber = new BigNumber(val);
    if (bigNumber.isNaN()) {
      throw new MutezValidationError(val, this, `Value is not a number: ${val}`);
    }
  }

  /**
   * @throws {@link MutezValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    return { int: String(val).toString() };
  }

  /**
   * @throws {@link MutezValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);

    if (semantic && semantic[MutezToken.prim]) {
      return semantic[MutezToken.prim](val);
    }

    return { int: String(val).toString() };
  }

  public ToBigMapKey(val: string | number) {
    return {
      key: { int: String(val) },
      type: { prim: MutezToken.prim },
    };
  }

  public ToKey({ int }: any) {
    return int;
  }

  compare(mutez1: string | number, mutez2: string | number) {
    const o1 = Number(mutez1);
    const o2 = Number(mutez2);
    if (o1 === o2) {
      return 0;
    }

    return o1 < o2 ? -1 : 1;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (MutezToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
