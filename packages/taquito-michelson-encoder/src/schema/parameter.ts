import { createToken } from '../tokens/createToken';
import { Token, Semantic, TokenValidationError } from '../tokens/token';
import { OrToken } from '../tokens/or';
import { OptionToken } from '../tokens/option';
import { ScriptResponse, MichelsonV1ExpressionExtended, MichelsonV1Expression } from '@taquito/rpc';
import { Falsy } from './types';

/**
 * @warn Our current smart contract abstraction feature is currently in preview. It's API is not final, and it may not cover every use case (yet). We will greatly appreciate any feedback on this feature.
 */
export class ParameterSchema {
  private root: Token;

  static fromRPCResponse(val: { script: ScriptResponse }) {
    const parameter: Falsy<MichelsonV1ExpressionExtended> =
      val &&
      val.script &&
      Array.isArray(val.script.code) &&
      (val.script.code.find((x: any) => x.prim === 'parameter') as MichelsonV1ExpressionExtended);
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

  constructor(val: MichelsonV1Expression) {
    this.root = createToken(val, 0);
  }

  Execute(val: any, semantics?: Semantic) {
    return this.root.Execute(val, semantics);
  }

  Encode(...args: any[]) {
    try {
      return this.root.Encode(args.reverse());
    } catch (ex) {
      if (ex instanceof TokenValidationError) {
        throw ex;
      }

      throw new Error(`Unable to encode storage object. ${ex}`);
    }
  }

  ExtractSchema() {
    return this.root.ExtractSchema();
  }

  ExtractSignatures() {
    return this.root.ExtractSignature();
  }
}
