import { Token, TokenFactory } from './token';

export class UnitToken extends Token {
  static prim = 'unit';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Encode(_args: any[]): any {
    const val = _args.splice(0, 1);
    return '';
  }

  public Execute(): { [key: string]: any } {
    return null as any;
  }

  public ExtractSchema() {
    return UnitToken.prim;
  }
}
