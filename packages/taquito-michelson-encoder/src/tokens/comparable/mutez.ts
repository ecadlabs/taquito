import { Token, TokenFactory, ComparableToken, TokenValidationError } from '../token';
import BigNumber from 'bignumber.js';

export class MutezValidationError extends TokenValidationError {
  name: string = 'MutezValidationError';
  constructor(public value: any, public token: MutezToken, message: string) {
    super(value, token, message);
  }
}

export class MutezToken extends ComparableToken {
  static prim = 'mutez';

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

  public ExtractSchema() {
    return MutezToken.prim;
  }

  private isValid(val: any): MutezValidationError | null {
    const bigNumber = new BigNumber(val);
    if (bigNumber.isNaN()) {
      return new MutezValidationError(val, this, `Value is not a number: ${val}`);
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

    return { int: String(val).toString() };
  }

  public EncodeObject(val: any): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { int: String(val).toString() };
  }

  public ToBigMapKey(val: string) {
    return {
      key: { int: val },
      type: { prim: MutezToken.prim },
    };
  }

  public ToKey({ int }: any) {
    return int;
  }
}
