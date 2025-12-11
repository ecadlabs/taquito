import { BaseTokenSchema } from '../../schema/types';
import {
  TokenFactory,
  ComparableToken,
  TokenValidationError,
  Token,
  SemanticEncoding,
} from '../token';
import { stripHexPrefix } from '@taquito/utils';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing Bytes
 */
export class BytesValidationError extends TokenValidationError {
  name = 'BytesValidationError';
  constructor(
    public value: any,
    public token: BytesToken,
    message: string
  ) {
    super(value, token, message);
  }
}

export class BytesToken extends ComparableToken {
  static prim: 'bytes' = 'bytes' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public ToBigMapKey(val: string) {
    return {
      key: { bytes: val },
      type: { prim: BytesToken.prim },
    };
  }

  /**
   * @throws {@link BytesValidationError}
   */
  private validate(val: any) {
    if (typeof val === 'string' && /^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
      return;
    }
    throw new BytesValidationError(val, this, `Invalid bytes: ${val}`);
  }

  private convertUint8ArrayToHexString(val: any) {
    return val.constructor === Uint8Array ? Buffer.from(val).toString('hex') : val;
  }

  /**
   * @throws {@link BytesValidationError}
   */
  public Encode(args: any[]): any {
    let val = args.pop();
    val = stripHexPrefix(this.convertUint8ArrayToHexString(val));

    this.validate(val);

    return { bytes: String(val).toString() };
  }

  /**
   * @throws {@link BytesValidationError}
   */
  public EncodeObject(val: string | Uint8Array, semantic?: SemanticEncoding) {
    val = this.convertUint8ArrayToHexString(val);

    if (typeof val === 'string') {
      val = stripHexPrefix(val);
    }

    this.validate(val);

    if (semantic && semantic[BytesToken.prim]) {
      return semantic[BytesToken.prim](val);
    }

    return { bytes: String(val).toString() };
  }

  public Execute(val: any): string {
    return val.bytes;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: BytesToken.prim,
      schema: BytesToken.prim,
    };
  }

  public ToKey({ bytes, string }: any) {
    if (string) {
      return string;
    }

    return bytes;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (BytesToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
