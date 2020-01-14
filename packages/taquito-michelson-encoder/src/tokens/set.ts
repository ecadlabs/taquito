import { Token, TokenFactory, Semantic, TokenValidationError } from './token';

export class SetValidationError extends TokenValidationError {
  name: string = 'SetValidationError';
  constructor(public value: any, public token: SetToken, message: string) {
    super(value, token, message);
  }
}

export class SetToken extends Token {
  static prim = 'set';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private isValid(value: any): SetValidationError | null {
    if (Array.isArray(value)) {
      return null;
    }

    return new SetValidationError(value, this, 'Value must be an array');
  }

  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    const schema = this.createToken(this.val.args[0], 0);
    return val.reduce((prev: any, current: any) => {
      return [...prev, schema.EncodeObject(current)];
    }, []);
  }

  public Execute(val: any, semantics?: Semantic) {
    const schema = this.createToken(this.val.args[0], 0);
    return val.reduce((prev: any, current: any) => {
      return [...prev, schema.Execute(current, semantics)];
    }, []);
  }

  public EncodeObject(args: any): any {
    const err = this.isValid(args);
    if (err) {
      throw err;
    }

    const schema = this.createToken(this.val.args[0], 0);
    return args.reduce((prev: any, current: any) => {
      return [...prev, schema.EncodeObject(current)];
    }, []);
  }

  public ExtractSchema() {
    return SetToken.prim;
  }
}
