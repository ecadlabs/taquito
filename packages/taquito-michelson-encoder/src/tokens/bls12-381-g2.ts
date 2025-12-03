import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing a BLS12-381 curve G2
 */
export class Bls12381g2ValidationError extends TokenValidationError {
  name = 'Bls12381g2ValidationError';
  constructor(public value: any, public token: Bls12381g2Token, message: string) {
    super(value, token, message);
  }
}
export class Bls12381g2Token extends Token {
  // A point on the BLS12-381 curve G2
  // See https://tezos.gitlab.io/michelson-reference/#type-bls12_381_g2
  static prim: 'bls12_381_g2' = 'bls12_381_g2' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  /**
   * @throws {@link Bls12381g2ValidationError}
   */
  private validate(val: any) {
    if (/^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
      return;
    }
    throw new Bls12381g2ValidationError(val, this, `Invalid bytes: ${JSON.stringify(val)}`);
  }

  private convertUint8ArrayToHexString(val: any) {
    return val.constructor === Uint8Array ? Buffer.from(val).toString('hex') : val;
  }

  /**
   * @throws {@link Bls12381g2ValidationError}
   */
  Encode(args: any[]) {
    let val = args.pop();
    val = this.convertUint8ArrayToHexString(val);
    this.validate(val);
    return { bytes: val };
  }

  /**
   * @throws {@link Bls12381g2ValidationError}
   */
  EncodeObject(val: string | Uint8Array, semantic?: SemanticEncoding) {
    val = this.convertUint8ArrayToHexString(val);
    this.validate(val);
    if (semantic && semantic[Bls12381g2Token.prim]) {
      return semantic[Bls12381g2Token.prim](val);
    }
    return { bytes: val };
  }

  Execute(val: any): string {
    return val.bytes;
  }

  generateSchema(): BaseTokenSchema {
    return {
      __michelsonType: Bls12381g2Token.prim,
      schema: Bls12381g2Token.prim,
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (Bls12381g2Token.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
