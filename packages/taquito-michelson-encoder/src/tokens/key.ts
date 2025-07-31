import {
  ComparableToken,
  SemanticEncoding,
  Token,
  TokenFactory,
  TokenValidationError,
} from './token';
import {
  encodeKey,
  validatePublicKey,
  ValidationResult,
  Prefix,
  b58cdecode,
  prefix,
} from '@taquito/utils';
import { BaseTokenSchema } from '../schema/types';

const publicKeyPrefixLength = 4;

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
    const keyPrefix1 = this.getPrefix(key1);
    const keyPrefix2 = this.getPrefix(key2);

    if (keyPrefix1 === Prefix.Ed25519PublicKey && keyPrefix2 !== Prefix.Ed25519PublicKey) {
      return -1;
    } else if (keyPrefix1 === Prefix.Secp256k1PublicKey && keyPrefix2 !== Prefix.Secp256k1PublicKey) {
      return keyPrefix2 === Prefix.Ed25519PublicKey ? 1 : -1;
    } else if (keyPrefix1 === Prefix.P256PublicKey) {
      if (keyPrefix2 !== Prefix.P256PublicKey) {
        return 1;
      }

      const keyBytes1 = this.getP256PublicKeyComparableBytes(key1);
      const keyBytes2 = this.getP256PublicKeyComparableBytes(key2);
      return Buffer.compare(keyBytes1, keyBytes2);
    }

    return super.compare(key1, key2);
  }

  private getPrefix(val: string) {
    return val.substring(0, publicKeyPrefixLength);
  }

  private getP256PublicKeyComparableBytes(p2pk: string) {
    return b58cdecode(p2pk, prefix[Prefix.P256PublicKey]).slice(1);
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (KeyToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
