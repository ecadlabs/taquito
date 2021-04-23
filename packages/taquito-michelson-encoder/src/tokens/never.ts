import { Token, TokenFactory, TokenValidationError } from './token';

export class NeverValidationError extends TokenValidationError {
    name: string = 'NeverValidationError';
    constructor(public value: any, public token: NeverToken, message: string) {
      super(value, token, message);
    }
  }

export class NeverToken extends Token {
  static prim = 'never';
  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }
  public Encode(args: any[]): any {
    const val = args.pop();
    throw new NeverValidationError(val, this, 'Assigning a value to the type never is forbidden.');
  }
  public EncodeObject(val: any): any {
    throw new NeverValidationError(val, this, 'Assigning a value to the type never is forbidden.');
  }
  public Execute(val: any) {
    throw new NeverValidationError(val, this, 'There are no literal values for the type never.');
  }
  public ExtractSchema() {
    return NeverToken.prim;
  }
}