import { Schema } from '@taquito/michelson-encoder';
import { ScriptResponse } from '@taquito/rpc';
import { encodeExpr } from '@taquito/utils';
import { OperationBatch } from '../batch/rpc-batch-provider';
import { Context } from '../context';
import { DelegateOperation } from '../operations/delegate-operation';
import { OperationEmitter } from '../operations/operation-emitter';
import { OriginationOperation } from '../operations/origination-operation';
import { TransactionOperation } from '../operations/transaction-operation';
import {
  DelegateParams,
  OriginateParams,
  ParamsWithKind,
  RegisterDelegateParams,
  TransferParams,
} from '../operations/types';
import { ContractAbstraction } from './contract';
import { InvalidDelegationSource } from './errors';
import { ContractProvider, ContractSchema, EstimationProvider, StorageProvider } from './interface';
import {
  createOriginationOperation,
  createRegisterDelegateOperation,
  createSetDelegateOperation,
  createTransferOperation,
} from './prepare';
import { smartContractAbstractionSemantic } from './semantic';

export class RpcContractProvider extends OperationEmitter
  implements ContractProvider, StorageProvider {
  constructor(context: Context, private estimator: EstimationProvider) {
    super(context);
  }
  contractProviderTypeSymbol = Symbol.for('taquito--provider-type-symbol');

  /**
   *
   * @description Return a well formatted json object of the contract storage
   *
   * @param contract contract address you want to get the storage from
   * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  async getStorage<T>(contract: string, schema?: ContractSchema): Promise<T> {
    if (!schema) {
      schema = await this.rpc.getScript(contract);
    }

    let contractSchema: Schema;
    if (Schema.isSchema(schema)) {
      contractSchema = schema;
    } else {
      contractSchema = Schema.fromRPCResponse({ script: schema as ScriptResponse });
    }

    const storage = await this.rpc.getStorage(contract);

    return contractSchema.Execute(storage, smartContractAbstractionSemantic(this)) as T; // Cast into T because only the caller can know the true type of the storage
  }

  /**
   *
   * @description Return a well formatted json object of the contract big map storage
   *
   * @param contract contract address you want to get the storage from
   * @param key contract big map key to fetch value from
   * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
   *
   * @deprecated Deprecated in favor of getBigMapKeyByID
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  async getBigMapKey<T>(contract: string, key: string, schema?: ContractSchema): Promise<T> {
    if (!schema) {
      schema = await this.rpc.getScript(contract);
    }

    let contractSchema: Schema;
    if (Schema.isSchema(schema)) {
      contractSchema = schema;
    } else {
      contractSchema = Schema.fromRPCResponse({ script: schema as ScriptResponse });
    }

    const encodedKey = contractSchema.EncodeBigMapKey(key);

    // tslint:disable-next-line: deprecation
    const val = await this.rpc.getBigMapKey(contract, encodedKey);

    return contractSchema.ExecuteOnBigMapValue(val) as T; // Cast into T because only the caller can know the true type of the storage
  }

  /**
   *
   * @description Return a well formatted json object of a big map value
   *
   * @param id Big Map ID
   * @param keyToEncode key to query (will be encoded properly according to the schema)
   * @param schema Big Map schema (can be determined using your contract type)
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-big-maps-big-map-id-script-expr
   */
  async getBigMapKeyByID<T>(id: string, keyToEncode: string, schema: Schema): Promise<T> {
    const { key, type } = schema.EncodeBigMapKey(keyToEncode);
    const { packed } = await this.context.packer.packData({ data: key, type });

    const encodedExpr = encodeExpr(packed);

    const bigMapValue = await this.context.rpc.getBigMapExpr(id.toString(), encodedExpr);

    return schema.ExecuteOnBigMapValue(bigMapValue, smartContractAbstractionSemantic(this)) as T;
  }

  /**
   *
   * @description Originate a new contract according to the script in parameters. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @warn You cannot specify storage and init at the same time (use init to pass the raw michelson representation of storage)
   *
   * @param OriginationOperation Originate operation parameter
   */
  async originate(params: OriginateParams) {
    const estimate = await this.estimate(params, this.estimator.originate.bind(this.estimator));

    const publicKeyHash = await this.signer.publicKeyHash();
    const operation = await createOriginationOperation(
      await this.context.parser.prepareCodeOrigination({
      ...params,
      ...estimate,
    }));
    const preparedOrigination = await this.prepareOperation({ operation, source: publicKeyHash });
    const forgedOrigination = await this.forge(preparedOrigination);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(forgedOrigination);
    return new OriginationOperation(hash, operation, forgedBytes, opResponse, context, this);
  }

  /**
   *
   * @description Set the delegate for a contract. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param SetDelegate operation parameter
   */
  async setDelegate(params: DelegateParams) {
    // Since babylon delegation source cannot smart contract
    if (/kt1/i.test(params.source)) {
      throw new InvalidDelegationSource(params.source);
    }

    const estimate = await this.estimate(params, this.estimator.setDelegate.bind(this.estimator));
    const operation = await createSetDelegateOperation({ ...params, ...estimate });
    const sourceOrDefault = params.source || (await this.signer.publicKeyHash());
    const opBytes = await this.prepareAndForge({
      operation,
      source: sourceOrDefault,
    });
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new DelegateOperation(
      hash,
      operation,
      sourceOrDefault,
      forgedBytes,
      opResponse,
      context
    );
  }

  /**
   *
   * @description Register the current address as delegate. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param RegisterDelegate operation parameter
   */
  async registerDelegate(params: RegisterDelegateParams) {
    const estimate = await this.estimate(
      params,
      this.estimator.registerDelegate.bind(this.estimator)
    );
    const source = await this.signer.publicKeyHash();
    const operation = await createRegisterDelegateOperation({ ...params, ...estimate }, source);
    const opBytes = await this.prepareAndForge({ operation });
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new DelegateOperation(hash, operation, source, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Transfer tz from current address to a specific address. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param Transfer operation parameter
   */
  async transfer(params: TransferParams) {
    const estimate = await this.estimate(params, this.estimator.transfer.bind(this.estimator));
    const operation = await createTransferOperation({
      ...params,
      ...estimate,
    });
    const source = params.source || (await this.signer.publicKeyHash());
    const opBytes = await this.prepareAndForge({ operation, source: params.source });
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new TransactionOperation(hash, operation, source, forgedBytes, opResponse, context);
  }

  async at<T extends ContractAbstraction<ContractProvider>>(address: string, contractAbstractionComposer: ContractAbstractionComposer<T> = x => x as any): Promise<T> {
    const script = await this.rpc.getScript(address);
    const entrypoints = await this.rpc.getEntrypoints(address);
    const blockHeader = await this.rpc.getBlockHeader();
    const chainId = blockHeader.chain_id;
    const abs = new ContractAbstraction(address, script, this, this, entrypoints, chainId);
    return contractAbstractionComposer(abs, this.context);
  }

  /**
   *
   * @description Batch a group of operation together. Operations will be applied in the order in which they are added to the batch
   *
   * @returns A batch object from which we can add more operation or send a command to execute the batch
   * 
   * @param params List of operation to batch together
   */
  batch(params?: ParamsWithKind[]) {
    const batch = new OperationBatch(this.context, this.estimator);

    if (Array.isArray(params)) {
      batch.with(params);
    }

    return batch;
  }

}

type ContractAbstractionComposer<T> = (abs: ContractAbstraction<ContractProvider>, context: Context) => T 