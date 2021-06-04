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
    if (typeof val === 'string' && /^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
      return null;
    } else {
      return new Bls12381g2ValidationError(val, this, `Invalid bytes: ${val}`);
    }
  }

  Encode(args: any[]) {
    const val = args.pop();
    const err = this.isValid(val);
    if (err) {
      throw err;
    }
    return { bytes: val };
  }

  EncodeObject(val: string | number) {
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
}
