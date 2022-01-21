import { SaplingTransactionTokenSchema } from '../schema/types';
import { Token, TokenFactory, TokenValidationError } from './token';

export class SaplingTransactionValidationError extends TokenValidationError {
  name = 'SaplingTransactionValidationError';
  constructor(public value: any, public token: SaplingTransactionToken, message: string) {
    super(value, token, message);
  }
}

export class SaplingTransactionToken extends Token {
  static prim: 'sapling_transaction' = 'sapling_transaction';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  Execute(_val: any) {
    throw new Error('There is no literal value for the sapling_transaction type.');
  }

  private validateBytes(val: any) {
    const bytes = /^(0x|0X)?([0-9a-fA-F]*$)/.exec(val);
    if (bytes && bytes[2].length % 2 === 0) {
      return bytes[2];
    } else {
      throw new SaplingTransactionValidationError(val, this, `Invalid bytes: ${val}`);
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

  EncodeObject(val: string | Uint8Array) {
    val = this.validateBytes(this.convertUint8ArrayToHexString(val));
    return { bytes: String(val).toString() };
  }

  /**
   * @deprecated ExtractSchema has been deprecated in favor of generateSchema
   *
   */
  ExtractSchema() {
    return {
      [SaplingTransactionToken.prim]: {
        'memo-size': Number(this.val.args[0]['int']),
      },
    };
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
