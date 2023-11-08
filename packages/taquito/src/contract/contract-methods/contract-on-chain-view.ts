import { ViewSchema } from '@taquito/michelson-encoder';
import {
  MichelsonV1Expression,
  MichelsonV1ExpressionExtended,
  RpcClientInterface,
  RPCRunCodeParam,
  RPCRunScriptViewParam,
} from '@taquito/rpc';
import { validateAddress, ValidationResult } from '@taquito/utils';
import { TzReadProvider } from '../../read-provider/interface';
import {
  InvalidViewSimulationContext,
  ViewSimulationError,
  validateAndExtractFailwith,
} from '../errors';
import { InvalidViewParameterError } from '@taquito/core';
import stringify from 'json-stringify-safe';

export interface ExecutionContextParams {
  source?: string;
  viewCaller: string;
}

export class OnChainView {
  constructor(
    private _rpc: RpcClientInterface,
    private _readProvider: TzReadProvider,
    private _contractAddress: string,
    private _smartContractViewSchema: ViewSchema,
    private _contractStorageType: MichelsonV1Expression,
    private _args: any = 'Unit'
  ) {}

  /**
   * @description Get the signature of the smart contract view
   */
  getSignature() {
    return {
      parameter: this._smartContractViewSchema.extractArgsSchema(),
      result: this._smartContractViewSchema.extractResultSchema(),
    };
  }

  /**
   * @description Get the result of the view simulation
   * @param executionContext.source the public key hash of the account who initialized this view execution.
   * @param executionContext.viewCaller the contract address which is the caller of view.
   */
  async executeView(executionContext: ExecutionContextParams) {
    this.verifyContextExecution(executionContext);
    const chainId = await this._readProvider.getChainId();
    const viewArgs = this.transformArgsToMichelson();
    const scriptView: RPCRunScriptViewParam = {
      contract: this._contractAddress,
      view: this._smartContractViewSchema.viewName,
      input: viewArgs,
      chain_id: chainId,
      source: executionContext.viewCaller,
    };
    if (executionContext.source) {
      scriptView.payer = executionContext.source;
    }
    return this.executeViewAndDecodeResult(scriptView);
  }

  private verifyContextExecution(executionContext: ExecutionContextParams) {
    if (
      executionContext.source &&
      validateAddress(executionContext.source) !== ValidationResult.VALID
    ) {
      throw new InvalidViewSimulationContext(
        `The source account who initialized the view execution is invalid: ${executionContext.source}.`
      );
    }
    if (
      !executionContext.viewCaller ||
      validateAddress(executionContext.viewCaller) !== ValidationResult.VALID
    ) {
      throw new InvalidViewSimulationContext(
        `The contract which is the caller of view is invalid: ${executionContext.viewCaller}.`
      );
    }
  }

  private transformArgsToMichelson() {
    try {
      return this._smartContractViewSchema.encodeViewArgs(this._args);
    } catch (error) {
      throw new InvalidViewParameterError(
        this._smartContractViewSchema.viewName,
        this.getSignature(),
        this._args,
        error
      );
    }
  }
  /**
   * @description Loops through the view's instructions and replace BALANCE, SENDER, SELF_ADDRESS and AMOUNT with Michelson expressions that match the current context, if applicable.
   *
   * Certain specific instructions have different semantics in view:
   * BALANCE represents the current amount of mutez held by the contract where view is;
   * SENDER represents the contract which is the caller of view;
   * SELF_ADDRESS represents the contract where view is;
   * AMOUNT is always 0 mutez.
   *
   */
  private adaptViewCodeToContext(
    instructions: MichelsonV1ExpressionExtended[],
    viewCaller: string,
    contractBalance: string
  ) {
    const instructionsToReplace = {
      BALANCE: [{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: contractBalance }] }],
      SENDER: [{ prim: 'PUSH', args: [{ prim: 'address' }, { string: viewCaller }] }],
      SELF_ADDRESS: [
        { prim: 'PUSH', args: [{ prim: 'address' }, { string: this._contractAddress }] },
      ],
      AMOUNT: [{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] }],
    };

    instructions.forEach((inst: any, i: number) => {
      if (inst.prim in instructionsToReplace) {
        instructions[i] = Object(instructionsToReplace)[inst.prim];
      }
      if (inst.args && inst.args.length !== 0) {
        this.adaptViewCodeToContext(inst.args, viewCaller, contractBalance);
      } else if (Array.isArray(inst)) {
        this.adaptViewCodeToContext(inst, viewCaller, contractBalance);
      }
    });
    return instructions;
  }

  private async executeViewAndDecodeResult(viewScript: RPCRunScriptViewParam | RPCRunCodeParam) {
    let storage: MichelsonV1ExpressionExtended;
    try {
      storage = (await this._rpc.runScriptView(viewScript as RPCRunScriptViewParam))
        .data as MichelsonV1ExpressionExtended;
    } catch (error: any) {
      const failWith = validateAndExtractFailwith(error);
      throw failWith
        ? new ViewSimulationError(
            `The simulation of the on-chain view named ${
              this._smartContractViewSchema.viewName
            } failed with: ${stringify(failWith)}`,
            this._smartContractViewSchema.viewName,
            failWith,
            error
          )
        : error;
    }
    return this._smartContractViewSchema.decodeViewResult(storage);
  }
}
