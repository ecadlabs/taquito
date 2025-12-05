import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Chest Key
 */
export class ChestKeyValidationError extends TokenValidationError {
  name = 'ChestKeyValidationError';
  constructor(public value: any, public token: ChestKeyToken, message: string) {
    super(value, token, message);
  }
}
export class ChestKeyToken extends Token {
  static prim: 'chest_key' = 'chest_key' as const;

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
    if (/^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
      return;
    }
    throw new ChestKeyValidationError(val, this, `Invalid bytes: ${JSON.stringify(val)}`);
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

    if (semantic && semantic[ChestKeyToken.prim]) {
      return semantic[ChestKeyToken.prim](val);
    }

    return { bytes: val };
  }

  Execute(val: any): string {
    return val.bytes;
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
