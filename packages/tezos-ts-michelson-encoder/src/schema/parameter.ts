import { createToken } from "../tokens/createToken";
import { Token } from "../tokens/token";

export class ParameterSchema {
  private root: Token;

  static fromRPCResponse(val: any) {
    return new ParameterSchema(val.script.code.find((x: any) => x.prim === "parameter")!.args[0]);
  }

  constructor(val: any) {
    this.root = createToken(val, 0);
  }

  Execute(val: any) {
    return this.root.Execute(val);
  }

  ExtractSchema() {
    return this.root.ExtractSchema();
  }
}
