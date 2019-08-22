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

  public Execute(val: any): { [key: string]: any } {
    return val.timestamp;
  }

  public ExtractSchema() {
    return TimestampToken.prim;
  }

  // tslint:disable-next-line: variable-name
  public ToKey({ timestamp }: any) {
    return timestamp;
  }

  public ToBigMapKey(val: string) {
    return {
      key: { timestamp: val },
      type: { prim: TimestampToken.prim },
    };
  }
}
