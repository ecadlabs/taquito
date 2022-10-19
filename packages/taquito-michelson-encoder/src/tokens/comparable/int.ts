import {
  Token,
  TokenFactory,
  ComparableToken,
  TokenValidationError,
  SemanticEncoding,
} from '../token';
import BigNumber from 'bignumber.js';
import { BaseTokenSchema } from '../../schema/types';

export class IntValidationError extends TokenValidationError {
  name = 'IntValidationError';
  constructor(public value: any, public token: IntToken, message: string) {
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

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return IntToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: IntToken.prim,
      schema: IntToken.prim,
    };
  }

  private isValid(val: any): IntValidationError | null {
    const bigNumber = new BigNumber(val);
    if (bigNumber.isNaN()) {
      return new IntValidationError(val, this, `Value is not a number: ${val}`);
    } else {
      return null;
    }
  }

  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { int: new BigNumber(val).toFixed() };
  }

  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

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
    const o1 = Number(int1);
    const o2 = Number(int2);
    if (o1 === o2) {
      return 0;
    }

    return o1 < o2 ? -1 : 1;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (IntToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
