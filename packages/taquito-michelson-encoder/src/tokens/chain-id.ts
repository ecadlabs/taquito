import { Token, TokenFactory, ComparableToken } from './token';

export class ChainIDToken extends Token implements ComparableToken {
  static prim = 'chain_id';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): string {
    return val[Object.keys(val)[0]];
  }

  public ExtractSchema() {
    return ChainIDToken.prim;
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return { string: val };
  }

  public EncodeObject(val: any): any {
    return { string: val };
  }

  // tslint:disable-next-line: variable-name
  public ToKey({ string }: any) {
    return string;
  }

  public ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: ChainIDToken.prim },
    };
  }
}
