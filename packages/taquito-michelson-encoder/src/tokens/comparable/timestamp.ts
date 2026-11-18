import BigNumber from 'bignumber.js';
import { BaseTokenSchema } from '../../schema/types';
import { Token, TokenFactory, ComparableToken, SemanticEncoding } from '../token';

const MAX_DATE_SECONDS = 8_640_000_000_000;

export class TimestampToken extends ComparableToken {
  static prim: 'timestamp' = 'timestamp' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private formatDecimalTimestamp(raw: string): string {
    const sec = Number(raw);
    if (Number.isSafeInteger(sec) && Math.abs(sec) <= MAX_DATE_SECONDS) {
      return new Date(sec * 1000).toISOString();
    }
    return new BigNumber(raw).toFixed(0);
  }

  public Execute(val: { string?: string; int?: string }) {
    if (val.string && /^-?\d+$/.test(val.string)) {
      return this.formatDecimalTimestamp(val.string);
    } else if (val.string) {
      return new Date(val.string).toISOString();
    } else if (val.int) {
      return this.formatDecimalTimestamp(val.int);
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

  public ToKey(val: { string?: string; int?: string }) {
    return this.Execute(val);
  }

  private toEpochMs(val: string | number): BigNumber {
    if (typeof val === 'number') {
      return new BigNumber(val).multipliedBy(1000);
    }
    if (typeof val === 'string' && /^-?\d+$/.test(val)) {
      return new BigNumber(val).multipliedBy(1000);
    }
    return new BigNumber(new Date(val).getTime());
  }

  compare(val1: string | number, val2: string | number): number {
    const t1 = this.toEpochMs(val1);
    const t2 = this.toEpochMs(val2);
    return t1.comparedTo(t2) ?? 0;
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
