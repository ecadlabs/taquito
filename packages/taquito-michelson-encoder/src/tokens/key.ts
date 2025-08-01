import {
  ComparableToken,
  SemanticEncoding,
  Token,
  TokenFactory,
  TokenValidationError,
} from './token';
import {
  b58DecodeAddress,
  encodeKey,
  validatePublicKey,
  ValidationResult,
} from '@taquito/utils';
import { BaseTokenSchema } from '../schema/types';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Key
 */
export class KeyValidationError extends TokenValidationError {
  name = 'KeyValidationError';
  constructor(public value: any, public token: KeyToken, message: string) {
    super(value, token, message);
  }
}

export class KeyToken extends ComparableToken {
  static prim: 'key' = 'key' as const;

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

    return encodeKey(val.bytes);
  }

  /**
   * @throws {@link KeyValidationError}
   */
  private validate(value: any) {
    if (validatePublicKey(value) !== ValidationResult.VALID) {
      throw new KeyValidationError(value, this, 'Key is not valid');
    }
  }

  /**
   * @throws {@link KeyValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    return { string: val };
  }

  /**
   * @throws {@link KeyValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);

    if (semantic && semantic[KeyToken.prim]) {
      return semantic[KeyToken.prim](val);
    }

    return { string: val };
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return KeyToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: KeyToken.prim,
      schema: KeyToken.prim,
    };
  }

  ToKey(val: any) {
    return this.Execute(val);
  }

  ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: KeyToken.prim },
    };
  }

  compare(key1: string, key2: string): number {
    const k1 = b58DecodeAddress(key1, 'array');
    const k2 = b58DecodeAddress(key2, 'array');
    return k1 < k2 ? -1 : k1 > k2 ? 1 : 0;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (KeyToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
