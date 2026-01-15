import { BaseTokenSchema } from '../../schema/types';
import { Token, TokenFactory, ComparableToken, SemanticEncoding } from '../token';

export class TimestampToken extends ComparableToken {
  static prim: 'timestamp' = 'timestamp' as const;

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
    if (typeof val === 'number') {
      return { int: String(val) };
    } else {
      return { string: val };
    }
  }

  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    if (semantic && semantic[TimestampToken.prim]) {
      return semantic[TimestampToken.prim](val);
    }

    if (typeof val === 'number') {
      return { int: String(val) };
    } else {
      return { string: val };
    }
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
