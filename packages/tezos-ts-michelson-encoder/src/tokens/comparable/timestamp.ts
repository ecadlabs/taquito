import { Token, TokenFactory, ComparableToken } from '../token';

export class TimestampToken extends Token implements ComparableToken {
  static prim = 'timestamp';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): string {
    return val.string;
  }

  public ExtractSchema() {
    return TimestampToken.prim;
  }

  // tslint:disable-next-line: variable-name
  public ToKey({ string }: any) {
    return string;
  }

  public ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: TimestampToken.prim },
    };
  }
}
