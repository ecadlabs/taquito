import { BaseTokenSchema } from '../../schema/types';
import { Token, TokenFactory, ComparableToken } from '../token';

export class TimestampToken extends ComparableToken {
  static prim: 'timestamp' = 'timestamp';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: { string?: string; int?: string }) {
    if (val.string && /^\d+$/.test(val.string)) {
      return new Date(Number(val.string) * 1000).toISOString();
    } else if (val.string) {
      return new Date(val.string).toISOString();
    } else if (val.int) {
      return new Date(Number(val.int) * 1000).toISOString();
    }
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    return { string: val };
  }

  public EncodeObject(val: any): any {
    return { string: val };
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return TimestampToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: TimestampToken.prim,
      schema: TimestampToken.prim,
    };
  }

  public ToKey({ string }: any) {
    return string;
  }

  public ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: TimestampToken.prim },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (TimestampToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
