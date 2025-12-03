import { ParameterSchema, Schema, ViewSchema, EventSchema } from '@taquito/michelson-encoder';
import {
  EntrypointsResponse,
  MichelsonV1Expression,
  RpcClientInterface,
  ScriptResponse,
} from '@taquito/rpc';
import {
  validateChain,
  validateContractAddress,
  ValidationResult,
} from '@taquito/utils';
import { ChainIds } from '../constants';
import { TzReadProvider } from '../read-provider/interface';
import type { Wallet } from '../wallet/wallet';
import { ContractMethodFactory } from './contract-methods/contract-method-factory';
import { ContractMethodObject } from './contract-methods/contract-method-object-param';
import { OnChainView } from './contract-methods/contract-on-chain-view';
import { InvalidParameterError } from './errors';
import { ContractProvider, StorageProvider } from './interface';
import { InvalidChainIdError, DeprecationError } from '@taquito/core';
import { DEFAULT_SMART_CONTRACT_METHOD_NAME } from './constants';

export { DEFAULT_SMART_CONTRACT_METHOD_NAME };

/**
 * @description Utility class to retrieve data from a smart contract's storage without incurring fees via a contract's view method
 */
export class ContractView {
  constructor(
    private currentContract: ContractAbstraction<ContractProvider | Wallet>,
    private name: string,
    private callbackParametersSchema: ParameterSchema,
    private parameterSchema: ParameterSchema,
    private args: any[],
    private rpc: RpcClientInterface,
    private readProvider: TzReadProvider
  ) { }

  async read(chainId?: ChainIds) {
    const chainIdValidation = validateChain(chainId ?? '');
    if (validateContractAddress(chainId ?? '') == ValidationResult.VALID) {
      throw new DeprecationError(
        `Since version 12, the lambda view no longer depends on a lambda contract. The read method no longer accepts a contract address as a parameter.`
      );
    } else if (chainId && chainIdValidation !== ValidationResult.VALID) {
      throw new InvalidChainIdError(chainId, chainIdValidation);
    }
    const arg = this.parameterSchema.Encode(...this.args);
    const result = await this.rpc.runView({
      contract: this.currentContract.address,
      entrypoint: this.name,
      input: arg,
      chain_id: chainId ? chainId : await this.readProvider.getChainId(),
    });
    return this.callbackParametersSchema.Execute(result.data);
  }
}

const validateArgs = (args: any[], schema: ParameterSchema, name: string) => {
  const sigs = schema.ExtractSignatures();

  if (!sigs.find((x: any[]) => x.length === args.length)) {
    throw new InvalidParameterError(name, sigs, args);
  }
};

// lambda view tzip4
const isView = (entrypoint: MichelsonV1Expression): boolean => {
  let isView = false;
  if ('prim' in entrypoint && entrypoint.prim === 'pair' && entrypoint.args) {
    const lastElement = entrypoint.args[entrypoint.args.length - 1];
    if ('prim' in lastElement && lastElement.prim === 'contract') {
      isView = true;
    }
  }
  return isView;
};

export type Contract = ContractAbstraction<ContractProvider>;
export type WalletContract = ContractAbstraction<Wallet>;

type DefaultMethodsObject<T extends ContractProvider | Wallet> = Record<
  string,
  (args?: any) => ContractMethodObject<T>
>;
type DefaultViews = Record<string, (...args: any[]) => ContractView>;
type DefaultContractViews = Record<string, (args?: any) => OnChainView>;
type DefaultStorage = unknown; // Record<string, unknown>;

type PromiseReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;
export type ContractStorageType<T extends ContractAbstraction<ContractProvider | Wallet>> =
  PromiseReturnType<T['storage']>;
export type DefaultContractType = ContractAbstraction<ContractProvider>;
export type DefaultWalletType = ContractAbstraction<Wallet>;

/**
 * @description Smart contract abstraction
 */
export class ContractAbstraction<
  T extends ContractProvider | Wallet,
  TMethodsObject extends DefaultMethodsObject<T> = DefaultMethodsObject<T>,
  TViews extends DefaultViews = DefaultViews,
  TContractViews extends DefaultContractViews = DefaultContractViews,
  TStorage extends DefaultStorage = DefaultStorage,
> {
  private contractMethodFactory: ContractMethodFactory<T>;
  /**
   * @description Contains methods that are implemented by the target Tezos Smart Contract, and offers the user to call the Smart Contract methods as if they were native TS/JS methods.
   * `methodsObject` serves the exact same purpose as the `methods` member. The difference is that it allows passing the parameter in an object format when calling the smart contract method (instead of the flattened representation)
   * NB: if the contract contains annotation it will include named properties; if not it will be indexed by a number.
   *
   */
  public methodsObject: TMethodsObject = {} as TMethodsObject;
  /**
   * @description Contains lamda views (tzip4) that are implemented by the target Tezos Smart Contract, and offers the user to call the lambda views as if they were native TS/JS methods.
   * NB: These are the view defined in the tzip4 standard, not the views introduced by the Hangzhou protocol.
   */
  public views: TViews = {} as TViews;
  /**
   * @description Contains on-chain views that are defined by the target Tezos Smart Contract, and offers the user to simulate the views execution as if they were native TS/JS methods.
   * NB: the expected format for the parameter when calling a smart contract view is the object format (same format as for the storage) and not the flattened representation.
   *
   */
  public contractViews: TContractViews = {} as TContractViews;

  public readonly schema: Schema;

  public readonly parameterSchema: ParameterSchema;
  public readonly viewSchema: ViewSchema[];
  public readonly eventSchema: EventSchema[];

  constructor(
    public readonly address: string,
    public readonly script: ScriptResponse,
    provider: T,
    private storageProvider: StorageProvider,
    public readonly entrypoints: EntrypointsResponse,
    private rpc: RpcClientInterface,
    private readProvider: TzReadProvider
  ) {
    this.contractMethodFactory = new ContractMethodFactory(provider, address);
    this.schema = Schema.fromRPCResponse({ script: this.script });
    this.parameterSchema = ParameterSchema.fromRPCResponse({ script: this.script });

    this.viewSchema = ViewSchema.fromRPCResponse({ script: this.script });
    if (this.viewSchema.length !== 0) {
      this._initializeOnChainViews(this, rpc, this.readProvider, this.viewSchema);
    }
    this.eventSchema = EventSchema.fromRPCResponse({ script: this.script });
    this._initializeMethods(this, this.entrypoints.entrypoints, this.rpc, this.readProvider);
  }

  private _initializeMethods(
    currentContract: ContractAbstraction<T>,
    entrypoints: {
      [key: string]: object;
    },
    rpc: RpcClientInterface,
    readProvider: TzReadProvider
  ) {
    const parameterSchema = this.parameterSchema;
    const keys = Object.keys(entrypoints);
    if (parameterSchema.isMultipleEntryPoint) {
      keys.forEach((smartContractMethodName) => {
        const smartContractMethodSchema = new ParameterSchema(entrypoints[smartContractMethodName]);

        (this.methodsObject as DefaultMethodsObject<T>)[smartContractMethodName] = function (
          args: any
        ) {
          return currentContract.contractMethodFactory.createContractMethodObjectParam(
            smartContractMethodSchema,
            smartContractMethodName,
            args
          );
        };

        if (isView(entrypoints[smartContractMethodName])) {
          const view = function (...args: any[]) {
            const entrypointParamWithoutCallback = (entrypoints[smartContractMethodName] as any)
              .args[0];
            const smartContractMethodSchemaWithoutCallback = new ParameterSchema(
              entrypointParamWithoutCallback
            );
            const parametersCallback = (entrypoints[smartContractMethodName] as any).args[1]
              .args[0];
            const smartContractMethodCallbackSchema = new ParameterSchema(parametersCallback);

            validateArgs(args, smartContractMethodSchemaWithoutCallback, smartContractMethodName);
            return new ContractView(
              currentContract,
              smartContractMethodName,
              smartContractMethodCallbackSchema,
              smartContractMethodSchemaWithoutCallback,
              args,
              rpc,
              readProvider
            );
          };
          (this.views as DefaultViews)[smartContractMethodName] = view;
        }
      });

      // Deal with methods with no annotations which were not discovered by the RPC endpoint
      // Methods with no annotations are discovered using parameter schema
      const generatedSchema = parameterSchema.generateSchema();
      const schemaKeys = generatedSchema.schema && typeof generatedSchema.schema === 'object'
        ? Object.keys(generatedSchema.schema)
        : [];
      const anonymousMethods = schemaKeys.filter(
        (key) => Object.keys(entrypoints).indexOf(key) === -1
      );

      anonymousMethods.forEach((smartContractMethodName) => {
        (this.methodsObject as DefaultMethodsObject<T>)[smartContractMethodName] = function (
          args: any
        ) {
          return currentContract.contractMethodFactory.createContractMethodObjectParam(
            parameterSchema,
            smartContractMethodName,
            args,
            false,
            true
          );
        };
      });
    } else {
      const smartContractMethodSchema = this.parameterSchema;

      (this.methodsObject as DefaultMethodsObject<T>)[DEFAULT_SMART_CONTRACT_METHOD_NAME] =
        function (args: any) {
          return currentContract.contractMethodFactory.createContractMethodObjectParam(
            smartContractMethodSchema,
            DEFAULT_SMART_CONTRACT_METHOD_NAME,
            args,
            false
          );
        };
    }
  }

  private _initializeOnChainViews(
    currentContract: ContractAbstraction<T>,
    rpc: RpcClientInterface,
    readProvider: TzReadProvider,
    allContractViews: ViewSchema[]
  ) {
    const storageType = this.schema.val;

    allContractViews.forEach((viewSchema) => {
      (this.contractViews as DefaultContractViews)[viewSchema.viewName] = function (args: any) {
        return currentContract.contractMethodFactory.createContractViewObjectParam(
          rpc,
          readProvider,
          viewSchema,
          storageType,
          args
        );
      };
    });
  }

  /**
   * @description Return a friendly representation of the smart contract storage
   */
  public storage<T extends TStorage = TStorage>() {
    return this.storageProvider.getStorage<T>(this.address, this.schema);
  }
}
