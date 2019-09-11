import { createToken } from '../tokens/createToken';
import { Token } from '../tokens/token';
import { OrToken } from '../tokens/or';

export class ParameterSchema {
  private root: Token;

  static fromRPCResponse(val: any) {
    return new ParameterSchema(val.script.code.find((x: any) => x.prim === 'parameter')!.args[0]);
  }

  get isMultipleEntryPoint() {
    return this.root instanceof OrToken;
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
    return this.root.Encode(...args);
  }

  ExtractSchema() {
    return this.root.ExtractSchema();
  }
}
