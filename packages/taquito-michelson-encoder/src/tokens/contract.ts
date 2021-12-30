import { encodePubKey, validateAddress, ValidationResult } from '@taquito/utils';
import { Token, TokenFactory, TokenValidationError } from './token';

export class ContractValidationError extends TokenValidationError {
  name = 'ContractValidationError';
  constructor(public value: any, public token: ContractToken, message: string) {
    super(value, token, message);
  }
}

export class ContractToken extends Token {
  static prim = 'contract';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  private isValid(value: any): ContractValidationError | null {
    // tz1,tz2 and tz3 seems to be valid contract values (for Unit contract)
    if (validateAddress(value) !== ValidationResult.VALID) {
      return new ContractValidationError(value, this, 'Contract address is not valid');
    }

    return null;
  }

  public Execute(val: { bytes: string; string: string }) {
    if (val.string) {
      return val.string;
    }

    return encodePubKey(val.bytes);
  }

  public Encode(args: any[]): any {
    const val = args.pop();
    const err = this.isValid(val);
    if (err) {
      throw err;
    }
    return { string: val };
  }

  public EncodeObject(val: any): any {
    const err = this.isValid(val);
    if (err) {
      throw err;
    }
    return { string: val };
  }

  public ExtractSchema() {
    return ContractToken.prim;
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (ContractToken.prim === tokenToFind) {
      tokens.push(this);
    }
    return tokens;
  }
}
