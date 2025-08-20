import {
  ComparableToken,
  SemanticEncoding,
  Token,
  TokenFactory,
  TokenValidationError,
} from './token';
import {
  // b58DecodePublicKey,
  // compareArrays,
  encodeKey,
  validatePublicKey,
  ValidationResult,
  b58cdecode,
  prefix,
  Prefix, // TODO: will be removed once compare function is sorted
} from '@taquito/utils';
import { BaseTokenSchema } from '../schema/types';

const publicKeyPrefixLength = 4; // TODO: will be removed once compare function is sorted

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Key
 */
export class KeyValidationError extends TokenValidationError {
  name = 'KeyValidationError';
  constructor(
    public value: any,
    public token: KeyToken,
    message: string
  ) {
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
    //   const bytes1 = b58DecodePublicKey(key1, 'array');
    //   const bytes2 = b58DecodePublicKey(key2, 'array');
    //   return compareArrays(bytes1, bytes2);

    // TODO: rolled back to previous compare logic for now until figured out proto.023-PtSeouLo.michelson_v1.unordered_map_literal rpc error hence currently doesn't support comparing BLS12_381PublicKey
    const keyPrefix1 = this.getPrefix(key1);
    const keyPrefix2 = this.getPrefix(key2);

    if (keyPrefix1 === Prefix.EDPK && keyPrefix2 !== Prefix.EDPK) {
      return -1;
    } else if (keyPrefix1 === Prefix.SPPK && keyPrefix2 !== Prefix.SPPK) {
      return keyPrefix2 === Prefix.EDPK ? 1 : -1;
    } else if (keyPrefix1 === Prefix.P2PK) {
      if (keyPrefix2 !== Prefix.P2PK) {
        return 1;
      }

      const keyBytes1 = this.getP256PublicKeyComparableBytes(key1);
      const keyBytes2 = this.getP256PublicKeyComparableBytes(key2);
      return Buffer.compare(keyBytes1, keyBytes2);
    }

    return super.compare(key1, key2);
  }

  // TODO: will be removed once compare function is sorted
  private getPrefix(val: string) {
    return val.substring(0, publicKeyPrefixLength);
  }

  // TODO: will be removed once compare function is sorted
  private getP256PublicKeyComparableBytes(p2pk: string) {
    return b58cdecode(p2pk, prefix[Prefix.P2PK]).slice(1);
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (KeyToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
