import { Token, TokenFactory, TokenValidationError } from './token';

export class ChestKeyValidationError extends TokenValidationError {
  name = 'ChestKeyValidationError';
  constructor(public value: any, public token: ChestKeyToken, message: string) {
    super(value, token, message);
  }
}
export class ChestKeyToken extends Token {
  static prim = 'chest_key';

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

  EncodeObject(val: string | Uint8Array) {
    val = this.convertUint8ArrayToHexString(val);
    const err = this.isValid(val);
    if (err) {
      throw err;
    }
    return { bytes: val };
  }

  Execute(val: any): string {
    return val.bytes;
  }

  public ExtractSchema() {
    return ChestKeyToken.prim;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (ChestKeyToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
