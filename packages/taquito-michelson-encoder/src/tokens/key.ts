import { Token, TokenFactory } from './token';
import { encodeKey } from '@taquito/utils';

export class KeyToken extends Token {
  static prim = 'key';

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

    return encodeKey(val.bytes);
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return { string: val };
  }

  public ExtractSchema() {
    return KeyToken.prim;
  }
}
