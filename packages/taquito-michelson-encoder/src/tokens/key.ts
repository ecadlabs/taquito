import {
  ComparableToken,
  SemanticEncoding,
  Token,
  TokenFactory,
  TokenValidationError,
} from './token';
import {
  b58DecodePublicKey,
  compareArrays,
  encodeKey,
  validatePublicKey,
  ValidationResult,
} from '@taquito/utils';
import { BaseTokenSchema } from '../schema/types';
import elliptic from 'elliptic';
const ec = new elliptic.ec('p256');

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

  decompressP256PublicKey(compressedKey: Uint8Array) {
    const compressedArray = Array.from(compressedKey);
    const keyPair = ec.keyFromPublic(compressedArray);
    const publicKey = keyPair.getPublic();
    const uncompressedArray = publicKey.encode('array', false);
    return Buffer.concat([new Uint8Array([0x02]), new Uint8Array(uncompressedArray)]); // add back prefix 0x02
  }

  compare(key1: string, key2: string): number {
    const bytes1 = b58DecodePublicKey(key1, 'array');
    const bytes2 = b58DecodePublicKey(key2, 'array');
    let array1: Uint8Array;
    let array2: Uint8Array;
    if (bytes1[0] === 0x02) {
      array1 = this.decompressP256PublicKey(bytes1.slice(1)); // remove prefix 0x02
    } else {
      array1 = bytes1;
    }
    if (bytes2[0] === 0x02) {
      array2 = this.decompressP256PublicKey(bytes2.slice(1)); // remove prefix 0x02
    } else {
      array2 = bytes2;
    }
    return compareArrays(array1, array2);
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (KeyToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
