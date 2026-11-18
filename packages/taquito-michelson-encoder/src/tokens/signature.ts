import {
  ComparableToken,
  SemanticEncoding,
  Token,
  TokenFactory,
  TokenValidationError,
} from './token';
import {
  b58DecodeAndCheckPrefix,
  b58Encode,
  compareArrays,
  PrefixV2,
  validateSignature,
  ValidationResult,
} from '@taquito/utils';
import { BaseTokenSchema } from '../schema/types';

/**
 *  @category Error
 *  Error that indicates a failure happening when parsing encoding/executing a Signature
 */
export class SignatureValidationError extends TokenValidationError {
  name = 'SignatureValidationError';
  constructor(public value: any, public token: SignatureToken, message: string) {
    super(value, token, message);
  }
}

export class SignatureToken extends ComparableToken {
  static prim: 'signature' = 'signature' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Execute(val: { [key: string]: string }): string {
    if (val.string) {
      return val.string;
    }
    if (typeof val.bytes === 'string') {
      if (val.bytes.length === 128) {
        return b58Encode(val.bytes, PrefixV2.GenericSignature);
      }
      if (val.bytes.length === 192) {
        return b58Encode(val.bytes, PrefixV2.BLS12_381Signature);
      }
      if (val.bytes.length === 4840) {
        return b58Encode(val.bytes, PrefixV2.MLDSA44Signature);
      }
    }
    return val.bytes;
  }

  /**
   * @throws {@link SignatureValidationError}
   */
  private validate(value: any) {
    if (validateSignature(value) !== ValidationResult.VALID) {
      throw new SignatureValidationError(value, this, 'Signature is not valid');
    }
  }

  /**
   * @throws {@link SignatureValidationError}
   */
  public Encode(args: any[]): any {
    const val = args.pop();

    this.validate(val);

    return { string: val };
  }

  /**
   * @throws {@link SignatureValidationError}
   */
  public EncodeObject(val: any, semantic?: SemanticEncoding): any {
    this.validate(val);

    if (semantic && semantic[SignatureToken.prim]) {
      return semantic[SignatureToken.prim](val);
    }

    return { string: val };
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: SignatureToken.prim,
      schema: SignatureToken.prim,
    };
  }

  ToKey(val: any) {
    return this.Execute(val);
  }

  ToBigMapKey(val: string) {
    return {
      key: { string: val },
      type: { prim: SignatureToken.prim },
    };
  }

  compare(sig1: string, sig2: string): number {
    const [bytes1] = b58DecodeAndCheckPrefix(sig1);
    const [bytes2] = b58DecodeAndCheckPrefix(sig2);
    const res = compareArrays(bytes1, bytes2);
    if (res !== 0) {
      return res;
    }
    return bytes1.length < bytes2.length ? -1 : bytes1.length > bytes2.length ? 1 : 0;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (SignatureToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
