// Type: {"prim":"storage","args":[{"prim":"sapling_state","args":[{"int":"8"}]}]}
// Value(write): {} Is it always empty, can we pass a nat?
// Value(read) "storage":{"int":"14"} ***incremental number***

import BigNumber from 'bignumber.js';
import { IntToken } from './comparable/int';
import { Token, TokenFactory, Semantic, TokenValidationError } from './token';

export class SaplingStateValidationError extends TokenValidationError {
    name: string = 'SaplingStateValidationError';
    constructor(public value: any, public token: SaplingStateToken, message: string) {
      super(value, token, message);
    }
  }

export class SaplingStateToken extends Token {
  static prim = 'sapling_state';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private isValid(val: any): SaplingStateValidationError | null {
    if (val ! == {}) {
      return new SaplingStateValidationError(val, this, `Value is not an empty sapling state "{}": ${val}`);
    } else {
      return null;
    }
  }

  // arg to Michelson
  public Encode(args: any[]): any {
    const val = args.pop();

    const err = this.isValid(val);
    if (err) {
      throw err;
    }

    return val;
  }

  public EncodeObject(val: any): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }
    return val;
  }

  // Michelson to args
  public Execute(val: any, _semantics?: Semantic) {
      if('int' in val) {
          // is this better?? return sapling_state: new BigNumber(val.int)
          return val.int;
      } else {
          throw new Error(
            `sapling_state is expecting an object with an int property. Got ${JSON.stringify(val)}`
          )
  }
}

  public ExtractSchema() {
    return {
        sapling_state: IntToken.prim
    }
  }
}
