import { SaplingTransactionTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Sapling Transaction
 */
export class SaplingTransactionValidationError extends TokenValidationError {
  name = 'SaplingTransactionValidationError';
  constructor(public value: any, public token: SaplingTransactionToken, message: string) {
    super(value, token, message);
  }
}

export class SaplingTransactionToken extends Token {
  static prim: 'sapling_transaction' = 'sapling_transaction' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  /**
   * @throws {@link SaplingTransactionValidationError}
   */
  Execute(_val: any) {
    throw new SaplingTransactionValidationError(
      _val,
      this,
      `There is no literal value for the sapling_transaction type. Got: ${JSON.stringify(_val)}.`
    );
  }

  /**
   * @throws {@link SaplingTransactionValidationError}
   */
  private validateBytes(val: any) {
    const bytes = /^(0x|0X)?([0-9a-fA-F]*$)/.exec(val);
    if (bytes && bytes[2].length % 2 === 0) {
      return bytes[2];
    } else {
      throw new SaplingTransactionValidationError(
        val,
        this,
        `Invalid bytes: ${JSON.stringify(val)}`
      );
    }
  }

  private convertUint8ArrayToHexString(val: Uint8Array | string) {
    return val.constructor === Uint8Array ? Buffer.from(val).toString('hex') : val;
  }

  Encode(args: any[]): any {
    let val = args.pop();
    val = this.validateBytes(this.convertUint8ArrayToHexString(val));
    return { bytes: String(val).toString() };
  }

  EncodeObject(val: string | Uint8Array, semantic?: SemanticEncoding) {
    val = this.validateBytes(this.convertUint8ArrayToHexString(val));
    if (semantic && semantic[SaplingTransactionToken.prim]) {
      return semantic[SaplingTransactionToken.prim](val);
    }
    return { bytes: String(val).toString() };
  }

  generateSchema(): SaplingTransactionTokenSchema {
    return {
      __michelsonType: SaplingTransactionToken.prim,
      schema: {
        memoSize: this.val.args[0]['int'],
      },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (SaplingTransactionToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
