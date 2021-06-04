import { Token, TokenFactory, TokenValidationError } from './token';

export class Bls12381frValidationError extends TokenValidationError {
  name: string = 'Bls12381frValidationError';
  constructor(public value: any, public token: Bls12381frToken, message: string) {
    super(value, token, message);
  }
}
export class Bls12381frToken extends Token {
  // An element of the BLS12-381 scalar field Fr
  // see https://tezos.gitlab.io/michelson-reference/#type-bls12_381_fr
  static prim = 'bls12_381_fr';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private isValid(val: any): Bls12381frValidationError | null {
    if (typeof val === 'string' && /^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
      return null;
    } else {
      return new Bls12381frValidationError(val, this, `Invalid bytes: ${val}`);
    }
  }

  Encode(args: any[]) {
    const val = args.pop();
    if (typeof val === 'number') {
      return { int: val.toString() };
    } else {
      const err = this.isValid(val);
      if (err) {
        throw err;
      }
      return { bytes: val };
    }
  }

  EncodeObject(val: string | number) {
    if (typeof val === 'number') {
      return { int: val.toString() };
    } else {
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

  public ExtractSchema() {
    return Bls12381frToken.prim;
  }
}
