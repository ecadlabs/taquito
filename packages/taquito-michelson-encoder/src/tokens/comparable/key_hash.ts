import { Token, TokenFactory, ComparableToken } from '../token';
import { encodeKeyHash } from '@taquito/utils';

export class KeyHashToken extends Token implements ComparableToken {
  static prim = 'key_hash';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: { bytes: string; string: string }): string {
    if (val.string) {
      return val.string;
    }

    return encodeKeyHash(val.bytes);
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return { string: val };
  }

  public ExtractSchema() {
    return KeyHashToken.prim;
  }

  // tslint:disable-next-line: variable-name
  public ToKey({ string, bytes }: any) {
    if (string) {
      return string;
    }

    return encodeKeyHash(bytes);
  }

  public ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: KeyHashToken.prim },
    };
  }
}
