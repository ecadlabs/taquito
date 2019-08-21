import { Token, TokenFactory, ComparableToken } from '../token';

export class NatToken extends Token implements ComparableToken {
  static prim = 'nat';

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
    return NatToken.prim;
  }

  public ToBigMapKey(val: string) {
    return {
      key: { int: val },
      type: { prim: NatToken.prim },
    };
  }
}
