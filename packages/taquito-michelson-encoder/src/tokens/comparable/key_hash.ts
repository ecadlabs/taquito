import { Token, TokenFactory, ComparableToken, TokenValidationError } from '../token';
import { encodeKeyHash, validateKeyHash, ValidationResult } from '@taquito/utils';
import { BaseTokenSchema } from '../../schema/types';

export class KeyHashValidationError extends TokenValidationError {
  name = 'KeyHashValidationError';
  constructor(public value: any, public token: KeyHashToken, message: string) {
    super(value, token, message);
  }
}

export class KeyHashToken extends ComparableToken {
  static prim: 'key_hash' = 'key_hash';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: { bytes: string; string: string }) {
    if (val.string) {
      return val.string;
    }

    return encodeKeyHash(val.bytes);
  }

  private isValid(value: any): KeyHashValidationError | null {
    if (validateKeyHash(value) !== ValidationResult.VALID) {
      return new KeyHashValidationError(value, this, `KeyHash is not valid: ${value}`);
    }

    return null;
  }

  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { string: val };
  }

  public EncodeObject(val: any): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return { string: val };
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return KeyHashToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: KeyHashToken.prim,
      schema: KeyHashToken.prim,
    };
  }

  public ToKey({ string, bytes }: any) {
    if (string) {
      return string;
    }

    return encodeKeyHash(bytes);
  }

  public ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: KeyHashToken.prim },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (KeyHashToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
