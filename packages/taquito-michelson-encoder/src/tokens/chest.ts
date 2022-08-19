import { isValidHexDec } from '@taquito/utils';
import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

export class ChestValidationError extends TokenValidationError {
  name = 'ChestValidationError';
  constructor(public value: any, public token: ChestToken, message: string) {
    super(value, token, message);
  }
}
export class ChestToken extends Token {
  static prim: 'chest' = 'chest';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private isValid(val: any): ChestValidationError | null {
    if (isValidHexDec(val)) {
      return null;
    } else {
      return new ChestValidationError(val, this, `Invalid bytes: ${val}`);
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

    if (semantic && semantic[ChestToken.prim]) {
      return semantic[ChestToken.prim](val);
    }

    return { bytes: val };
  }

  public TypecheckValue(val: string | Uint8Array,) {
    val = this.convertUint8ArrayToHexString(val);
    const err = this.isValid(val);
    if (err) {
      throw err;
    }
  }

  Execute(val: any): string {
    return val.bytes;
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  public ExtractSchema() {
    return ChestToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: ChestToken.prim,
      schema: ChestToken.prim,
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (ChestToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
