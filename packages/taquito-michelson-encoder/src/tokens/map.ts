import { Token, TokenFactory, Semantic, TokenValidationError } from './token';

export class MapValidationError extends TokenValidationError {
  name: string = 'MapValidationError';
  constructor(public value: any, public token: MapToken, message: string) {
    super(value, token, message);
  }
}

export class MapToken extends Token {
  static prim = 'map';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  get ValueSchema() {
    return this.createToken(this.val.args[1], 0);
  }

  get KeySchema(): Token & { ToKey: (x: any) => string } {
    return this.createToken(this.val.args[0], 0) as any;
  }

  private isValid(value: any): MapValidationError | null {
    if (typeof value === 'object') {
      return null;
    }

    return new MapValidationError(value, this, 'Value must be an object');
  }

  public Execute(val: any[], semantics?: Semantic): { [key: string]: any } {
    return val.reduce((prev, current) => {
      return {
        ...prev,
        [this.KeySchema.ToKey(current.args[0])]: this.ValueSchema.Execute(
          current.args[1],
          semantics
        ),
      };
    }, {});
  }

  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return Object.keys(val).map(key => {
      return {
        prim: 'Elt',
        args: [this.KeySchema.Encode([key]), this.ValueSchema.EncodeObject(val[key])],
      };
    });
  }

  public EncodeObject(args: any): any {
    const val = args;

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return Object.keys(val).map(key => {
      return {
        prim: 'Elt',
        args: [this.KeySchema.EncodeObject(key), this.ValueSchema.EncodeObject(val[key])],
      };
    });
  }

  public ExtractSchema() {
    return {
      [this.KeySchema.ExtractSchema()]: this.ValueSchema.ExtractSchema(),
    };
  }
}
