import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a BLS12-381 scalar field Fr
 */
export class Bls12381frValidationError extends TokenValidationError {
  name = 'Bls12381frValidationError';
  constructor(public value: any, public token: Bls12381frToken, message: string) {
    super(value, token, message);
  }
}
export class Bls12381frToken extends Token {
  // An element of the BLS12-381 scalar field Fr
  // see https://tezos.gitlab.io/michelson-reference/#type-bls12_381_fr
  static prim: 'bls12_381_fr' = 'bls12_381_fr' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  /**
   * @throws {@link Bls12381frValidationError}
   */
  private validate(val: any) {
    if (/^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
      return;
    }
    throw new Bls12381frValidationError(val, this, `Invalid bytes: ${JSON.stringify(val)}`);
  }

  private convertUint8ArrayToHexString(val: any) {
    return val.constructor === Uint8Array ? Buffer.from(val).toString('hex') : val;
  }

  /**
   * @throws {@link Bls12381frValidationError}
   */
  Encode(args: any[]) {
    let val = args.pop();
    if (typeof val === 'number') {
      return { int: val.toString() };
    } else {
      val = this.convertUint8ArrayToHexString(val);
      this.validate(val);
      return { bytes: val };
    }
  }

  /**
   * @throws {@link Bls12381frValidationError}
   */
  EncodeObject(val: string | Uint8Array | number, semantic?: SemanticEncoding) {
    if (semantic && semantic[Bls12381frToken.prim]) {
      return semantic[Bls12381frToken.prim](val);
    }
    if (typeof val === 'number') {
      return { int: val.toString() };
    } else {
      val = this.convertUint8ArrayToHexString(val);
      this.validate(val);
      return { bytes: val };
    }
  }

  Execute(val: any): string {
    return val.bytes;
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
