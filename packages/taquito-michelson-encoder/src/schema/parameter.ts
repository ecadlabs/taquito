import { createToken } from '../tokens/createToken';
import { Token, Semantic, TokenValidationError, SemanticEncoding } from '../tokens/token';
import { OrToken } from '../tokens/or';
import { OptionToken } from '../tokens/option';
import { ScriptResponse, MichelsonV1ExpressionExtended, MichelsonV1Expression } from '@taquito/rpc';
import { TokenSchema } from './types';
import { InvalidRpcResponseError, ParameterEncodingError } from './errors';

/**
 * @warn Our current smart contract abstraction feature is currently in preview. It's API is not final, and it may not cover every use case (yet). We will greatly appreciate any feedback on this feature.
 */
export class ParameterSchema {
  private root: Token;

  /**
   *
   * @description Create an instance of ParameterSchema from a contract script
   *
   * @param val contract script obtained from the RPC
   * @returns ParameterSchema
   * @throws {InvalidRpcResponseError} If the RPC response is invalid
   */
  static fromRPCResponse(val: { script: ScriptResponse }) {
    if (!val) {
      throw new InvalidRpcResponseError(val, 'the RPC response is empty');
    }
    if (!val.script) {
      throw new InvalidRpcResponseError(val, 'the RPC response has no script');
    }
    if (!Array.isArray(val.script.code)) {
      throw new InvalidRpcResponseError(val, 'The response.script.code should be an array');
    }
    const parameter = val.script.code.find(
      (x) => 'prim' in x && x.prim === 'parameter'
    ) as MichelsonV1ExpressionExtended;
    if (!parameter) {
      throw new InvalidRpcResponseError(
        val,
        `The response.script.code should have an element of type {prim: "parameter"}`
      );
    }
    if (!Array.isArray(parameter.args)) {
      throw new InvalidRpcResponseError(
        val,
        `The response.script.code has an element of type {prim: "parameter"}, but its args is not an array`
      );
    }
    return new ParameterSchema(parameter.args[0]);
  }

  /**
   * @description Check if the Contract parameter is multiple entry point or not
   */
  get isMultipleEntryPoint() {
    return (
      this.root instanceof OrToken ||
      (this.root instanceof OptionToken && this.root.subToken() instanceof OrToken)
    );
  }

  /**
   * @description Check if the Contract parameter has an annotation or not
   */
  get hasAnnotation() {
    if (this.isMultipleEntryPoint) {
      return Object.keys(this.generateSchema())[0] !== '0';
    } else {
      return true;
    }
  }

  /**
   * @description Return the schema of the parameter of a specific entry point
   * @throws {@link InvalidTokenError}
   */
  constructor(val: MichelsonV1Expression) {
    this.root = createToken(val, 0);
  }

  /**
   * @description Returns the javascript object equivalent of the Micheline value provided
   */
  Execute(val: any, semantics?: Semantic) {
    return this.root.Execute(val, semantics);
  }

  /**
   * @description Returns a micheline formatted object for the values provided
   * @throws {@link TokenValidationError}
   * @throws {@link ParameterEncodingError}
   */
  Encode(...args: any[]) {
    try {
      return this.root.Encode(args.reverse());
    } catch (ex) {
      if (ex instanceof TokenValidationError) {
        throw ex;
      }
      throw new ParameterEncodingError('Unable to encode parameter', this.root, args, ex);
    }
  }

  /**
   * @description Returns a micheline formatted object for the javascript object provided
   * @throws {@link TokenValidationError}
   * @throws {@link ParameterEncodingError}
   */
  EncodeObject(value?: any, semantics?: SemanticEncoding) {
    try {
      return this.root.EncodeObject(value, semantics);
    } catch (ex) {
      if (ex instanceof TokenValidationError) {
        throw ex;
      }
      throw new ParameterEncodingError('Unable to encode parameter object', this.root, value, ex);
    }
  }

  /**
   * @description Produce a schema grouping together all the entry points of a contract.
   */
  generateSchema(): TokenSchema {
    return this.root.generateSchema();
  }

  ExtractSignatures() {
    return this.root.ExtractSignature();
  }
}
