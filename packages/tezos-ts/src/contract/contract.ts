import { Schema, ParameterSchema } from '@tezos-ts/michelson-encoder';
import { ContractProvider } from './interface';

interface SendParams {
  fee?: number;
  storageLimit?: number;
  gasLimit?: number;
  amount?: number;
}

class ContractMethod {
  constructor(
    private provider: ContractProvider,
    private address: string,
    private parameterSchema: ParameterSchema,
    private name: string,
    private args: any[]
  ) {}

  get schema() {
    return this.parameterSchema.isMultipleEntryPoint
      ? this.parameterSchema.ExtractSchema()[this.name]
      : this.parameterSchema.ExtractSchema();
  }

  send({ fee, gasLimit, storageLimit, amount = 0 }: Partial<SendParams> = {}) {
    return this.provider.transfer({
      to: this.address,
      amount,
      fee,
      gasLimit,
      storageLimit,
      parameter: this.parameterSchema.isMultipleEntryPoint
        ? this.parameterSchema.Encode(this.name, ...this.args)
        : this.parameterSchema.Encode(...this.args),
      rawParam: true,
    });
  }
}

function computeLength(data: string | Object) {
  if (typeof data === 'object') {
    return Object.keys(data).length;
  } else {
    return 1;
  }
}
/**
 * @description Smart contract abstraction
 */
export class Contract {
  /**
   * @description Contains smart contract method and allow to call them
   */
  public methods: { [key: string]: (...args: any[]) => ContractMethod } = {};

  constructor(
    public readonly address: string,
    public readonly schema: Schema,
    public readonly parameterSchema: ParameterSchema,
    private provider: ContractProvider
  ) {
    this._initializeMethods(address, parameterSchema, provider);
  }

  private _initializeMethods(
    address: string,
    parameterSchema: ParameterSchema,
    provider: ContractProvider
  ) {
    const paramSchema = parameterSchema.ExtractSchema();

    if (!parameterSchema.hasAnnotation) {
      console.warn('Smart contract do not have annotation methods will be indexes.');
    }

    if (parameterSchema.isMultipleEntryPoint) {
      Object.keys(paramSchema).forEach(smartContractMethodName => {
        const method = function(...args: any[]) {
          const smartContractMethodSchema = paramSchema[smartContractMethodName];
          if (args.length !== computeLength(smartContractMethodSchema)) {
            throw new Error(
              `${smartContractMethodName} Received ${
                args.length
              } arguments while expecting ${computeLength(
                smartContractMethodSchema
              )} (${JSON.stringify(Object.keys(smartContractMethodSchema))})`
            );
          }
          return new ContractMethod(
            provider,
            address,
            parameterSchema,
            smartContractMethodName,
            args
          );
        };
        this.methods[smartContractMethodName] = method;
      });
    } else {
      this.methods['main'] = function(...args: any[]) {
        const smartContractMethodSchema = paramSchema;
        if (args.length !== computeLength(smartContractMethodSchema)) {
          throw new Error(
            `Received ${args.length} arguments while expecting ${computeLength(
              smartContractMethodSchema
            )} (${JSON.stringify(Object.keys(smartContractMethodSchema))})`
          );
        }
        return new ContractMethod(provider, address, parameterSchema, 'main', args);
      };
    }
  }

  /**
   * @description Fetch last smart contract storage
   */
  public storage() {
    return this.provider.getStorage(this.address, this.schema);
  }

  /**
   *
   * @description Fetch a key in the big map of the smart contract
   *
   * @param key BigMap key to fetch
   */
  public bigMap(key: string) {
    return this.provider.getBigMapKey(this.address, key, this.schema);
  }
}
