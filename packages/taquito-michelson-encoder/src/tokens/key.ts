import { ComparableToken, Token, TokenFactory, TokenValidationError } from './token';
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

export class KeyValidationError extends TokenValidationError {
  name = 'KeyValidationError';
  constructor(public value: any, public token: KeyToken, message: string) {
    super(value, token, message);
  }
}

export class KeyToken extends ComparableToken {
  static prim: 'key' = 'key';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: { bytes: string; string: string }): string {
    if (val.string) {
      return val.string;
    }

    return encodeKey(val.bytes);
  }

  private isValid(value: any): KeyValidationError | null {
    if (validatePublicKey(value) !== ValidationResult.VALID) {
      return new KeyValidationError(value, this, 'Key is not valid');
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

  private getPrefix(val: string) {
    return val.substring(0, publicKeyPrefixLength);
  }

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
