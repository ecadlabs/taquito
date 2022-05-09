import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

export class ChestKeyValidationError extends TokenValidationError {
  name = 'ChestKeyValidationError';
  constructor(public value: any, public token: ChestKeyToken, message: string) {
    super(value, token, message);
  }
}
export class ChestKeyToken extends Token {
  static prim: 'chest_key' = 'chest_key';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private isValid(val: any): ChestKeyValidationError | null {
    if (/^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
      return null;
    } else {
      return new ChestKeyValidationError(val, this, `Invalid bytes: ${val}`);
    }
  }

  private convertUint8ArrayToHexString(val: any) {
    return val.constructor === Uint8Array ? Buffer.from(val).toString('hex') : val;
  }

  Encode(args: any[]) {
    let val = args.pop();
    val = this.convertUint8ArrayToHexString(val);
    const err = this.isValid(val);
    if (err) {
      throw err;
    }
    return { bytes: val };
  }

  EncodeObject(val: string | Uint8Array, semantic?: SemanticEncoding) {
    val = this.convertUint8ArrayToHexString(val);
    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    if (semantic && semantic[ChestKeyToken.prim]) {
      return semantic[ChestKeyToken.prim](val);
    }

    return { bytes: val };
  }

  Execute(val: any): string {
    return val.bytes;
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return ChestKeyToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: ChestKeyToken.prim,
      schema: ChestKeyToken.prim,
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (ChestKeyToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
