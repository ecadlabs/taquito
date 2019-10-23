import { Token, TokenFactory, Semantic } from './token';

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

  public Encode(args: any): any {
    const value = args;
    if (
      value === undefined ||
      value === null ||
      (Array.isArray(value) && (value[0] === undefined || value[0] === null))
    ) {
      return { prim: 'None' };
    }

    const schema = this.createToken(this.val.args[0], 0);
    return { prim: 'Some', args: [schema.Encode(args)] };
  }

  public EncodeObject(args: any): any {
    const schema = this.createToken(this.val.args[0], 0);
    const value = args;

    if (value === undefined || value === null) {
      return { prim: 'None' };
    }

    return { prim: 'Some', args: [schema.EncodeObject(value)] };
  }

  public Execute(val: any, semantics?: Semantic) {
    if (val.prim === 'None') {
      return null;
    }

    const schema = this.createToken(this.val.args[0], 0);
    return schema.Execute(val.args[0], semantics);
  }

  public ExtractSchema() {
    const schema = this.createToken(this.val.args[0], 0);
    return schema.ExtractSchema();
  }
}
