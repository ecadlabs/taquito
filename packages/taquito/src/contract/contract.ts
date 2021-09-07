import { ParameterSchema, Schema } from '@taquito/michelson-encoder';
import { EntrypointsResponse, ScriptResponse } from '@taquito/rpc';
import { ChainIds, DefaultLambdaAddresses } from '../constants';
import { TransactionOperation } from '../operations/transaction-operation';
import { TransferParams } from '../operations/types';
import { TransactionWalletOperation, Wallet } from '../wallet';
import { InvalidParameterError, UndefinedLambdaContractError } from './errors';
import { ContractProvider, StorageProvider } from './interface';
import LambdaView from './lambda-view';

interface SendParams {
  fee?: number;
  storageLimit?: number;
  gasLimit?: number;
  amount: number;
  source?: string;
  mutez?: boolean;
}

// Ensure that all parameter that are not in SendParams are defined
type ExplicitTransferParams = Required<Omit<TransferParams, keyof SendParams>> & SendParams;

const DEFAULT_SMART_CONTRACT_METHOD_NAME = 'default';

/**
 * @description Utility class to send smart contract operation
 */
export class ContractMethod<T extends ContractProvider | Wallet> {
  constructor(
    private provider: T,
    private address: string,
    private parameterSchema: ParameterSchema,
    private name: string,
    private args: any[],
    private isMultipleEntrypoint = true,
    private isAnonymous = false
  ) { }

  /**
   * @description Get the schema of the smart contract method
   */
  get schema() {
    return this.isAnonymous
      ? this.parameterSchema.ExtractSchema()[this.name]
      : this.parameterSchema.ExtractSchema();
  }

  /**
   *
   * @description Send the smart contract operation
   *
   * @param Options generic operation parameter
   */
  send(
    params: Partial<SendParams> = {}
  ): Promise<T extends Wallet ? TransactionWalletOperation : TransactionOperation> {
    if (this.provider instanceof Wallet) {
      // TODO got around TS2352: Conversion of type 'T & Wallet' to type 'Wallet' by adding `as unknown`. Needs clarification
      return (this.provider as unknown as Wallet).transfer(this.toTransferParams(params)).send() as any;
    } else {
      return this.provider.transfer(this.toTransferParams(params)) as any;
    }
  }

  /**
   *
   * @description Create transfer params to be used with TezosToolkit.contract.transfer methods
   *
   * @param Options generic transfer operation parameters
   */
  toTransferParams({
    fee,
    gasLimit,
    storageLimit,
    source,
    amount = 0,
    mutez = false,
  }: Partial<SendParams> = {}): TransferParams {
    const fullTransferParams: ExplicitTransferParams = {
      to: this.address,
      amount,
      fee,
      mutez,
      source,
      gasLimit,
      storageLimit,
      parameter: {
        entrypoint: this.isMultipleEntrypoint ? this.name : 'default',
        value: this.isAnonymous
          ? this.parameterSchema.Encode(this.name, ...this.args)
          : this.parameterSchema.Encode(...this.args),
      },
    };
    return fullTransferParams;
  }
}

/**
 * @description Utility class to retrieve data from a smart contract's storage without incurring fees via a contract's view method
 */
export class ContractView {
  constructor(
    private currentContract: ContractAbstraction<ContractProvider | Wallet>,
    private provider: ContractProvider,
    private name: string,
    private chainId: string,
    private callbackParametersSchema: ParameterSchema,
    private parameterSchema: ParameterSchema,
    private args: any[]
  ) { }

  /**
   *
   * @description Find which lambda contract to use based on the current network, 
   * encode parameters to Michelson, 
   * create an instance of Lambdaview to retrive data, and
   * Decode Michelson response 
   *
   * @param Options Address of a lambda contract (sandbox users)
   */
  async read(customLambdaAddress?: string) {

    let lambdaAddress;

    // TODO Verify if the 'customLambdaAdress' is a valid originated contract and if not, return an appropriate error message. 
    if (customLambdaAddress) {
      lambdaAddress = customLambdaAddress
    } else if (this.chainId === ChainIds.EDONET) {
      lambdaAddress = DefaultLambdaAddresses.EDONET
    } else if (this.chainId === ChainIds.FLORENCENET) {
      lambdaAddress = DefaultLambdaAddresses.FLORENCENET
    } else if (this.chainId === ChainIds.GRANADANET) {
      lambdaAddress = DefaultLambdaAddresses.GRANADANET
    } else if (this.chainId === ChainIds.MAINNET) {
      lambdaAddress = DefaultLambdaAddresses.MAINNET
    } else if (this.chainId === ChainIds.FLEXTESANET) {
      lambdaAddress = DefaultLambdaAddresses.FLEXTESANET
    } else {
      throw new UndefinedLambdaContractError()
    }

    const lambdaContract = await this.provider.at(lambdaAddress);
    const arg = this.parameterSchema.Encode(...this.args);
    const lambdaView = new LambdaView(lambdaContract, this.currentContract, this.name, arg);
    const failedWith = await lambdaView.execute();
    const response = this.callbackParametersSchema.Execute(failedWith);
    return response;
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
  /**
   * @description Contains methods that are implemented by the target Tezos Smart Contract, and offers the user to call the Smart Contract methods as if they were native TS/JS methods.
   * NB: if the contract contains annotation it will include named properties; if not it will be indexed by a number.
   *
   */
  public methods: { [key: string]: (...args: any[]) => ContractMethod<T> } = {};

  public views: { [key: string]: (...args: any[]) => ContractView } = {};

  public readonly schema: Schema;

  public readonly parameterSchema: ParameterSchema;

  constructor(
    public readonly address: string,
    public readonly script: ScriptResponse,
    provider: T,
    private storageProvider: StorageProvider,
    public readonly entrypoints: EntrypointsResponse,
    private chainId: string
  ) {
    this.schema = Schema.fromRPCResponse({ script: this.script });
    this.parameterSchema = ParameterSchema.fromRPCResponse({ script: this.script });
    this._initializeMethods(this, address, provider, this.entrypoints.entrypoints, this.chainId);
  }

  private _initializeMethods(
    currentContract: ContractAbstraction<T>,
    address: string,
    provider: T,
    entrypoints: {
      [key: string]: object;
    },
    chainId: string
  ) {
    const parameterSchema = this.parameterSchema;
    const keys = Object.keys(entrypoints);
    if (parameterSchema.isMultipleEntryPoint) {
      keys.forEach(smartContractMethodName => {
        const smartContractMethodSchema = new ParameterSchema(
          entrypoints[smartContractMethodName]
        );
        const method = function (...args: any[]) {

          validateArgs(args, smartContractMethodSchema, smartContractMethodName);

          return new ContractMethod<T>(
            provider,
            address,
            smartContractMethodSchema,
            smartContractMethodName,
            args
          );
        };
        this.methods[smartContractMethodName] = method;

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
                provider,
                smartContractMethodName,
                chainId,
                smartContractMethodCallbackSchema,
                smartContractMethodSchemaWithoutCallback,
                args
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
        const method = function (...args: any[]) {
          validateArgs(
            [smartContractMethodName, ...args],
            parameterSchema,
            smartContractMethodName
          );
          return new ContractMethod<T>(
            provider,
            address,
            parameterSchema,
            smartContractMethodName,
            args,
            false,
            true
          );
        };
        this.methods[smartContractMethodName] = method;
      });
    } else {
      const smartContractMethodSchema = this.parameterSchema;
      const method = function (...args: any[]) {
        validateArgs(args, parameterSchema, DEFAULT_SMART_CONTRACT_METHOD_NAME);
        return new ContractMethod<T>(
          provider,
          address,
          smartContractMethodSchema,
          DEFAULT_SMART_CONTRACT_METHOD_NAME,
          args,
          false
        );
      };
      this.methods[DEFAULT_SMART_CONTRACT_METHOD_NAME] = method;
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
