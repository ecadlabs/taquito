import { SaplingTransactionDeprecatedTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a Sapling Transaction Deprecated
 */
export class SaplingTransactionDeprecatedValidationError extends TokenValidationError {
  name = 'SaplingTransactionDeprecatedValidationError';
  constructor(
    public value: any,
    public token: SaplingTransactionDeprecatedToken,
    message: string
  ) {
    super(value, token, message);
  }
}

export class SaplingTransactionDeprecatedToken extends Token {
  static prim: 'sapling_transaction_deprecated' = 'sapling_transaction_deprecated' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  /**
   * @throws {@link SaplingTransactionDeprecatedValidationError}
   */
  Execute(_val: any) {
    throw new SaplingTransactionDeprecatedValidationError(
      _val,
      this,
      `There is no literal value for the sapling_transaction_deprecated type. Got: ${JSON.stringify(
        _val
      )}.`
    );
  }

  /**
   * @throws {@link SaplingTransactionDeprecatedValidationError}
   */
  private validateBytes(val: any) {
    const bytes = /^(0x|0X)?([0-9a-fA-F]*$)/.exec(val);
    if (bytes && bytes[2].length % 2 === 0) {
      return bytes[2];
    } else {
      throw new SaplingTransactionDeprecatedValidationError(
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
    if (semantic && semantic[SaplingTransactionDeprecatedToken.prim]) {
      return semantic[SaplingTransactionDeprecatedToken.prim](val);
    }
    return { bytes: String(val).toString() };
  }

  generateSchema(): SaplingTransactionDeprecatedTokenSchema {
    return {
      __michelsonType: SaplingTransactionDeprecatedToken.prim,
      schema: {
        memoSize: this.val.args[0]['int'],
      },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (SaplingTransactionDeprecatedToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
