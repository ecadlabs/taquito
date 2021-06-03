import { Token, TokenFactory } from './token';

export class Bls12381frToken extends Token {
  static prim = 'bls12_381_fr';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  Encode(args: any[]): any {
    const val = args.pop();
    return { bytes: val.toString() };
  }

  EncodeObject(val: any): any {
    return { bytes: val.toString() };
  }

  Execute(val: any): string {
      console.log('execute', val)
    return val[Object.keys(val)[0]];
  }

  public ExtractSchema() {
    return Bls12381frToken.prim;
  }
}
