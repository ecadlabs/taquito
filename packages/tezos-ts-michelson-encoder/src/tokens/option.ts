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

  public subToken(): Token {
    return this.createToken(this.val.args[0], this.idx);
  }

  annot(): string {
    return Array.isArray(this.val.annots)
      ? super.annot()
      : this.createToken(this.val.args[0], this.idx).annot();
  }

  public Encode(args: any[]): any {
    const value = args;
    if (!value) {
      return { prim: 'None' };
    }

    const schema = this.createToken(this.val.args[0], 0);
    return { prim: 'Some', args: [schema.Encode(args)] };
  }

  public Execute(val: any) {
    if (val.prim === 'None') {
      return null;
    }

    const schema = this.createToken(this.val.args[0], 0);
    return schema.Execute(val.args[0]);
  }

  public ExtractSchema() {
    const schema = this.createToken(this.val.args[0], 0);
    return schema.ExtractSchema();
  }
}
