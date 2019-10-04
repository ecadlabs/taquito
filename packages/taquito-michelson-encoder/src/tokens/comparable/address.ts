import { Token, TokenFactory, ComparableToken } from '../token';
import { b58decode, encodePubKey } from '@taquito/utils';

export class AddressToken extends Token implements ComparableToken {
  static prim = 'address';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public ToBigMapKey(val: any) {
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

  public EncodeObject(val: any): any {
    return { string: val };
  }

  // tslint:disable-next-line: variable-name
  public Execute(val: { bytes: string; string: string }): string {
    if (val.string) {
      return val.string;
    }

    return encodePubKey(val.bytes);
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
