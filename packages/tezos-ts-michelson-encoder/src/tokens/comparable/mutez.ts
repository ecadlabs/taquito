import { Token, TokenFactory, ComparableToken } from '../token';

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
    return val.int;
  }

  public ExtractSchema() {
    return MutezToken.prim;
  }

  public ToBigMapKey(val: string) {
    return {
      key: { int: val },
      type: { prim: MutezToken.prim },
    };
  }
}
