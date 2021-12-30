import { Token, TokenFactory, Semantic, ComparableToken } from './token';

export class OptionToken extends ComparableToken {
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
    if (value === undefined || value === null) {
      return { prim: 'None' };
    } else if (
      Array.isArray(value) &&
      (value[value.length - 1] === undefined || value[value.length - 1] === null)
    ) {
      value.pop();
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

  public ExtractSignature() {
    const schema = this.createToken(this.val.args[0], 0);
    return [...schema.ExtractSignature(), []];
  }

  get KeySchema(): ComparableToken {
    return this.createToken(this.val.args[0], 0) as any;
  }

  compare(val1: any, val2: any) {
    if (!val1) {
      return -1;
    } else if (!val2) {
      return 1;
    }
    return this.KeySchema.compare(val1, val2);
  }

  public ToKey(val: any) {
    return this.Execute(val);
  }

  public ToBigMapKey(val: any) {
    return {
      key: this.EncodeObject(val),
      type: this.typeWithoutAnnotations(),
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (OptionToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.subToken().findAndReturnTokens(tokenToFind, tokens);
    return tokens;
  }
}
