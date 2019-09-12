import { Token, TokenFactory } from './token';

export class SignatureToken extends Token {
  static prim = 'signature';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): { [key: string]: any } {
    return val.string;
  }

  public Encode(...args: any[]): any {
    return { string: args[0] };
  }

  public ExtractSchema() {
    return SignatureToken.prim;
  }
}
