import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Chest
 */
export class ChestValidationError extends TokenValidationError {
  name = 'ChestValidationError';
  constructor(
    public value: any,
    public token: ChestToken,
    message: string
  ) {
    super(value, token, message);
  }
}
export class ChestToken extends Token {
  static prim: 'chest' = 'chest' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  /**
   * @throws {@link ChestKeyValidationError}
   */
  private validate(val: any) {
    if (/^[0-9a-fA-F]*$/.test(val) && val.length % 2 == 0) {
      return;
    }
    throw new ChestValidationError(val, this, `Invalid bytes: ${JSON.stringify(val)}`);
  }

  private convertUint8ArrayToHexString(val: any) {
    return val.constructor === Uint8Array ? Buffer.from(val).toString('hex') : val;
  }

  /**
   * @throws {@link ChestKeyValidationError}
   */
  Encode(args: any[]) {
    let val = args.pop();
    val = this.convertUint8ArrayToHexString(val);
    this.validate(val);
    return { bytes: val };
  }

  /**
   * @throws {@link ChestKeyValidationError}
   */
  EncodeObject(val: string | Uint8Array, semantic?: SemanticEncoding) {
    val = this.convertUint8ArrayToHexString(val);
    this.validate(val);

    if (semantic && semantic[ChestToken.prim]) {
      return semantic[ChestToken.prim](val);
    }

    return { bytes: val };
  }

  Execute(val: any): string {
    return val.bytes;
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
