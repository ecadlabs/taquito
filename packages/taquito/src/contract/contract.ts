import { ParameterSchema, Schema } from '@taquito/michelson-encoder';
import { EntrypointsResponse, RpcClientInterface, ScriptResponse } from '@taquito/rpc';
import { ChainIds, DefaultLambdaAddresses } from '../constants';
import { Wallet } from '../wallet';
import { ContractMethodFactory } from './contract-methods/contract-method-factory';
import { ContractMethod } from './contract-methods/contract-method-flat-param';
import { ContractMethodObject } from './contract-methods/contract-method-object-param';
import { InvalidParameterError, UndefinedLambdaContractError } from './errors';
import { ContractProvider, StorageProvider } from './interface';
import LambdaView from './lambda-view';

export const DEFAULT_SMART_CONTRACT_METHOD_NAME = 'default';

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
    private rpc: RpcClientInterface
  ) { }

  /**
   *
   * @description Simulate a call to a view following the TZIP-4 standard. 
   * See https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-4/tzip-4.md#view-entrypoints. 
   *
   */
  async read(chainId?: ChainIds) {
    const arg = this.parameterSchema.Encode(...this.args);
    const result = await this.rpc.runView({
      contract: this.currentContract.address,
      entrypoint: this.name,
      input: arg,
      chain_id: chainId? chainId: await this.rpc.getChainId()
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

const isView = (schema: ParameterSchema): boolean => {
  let isView = false;
  const sigs = schema.ExtractSignatures();
  if ((sigs[0][sigs[0].length - 1] === 'contract')) {
    isView = true;
  }
  return isView;
};

export type Contract = ContractAbstraction<ContractProvider>;
export type WalletContract = ContractAbstraction<Wallet>;

const isContractProvider = (variableToCheck: any): variableToCheck is ContractProvider =>
  variableToCheck.contractProviderTypeSymbol !== undefined;

/**
 * @description Smart contract abstraction
 */
export class ContractAbstraction<T extends ContractProvider | Wallet> {
  private contractMethodFactory = new ContractMethodFactory<T>()
  /**
   * @description Contains methods that are implemented by the target Tezos Smart Contract, and offers the user to call the Smart Contract methods as if they were native TS/JS methods.
   * NB: if the contract contains annotation it will include named properties; if not it will be indexed by a number.
   *
   */
  public methods: { [key: string]: (...args: any[]) => ContractMethod<T> } = {};
  /**
   * @description Contains methods that are implemented by the target Tezos Smart Contract, and offers the user to call the Smart Contract methods as if they were native TS/JS methods.
   * `methodsObject` serves the exact same purpose as the `methods` member. The difference is that it allows passing the parameter in an object format when calling the smart contract method (instead of the flattened representation)
   * NB: if the contract contains annotation it will include named properties; if not it will be indexed by a number.
   *
   */
  public methodsObject: { [key: string]: (args?: any) => ContractMethodObject<T> } = {};

  public views: { [key: string]: (...args: any[]) => ContractView } = {};

  public readonly schema: Schema;

  public readonly parameterSchema: ParameterSchema;

  constructor(
    public readonly address: string,
    public readonly script: ScriptResponse,
    provider: T,
    private storageProvider: StorageProvider,
    public readonly entrypoints: EntrypointsResponse,
    private rpc: RpcClientInterface
  ) {
    this.schema = Schema.fromRPCResponse({ script: this.script });
    this.parameterSchema = ParameterSchema.fromRPCResponse({ script: this.script });
    this._initializeMethods(this, address, provider, this.entrypoints.entrypoints, this.rpc);
  }

  private _initializeMethods(
    currentContract: ContractAbstraction<T>,
    address: string,
    provider: T,
    entrypoints: {
      [key: string]: object;
    },
    rpc: RpcClientInterface
  ) {
    const parameterSchema = this.parameterSchema;
    const keys = Object.keys(entrypoints);
    if (parameterSchema.isMultipleEntryPoint) {
      keys.forEach(smartContractMethodName => {
        const smartContractMethodSchema = new ParameterSchema(
          entrypoints[smartContractMethodName]
        );

        this.methods[smartContractMethodName] = function (...args: any[]) {
          return currentContract.contractMethodFactory.createContractMethodFlatParams(
            provider,
            address,
            smartContractMethodSchema,
            smartContractMethodName,
            args
          );
        };

        this.methodsObject[smartContractMethodName] = function (args: any) {
          return currentContract.contractMethodFactory.createContractMethodObjectParam(
            provider,
            address,
            smartContractMethodSchema,
            smartContractMethodName,
            args
          );
        };

        if (isContractProvider(provider)) {
          if (isView(smartContractMethodSchema)) {
            const view = function (...args: any[]) {
              const entrypointParamWithoutCallback = (entrypoints[smartContractMethodName] as any).args[0];
              const smartContractMethodSchemaWithoutCallback = new ParameterSchema(
                entrypointParamWithoutCallback
              );
              const parametersCallback = (entrypoints[smartContractMethodName] as any).args[1].args[0];
              const smartContractMethodCallbackSchema = new ParameterSchema(
                parametersCallback
              );

              validateArgs(args, smartContractMethodSchemaWithoutCallback, smartContractMethodName);
              return new ContractView(
                currentContract,
                smartContractMethodName,
                smartContractMethodCallbackSchema,
                smartContractMethodSchemaWithoutCallback,
                args,
                rpc
              );
            };
            this.views[smartContractMethodName] = view;
          }
        }

      });

      // Deal with methods with no annotations which were not discovered by the RPC endpoint
      // Methods with no annotations are discovered using parameter schema
      const anonymousMethods = Object.keys(parameterSchema.ExtractSchema()).filter(
        key => Object.keys(entrypoints).indexOf(key) === -1
      );

      anonymousMethods.forEach(smartContractMethodName => {
        this.methods[smartContractMethodName] = function (...args: any[]) {
          return currentContract.contractMethodFactory.createContractMethodFlatParams(
            provider,
            address,
            parameterSchema,
            smartContractMethodName,
            args,
            false,
            true
          );
        };

        this.methodsObject[smartContractMethodName] = function (args: any) {
          return currentContract.contractMethodFactory.createContractMethodObjectParam(
            provider,
            address,
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
      this.methods[DEFAULT_SMART_CONTRACT_METHOD_NAME] = function (...args: any[]) {
        return currentContract.contractMethodFactory.createContractMethodFlatParams(
          provider,
          address,
          smartContractMethodSchema,
          DEFAULT_SMART_CONTRACT_METHOD_NAME,
          args,
          false
        );
      };

      this.methodsObject[DEFAULT_SMART_CONTRACT_METHOD_NAME] = function (args: any) {
        return currentContract.contractMethodFactory.createContractMethodObjectParam(
          provider,
          address,
          smartContractMethodSchema,
          DEFAULT_SMART_CONTRACT_METHOD_NAME,
          args,
          false
        );
      };
    }
  }

  /**
   * @description Return a friendly representation of the smart contract storage
   */
  public storage<T>() {
    return this.storageProvider.getStorage<T>(this.address, this.schema);
  }

  /**
   *
   * @description Return a friendly representation of the smart contract big map value
   *
   * @param key BigMap key to fetch
   *
   * @deprecated getBigMapKey has been deprecated in favor of getBigMapKeyByID
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-context-contracts-contract-id-big-map-get
   */
  public bigMap(key: string) {
    // tslint:disable-next-line: deprecation
    return this.storageProvider.getBigMapKey(this.address, key, this.schema);
  }
}
