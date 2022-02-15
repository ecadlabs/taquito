import { BaseTokenSchema } from '../../schema/types';
import { Token, TokenFactory, ComparableToken } from '../token';

export class StringToken extends ComparableToken {
  static prim: 'string' = 'string';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: any): string {
    return val[Object.keys(val)[0]];
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return StringToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: StringToken.prim,
      schema: StringToken.prim,
    };
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return { string: val };
  }

  public EncodeObject(val: any): any {
    return { string: val };
  }

  public ToKey({ string }: any) {
    return string;
  }

  public ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: StringToken.prim },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (StringToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
