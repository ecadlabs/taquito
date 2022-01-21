import { BaseTokenSchema } from '../schema/types';
import { Token, TokenFactory, TokenValidationError } from './token';

export class Bls12381frValidationError extends TokenValidationError {
  name = 'Bls12381frValidationError';
  constructor(public value: any, public token: Bls12381frToken, message: string) {
    super(value, token, message);
  }
}
export class Bls12381frToken extends Token {
  // An element of the BLS12-381 scalar field Fr
  // see https://tezos.gitlab.io/michelson-reference/#type-bls12_381_fr
  static prim: 'bls12_381_fr' = 'bls12_381_fr';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private isValid(val: any): Bls12381frValidationError | null {
    if (/^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
      return null;
    } else {
      return new Bls12381frValidationError(val, this, `Invalid bytes: ${val}`);
    }
  }

  private convertUint8ArrayToHexString(val: any) {
    return val.constructor === Uint8Array ? Buffer.from(val).toString('hex') : val;
  }

  Encode(args: any[]) {
    let val = args.pop();
    if (typeof val === 'number') {
      return { int: val.toString() };
    } else {
      val = this.convertUint8ArrayToHexString(val);
      const err = this.isValid(val);
      if (err) {
        throw err;
      }
      return { bytes: val };
    }
  }

  EncodeObject(val: string | Uint8Array | number) {
    if (typeof val === 'number') {
      return { int: val.toString() };
    } else {
      val = this.convertUint8ArrayToHexString(val);
      const err = this.isValid(val);
      if (err) {
        throw err;
      }
      return { bytes: val };
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
    return Bls12381frToken.prim;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: Bls12381frToken.prim,
      schema: Bls12381frToken.prim,
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (Bls12381frToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
