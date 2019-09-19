import { Token, TokenFactory, ComparableToken } from '../token';
import BigNumber from 'bignumber.js';

export class IntToken extends Token implements ComparableToken {
  static prim = 'int';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): { [key: string]: any } {
    return new BigNumber(val.int);
  }

  public ExtractSchema() {
    return IntToken.prim;
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return { int: String(val).toString() };
  }

  public ToBigMapKey(val: string) {
    return {
      key: { int: val },
      type: { prim: IntToken.prim },
    };
  }

  public ToKey({ int }: any) {
    return int;
  }
}
