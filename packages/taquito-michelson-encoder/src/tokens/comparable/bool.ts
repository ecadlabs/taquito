import { Token, TokenFactory } from '../token';

export class BoolToken extends Token {
  static prim = 'bool';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): boolean {
    return String(val.prim).toLowerCase() === 'true' ? true : false;
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return val ? 'true' : 'false';
  }

  public ExtractSchema() {
    return BoolToken.prim;
  }
}
