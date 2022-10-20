import { OptionTokenSchema } from '../schema/types';
import { Token, TokenFactory, Semantic, ComparableToken, SemanticEncoding } from './token';

export class OptionToken extends ComparableToken {
  static prim: 'option' = 'option';

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

  schema(): Token {
    return this.createToken(this.val.args[0], 0);
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

    return { prim: 'Some', args: [this.schema().Encode(args)] };
  }

  public EncodeObject(args: any, semantic?: SemanticEncoding): any {
    const value = args;

    if (value === undefined || value === null) {
      return { prim: 'None' };
    }

    return { prim: 'Some', args: [this.schema().EncodeObject(value, semantic)] };
  }

  public Execute(val: any, semantics?: Semantic) {
    if (val.prim === 'None') {
      return null;
    }

    return this.schema().Execute(val.args[0], semantics);
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return this.schema().ExtractSchema();
  }

  generateSchema(): OptionTokenSchema {
    return {
      __michelsonType: OptionToken.prim,
      schema: this.schema().generateSchema(),
    };
  }

  public ExtractSignature() {
    return [...this.schema().ExtractSignature(), []];
  }

  get KeySchema(): ComparableToken {
    return this.schema() as any;
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
