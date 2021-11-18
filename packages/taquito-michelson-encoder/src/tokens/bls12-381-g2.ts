import { Token, TokenFactory, TokenValidationError } from './token';

export class Bls12381g2ValidationError extends TokenValidationError {
  name: string = 'Bls12381g2ValidationError';
  constructor(public value: any, public token: Bls12381g2Token, message: string) {
    super(value, token, message);
  }
}
export class Bls12381g2Token extends Token {
  // A point on the BLS12-381 curve G2
  // See https://tezos.gitlab.io/michelson-reference/#type-bls12_381_g2
  static prim = 'bls12_381_g2';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private isValid(val: any): Bls12381g2ValidationError | null {
    if ( /^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
      return null;
    } else {
      return new Bls12381g2ValidationError(val, this, `Invalid bytes: ${val}`);
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
    return Bls12381g2Token.prim;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (Bls12381g2Token.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  };

}
