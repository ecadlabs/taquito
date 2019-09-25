import { Token, TokenFactory } from './token';
import { encodePubKey } from '@taquito/utils';

export class ContractToken extends Token {
  static prim = 'contract';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: { bytes: string; string: string }) {
    if (val.string) {
      return val.string;
    }

    return encodePubKey(val.bytes);
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return { string: val };
  }

  public ExtractSchema() {
    return ContractToken.prim;
  }
}
