import { Token, TokenFactory, ComparableToken } from '../token';
import BigNumber from 'bignumber.js';

export class MutezToken extends Token implements ComparableToken {
  static prim = 'mutez';

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
    return MutezToken.prim;
  }

  public Encode(args: any[]): any {
    const val = args.pop();
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
