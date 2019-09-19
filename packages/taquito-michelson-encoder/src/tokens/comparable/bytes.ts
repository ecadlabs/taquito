import { Token, TokenFactory, ComparableToken } from '../token';

export class BytesToken extends Token implements ComparableToken {
  static prim = 'bytes';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public ToBigMapKey(val: string) {
    return {
      key: { bytes: val },
      type: { prim: BytesToken.prim },
    };
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return { bytes: String(val).toString() };
  }

  public Execute(val: any): string {
    return val.bytes;
  }

  public ExtractSchema() {
    return BytesToken.prim;
  }

  // tslint:disable-next-line: variable-name
  public ToKey({ bytes, string }: any) {
    if (string) {
      return string;
    }

    return bytes;
  }
}
