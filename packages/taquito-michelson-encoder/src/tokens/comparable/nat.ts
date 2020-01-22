import { Token, TokenFactory, ComparableToken, TokenValidationError } from '../token';
import BigNumber from 'bignumber.js';

export class NatValidationError extends TokenValidationError {
  name: string = 'NatValidationError';
  constructor(public value: any, public token: NatToken, message: string) {
    super(value, token, message);
  }
}

export class NatToken extends ComparableToken {
  static prim = 'nat';

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

  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { int: String(val).toString() };
  }

  private isValid(val: any): NatValidationError | null {
    const bigNumber = new BigNumber(val);
    if (bigNumber.isNaN()) {
      return new NatValidationError(val, this, `Value is not a number: ${val}`);
    } else if (bigNumber.isNegative()) {
      return new NatValidationError(val, this, `Value cannot be negative: ${val}`);
    } else {
      return null;
    }
  }

  public EncodeObject(val: any): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { int: String(val).toString() };
  }

  public ExtractSchema() {
    return NatToken.prim;
  }

  public ToBigMapKey(val: string) {
    return {
      key: { int: val },
      type: { prim: NatToken.prim },
    };
  }

  public ToKey({ int }: any) {
    return int;
  }
}
