import { BaseTokenSchema } from '../../schema/types';
import { Token, TokenFactory, ComparableToken, SemanticEncoding } from '../token';

export class StringToken extends ComparableToken {
  static prim: 'string' = 'string' as const;

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

  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    if (semantic && semantic[StringToken.prim]) {
      return semantic[StringToken.prim](val);
    }
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
