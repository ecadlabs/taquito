import { Token, TokenFactory, ComparableToken } from '../token';
import { b58decode, encodePubKey } from '@tezos-ts/utils';

export class AddressToken extends Token implements ComparableToken {
  static prim = 'address';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public ToBigMapKey(val: string) {
    const decoded = b58decode(val);
    return {
      key: { bytes: decoded },
      type: { prim: 'bytes' },
    };
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return { string: val };
  }

  public Execute(val: any): string {
    return val.string;
  }

  public ExtractSchema() {
    return AddressToken.prim;
  }

  // tslint:disable-next-line: variable-name
  public ToKey({ bytes, string }: any) {
    if (string) {
      return string;
    }

    return encodePubKey(bytes);
  }
}
