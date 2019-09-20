import { createToken } from '../tokens/createToken';
import { Token } from '../tokens/token';
import { OrToken } from '../tokens/or';
import { OptionToken } from '../tokens/option';

/**
 * @warn Our current smart contract abstraction feature is currently in preview. It's API is not final, and it may not cover every use case (yet). We will greatly appreciate any feedback on this feature.
 */
export class ParameterSchema {
  private root: Token;

  static fromRPCResponse(val: any) {
    const parameter =
      val &&
      val.script &&
      val.script &&
      Array.isArray(val.script.code) &&
      val.script.code.find((x: any) => x.prim === 'parameter');
    if (!parameter || !Array.isArray(parameter.args)) {
      throw new Error('Invalid rpc response passed as arguments');
    }

    return new ParameterSchema(parameter.args[0]);
  }

  get isMultipleEntryPoint() {
    return (
      this.root instanceof OrToken ||
      (this.root instanceof OptionToken && this.root.subToken() instanceof OrToken)
    );
  }

  get hasAnnotation() {
    if (this.isMultipleEntryPoint) {
      return Object.keys(this.ExtractSchema())[0] !== '0';
    } else {
      return true;
    }
  }

  constructor(val: any) {
    this.root = createToken(val, 0);
  }

  Execute(val: any) {
    return this.root.Execute(val);
  }

  Encode(...args: any[]) {
    return this.root.Encode(args.reverse());
  }

  ExtractSchema() {
    return this.root.ExtractSchema();
  }
}
