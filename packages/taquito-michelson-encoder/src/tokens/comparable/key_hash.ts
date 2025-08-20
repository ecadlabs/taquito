import {
  Token,
  TokenFactory,
  ComparableToken,
  TokenValidationError,
  SemanticEncoding,
} from '../token';
import { b58DecodePublicKeyHash, compareArrays, encodeKeyHash, validateKeyHash, ValidationResult } from '@taquito/utils';
import { BaseTokenSchema } from '../../schema/types';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing Key Hash
 */
export class KeyHashValidationError extends TokenValidationError {
  name = 'KeyHashValidationError';
  constructor(public value: any, public token: KeyHashToken, message: string) {
    super(value, token, message);
  }
}

export class KeyHashToken extends ComparableToken {
  static prim: 'key_hash' = 'key_hash' as const;

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

  /**
   * @throws {@link KeyHashValidationError}
   */
  private validate(value: any) {
    if (validateKeyHash(value) !== ValidationResult.VALID) {
      throw new KeyHashValidationError(
        value,
        this,
        `KeyHash is not valid: ${JSON.stringify(value)}`
      );
    }
  }

  /**
   * @throws {@link KeyHashValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    return { string: val };
  }

  /**
   * @throws {@link KeyHashValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);

    if (semantic && semantic[KeyHashToken.prim]) {
      return semantic[KeyHashToken.prim](val);
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

  compare(pkh1: string, pkh2: string): number {
    // binary type tag actually reflects the expected prefix order
    const h1 = b58DecodePublicKeyHash(pkh1, 'array');
    const h2 = b58DecodePublicKeyHash(pkh2, 'array');
    return compareArrays(h1, h2);
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (KeyHashToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
