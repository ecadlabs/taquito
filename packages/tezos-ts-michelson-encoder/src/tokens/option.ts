import { Token, TokenFactory } from './token';

export class OptionToken extends Token {
  static prim = 'option';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Encode(...args: any[]): any {
    const value = args[0][0];
    if (!value) {
      return { prim: 'None' };
    }

    const schema = this.createToken(this.val.args[0], 0);
    return schema.Encode([value]);
  }

  public Execute(val: any) {
    if (val.prim === 'None') {
      return null;
    }

    const schema = this.createToken(this.val.args[0], 0);
    return schema.Execute(val.args[0]);
  }

  public ExtractSchema() {
    return OptionToken.prim;
  }
}
