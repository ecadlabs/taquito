import { ParameterSchema } from '@taquito/michelson-encoder';
import {
  RpcClientInterface,
  MichelsonV1Expression,
  MichelsonV1ExpressionExtended,
} from '@taquito/rpc';
import {
  ContractAbstraction,
  ContractProvider,
  Wallet,
  ViewSimulationError,
} from '@taquito/taquito';
import { ForbiddenInstructionInViewCodeError, NoParameterExpectedError } from '../errors';
import { validateAndExtractFailwith, TzReadProvider } from '@taquito/taquito';
import { View } from './interface';
import { InvalidViewParameterError } from '@taquito/core';

export class MichelsonStorageView implements View {
  constructor(
    private viewName: string,
    private contract: ContractAbstraction<ContractProvider | Wallet>,
    private rpc: RpcClientInterface,
    private readProvider: TzReadProvider,
    private returnType: MichelsonV1Expression,
    private code: MichelsonV1ExpressionExtended[],
    private viewParameterType?: MichelsonV1ExpressionExtended
  ) {}

  /**
   * @description According to the tzip-16 standard, the following instructions must not be used in the code of the view:
   * 'AMOUNT', 'CREATE_CONTRACT', 'SENDER', 'SET_DELEGATE', 'SOURCE', and 'TRANSFER_TOKENS'
   * The method throw an error if an illegal instruction is found
   */
  private findForbiddenInstructionInViewCodeError(code: MichelsonV1ExpressionExtended[]) {
    const illegalInstructions = [
      'AMOUNT',
      'CREATE_CONTRACT',
      'SENDER',
      'SET_DELEGATE',
      'SOURCE',
      'TRANSFER_TOKENS',
    ];

    for (const forbiddenInstruction of illegalInstructions) {
      for (const instruction of code) {
        if (instruction.prim === forbiddenInstruction) {
          throw new ForbiddenInstructionInViewCodeError(forbiddenInstruction);
        }
        if (instruction.args && instruction.args.length !== 0) {
          this.findForbiddenInstructionInViewCodeError(instruction.args as any);
        }
      }
    }
  }

  /**
   * @description According to the tzip-16 standard, in the first version of the specification, the instruction SELF should only be used before ADDRESS
   * The method throws an error is the instruction SELF is present, but not followed by ADDRESS
   */
  private illegalUseOfSelfInstruction(code: MichelsonV1ExpressionExtended[]) {
    for (const instruction of code) {
      if (instruction.prim === 'SELF') {
        const index = code.indexOf(instruction);
        const nextInstruction = code[index + 1] ? code[index + 1].prim : undefined;
        if (nextInstruction !== 'ADDRESS') {
          throw new ForbiddenInstructionInViewCodeError(
            'the instruction SELF should only be used before ADDRESS'
          );
        }
      }
      if (instruction.args && instruction.args.length !== 0) {
        this.illegalUseOfSelfInstruction(instruction.args as any);
      }
    }
  }

  /**
   * @description Loops through the view's code and replace SELF, BALANCE, NOW, and CHAIN_ID with Michelson expressions that match the current context, if applicable.
   */
  private adaptViewCodeToContext(
    code: MichelsonV1ExpressionExtended[],
    contractBalance: string,
    blockTimeStamp: string,
    chainId: string
  ) {
    const instructionsToReplace = {
      SELF: [
        { prim: 'PUSH', args: [{ prim: 'address' }, { string: this.contract.address }] },
        { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
        { prim: 'IF_NONE', args: [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }], []] },
      ],
      BALANCE: [{ prim: 'PUSH', args: [{ prim: 'mutez' }, { int: contractBalance }] }],
      NOW: [{ prim: 'PUSH', args: [{ prim: 'timestamp' }, { string: blockTimeStamp }] }],
      CHAIN_ID: [{ prim: 'PUSH', args: [{ prim: 'string' }, { string: chainId }] }],
    };

    code.forEach((x: any, i: any) => {
      for (const instruction in instructionsToReplace) {
        if (x.prim === instruction) {
          code[i] = Object(instructionsToReplace)[instruction];
        }
        if (x.args && x.args.length !== 0) {
          this.adaptViewCodeToContext(x.args, contractBalance, blockTimeStamp, chainId);
        }
      }
    });
    return code;
  }

  private validateArgs = (args: any[], schema: ParameterSchema, viewName: string) => {
    const sigs = schema.ExtractSignatures();

    if (!sigs.find((x: any[]) => x.length === args.length)) {
      throw new InvalidViewParameterError(viewName, sigs, args);
    }
  };

  private formatArgsAndParameter(argView: any[]) {
    let args = argView;
    let viewParameterType = this.viewParameterType;
    if (!viewParameterType) {
      viewParameterType = { args: [], prim: 'unit', annots: [] };
    }

    if (viewParameterType.prim === 'unit') {
      if (args.length === 0) {
        args = ['Unit'];
      }
      if (args.length !== 0 && args[0] !== 'Unit') {
        throw new NoParameterExpectedError(this.viewName, argView);
      }
    }
    const parameterViewSchema = new ParameterSchema(viewParameterType);
    this.validateArgs(args, parameterViewSchema, this.viewName);
    const arg = parameterViewSchema.Encode(...args);
    return { arg, viewParameterType };
  }

  async executeView(...args: any[]) {
    // validate view code against tzip-16 specifications
    this.findForbiddenInstructionInViewCodeError(this.code);
    this.illegalUseOfSelfInstruction(this.code);

    const { arg, viewParameterType } = this.formatArgsAndParameter(args);

    const storageType: any = this.contract.script.code.find((x: any) => x.prim === 'storage');
    const storageArgs = storageType.args[0];

    // currentContext
    const storageValue: any = await this.readProvider.getStorage(this.contract.address, 'head');
    const chainId = await this.readProvider.getChainId();
    const contractBalance = (
      await this.readProvider.getBalance(this.contract.address, 'head')
    ).toString();
    const blockTimestamp = await this.readProvider.getBlockTimestamp('head');

    const code = this.adaptViewCodeToContext(this.code, contractBalance, blockTimestamp, chainId);

    if (!this.viewParameterType) {
      code.unshift({ prim: 'CDR' });
    }

    const viewScript = {
      script: [
        { prim: 'parameter', args: [{ prim: 'pair', args: [viewParameterType, storageArgs] }] },
        { prim: 'storage', args: [{ prim: 'option', args: [this.returnType] }] },
        {
          prim: 'code',
          args: [
            [
              { prim: 'CAR' },
              code,
              { prim: 'SOME' },
              { prim: 'NIL', args: [{ prim: 'operation' }] },
              { prim: 'PAIR' },
            ],
          ],
        },
      ],
      storage: { prim: 'None' },
      input: { prim: 'Pair', args: [arg, storageValue] },
      amount: '0',
      chain_id: chainId,
      balance: '0',
    };

    let result: any;
    try {
      result = await this.rpc.runCode(viewScript as any);
    } catch (error: any) {
      const failWith = validateAndExtractFailwith(error);
      throw failWith
        ? new ViewSimulationError(
            `The simulation of the Michelson view failed with: ${JSON.stringify(failWith)}`,
            this.viewName,
            failWith,
            error
          )
        : error;
    }

    const viewResultSchema = new ParameterSchema(this.returnType);
    return viewResultSchema.Execute(result.storage.args[0]);
  }
}
