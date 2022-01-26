import { HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import { BigMapKeyType, MichelsonMap, MichelsonMapKey, Schema } from '@taquito/michelson-encoder';
import { OpKind, ScriptResponse } from '@taquito/rpc';
import { encodeExpr } from '@taquito/utils';
import { OperationBatch } from '../batch/rpc-batch-provider';
import { Context } from '../context';
import { DelegateOperation } from '../operations/delegate-operation';
import { OperationEmitter } from '../operations/operation-emitter';
import { OriginationOperation } from '../operations/origination-operation';
import { RegisterGlobalConstantOperation } from '../operations/register-global-constant-operation';
import { RevealOperation } from '../operations/reveal-operation';
import { TransactionOperation } from '../operations/transaction-operation';
import {
  DelegateParams,
  isOpRequireReveal,
  OriginateParams,
  ParamsWithKind,
  RegisterDelegateParams,
  RegisterGlobalConstantParams,
  RevealParams,
  RPCOperation,
  TransferParams,
  withKind,
} from '../operations/types';
import { ContractAbstraction } from './contract';
import { InvalidDelegationSource } from './errors';
import { ContractProvider, ContractSchema, EstimationProvider, StorageProvider } from './interface';
import {
  createOriginationOperation,
  createRegisterDelegateOperation,
  createRegisterGlobalConstantOperation,
  createRevealOperation,
  createSetDelegateOperation,
  createTransferOperation,
} from './prepare';
import { smartContractAbstractionSemantic } from './semantic';
import { 
  validateAddress,
  validateContractAddress,
  InvalidContractAddressError,
  InvalidAddressError, 
  ValidationResult 
} from '@taquito/utils';
export class RpcContractProvider
  extends OperationEmitter
  implements ContractProvider, StorageProvider
{
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
    if (validateContractAddress(contract) !== ValidationResult.VALID) {
      throw new InvalidContractAddressError(`Invalid contract address: ${contract}`);
    }
    if (!schema) {
      schema = await this.rpc.getNormalizedScript(contract);
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
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-context-contracts-contract-id-big-map-get
   */
  async getBigMapKey<T>(contract: string, key: string, schema?: ContractSchema): Promise<T> {
    if (validateContractAddress(contract) !== ValidationResult.VALID) {
      throw new InvalidContractAddressError(`Invalid contract address: ${contract}`);
    }
    if (!schema) {
      schema = await this.rpc.getNormalizedScript(contract);
    }

    let contractSchema: Schema;
    if (Schema.isSchema(schema)) {
      contractSchema = schema;
    } else {
      contractSchema = Schema.fromRPCResponse({ script: schema as ScriptResponse });
    }

    const encodedKey = contractSchema.EncodeBigMapKey(key);

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
   * @param block optional block level to fetch the values from
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-big-maps-big-map-id-script-expr
   */
  async getBigMapKeyByID<T>(
    id: string,
    keyToEncode: BigMapKeyType,
    schema: Schema,
    block?: number
  ): Promise<T> {
    const { key, type } = schema.EncodeBigMapKey(keyToEncode);
    const { packed } = await this.context.packer.packData({ data: key, type });

    const encodedExpr = encodeExpr(packed);

    const bigMapValue = block
      ? await this.context.rpc.getBigMapExpr(id.toString(), encodedExpr, { block: String(block) })
      : await this.context.rpc.getBigMapExpr(id.toString(), encodedExpr);

    return schema.ExecuteOnBigMapValue(bigMapValue, smartContractAbstractionSemantic(this)) as T;
  }

  /**
   *
   * @description Fetch multiple values in a big map
   * All values will be fetched on the same block level. If a block is specified in the request, the values will be fetched at it.
   * Otherwise, a first request will be done to the node to fetch the level of the head and all values will be fetched at this level.
   * If one of the keys does not exist in the big map, its value will be set to undefined.
   *
   * @param id Big Map ID
   * @param keys Array of keys to query (will be encoded properly according to the schema)
   * @param schema Big Map schema (can be determined using your contract type)
   * @param block optional block level to fetch the values from
   * @param batchSize optional batch size representing the number of requests to execute in parallel
   * @returns A MichelsonMap containing the keys queried in the big map and their value in a well-formatted JSON object format
   *
   */
  async getBigMapKeysByID<T>(
    id: string,
    keys: Array<BigMapKeyType>,
    schema: Schema,
    block?: number,
    batchSize = 5
  ): Promise<MichelsonMap<MichelsonMapKey, T | undefined>> {
    const level = await this.getBlockForRequest(keys, block);
    const bigMapValues = new MichelsonMap<MichelsonMapKey, T | undefined>();

    // Execute batch of promises in series
    let position = 0;
    let results: Array<T | undefined> = [];

    while (position < keys.length) {
      const keysBatch = keys.slice(position, position + batchSize);
      const batch = keysBatch.map((keyToEncode) =>
        this.getBigMapValueOrUndefined<T>(keyToEncode, id, schema, level)
      );
      results = [...results, ...(await Promise.all(batch))];
      position += batchSize;
    }

    for (let i = 0; i < results.length; i++) {
      bigMapValues.set(keys[i], results[i]);
    }

    return bigMapValues;
  }

  private async getBlockForRequest(keys: Array<BigMapKeyType>, block?: number) {
    return keys.length === 1 || typeof block !== 'undefined'
      ? block
      : (await this.rpc.getBlock())?.header.level;
  }

  private async getBigMapValueOrUndefined<T>(
    keyToEncode: BigMapKeyType,
    id: string,
    schema: Schema,
    level?: number
  ) {
    try {
      return await this.getBigMapKeyByID<T>(id, keyToEncode, schema, level);
    } catch (ex) {
      if (ex instanceof HttpResponseError && ex.status === STATUS_CODE.NOT_FOUND) {
        return;
      } else {
        throw ex;
      }
    }
  }

  /**
   *
   * @description Return a well formatted json object of a sapling state
   *
   * @param id Sapling state ID
   * @param block optional block level to fetch the value from
   *
   */
  async getSaplingDiffByID(id: string, block?: number) {
    const saplingState = block
      ? await this.context.rpc.getSaplingDiffById(id.toString(), { block: String(block) })
      : await this.context.rpc.getSaplingDiffById(id.toString());
    return saplingState;
  }

  private async addRevealOperationIfNeeded(operation: RPCOperation, publicKeyHash: string) {
    if (isOpRequireReveal(operation)) {
      const ops: RPCOperation[] = [operation];
      const publicKey = await this.signer.publicKey();
      const estimateReveal = await this.estimator.reveal();
      if (estimateReveal) {
        const reveal: withKind<RevealParams, OpKind.REVEAL> = { kind: OpKind.REVEAL };
        const estimatedReveal = await this.estimate(reveal, async () => estimateReveal);
        ops.unshift(await createRevealOperation({ ...estimatedReveal }, publicKeyHash, publicKey));
        return ops;
      }
    }
    return operation;
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
      })
    );
    const ops = await this.addRevealOperationIfNeeded(operation, publicKeyHash);
    const preparedOrigination = await this.prepareOperation({
      operation: ops,
      source: publicKeyHash,
    });
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
    if ( params.source && validateAddress(params.source) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid source Address: ${params.source}`);
    }
    if (params.delegate && validateAddress(params.delegate) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid delegate Address: ${params.delegate}`);
    }

    // Since babylon delegation source cannot smart contract
    if (/kt1/i.test(params.source)) {
      throw new InvalidDelegationSource(params.source);
    }

    const estimate = await this.estimate(params, this.estimator.setDelegate.bind(this.estimator));
    const publicKeyHash = await this.signer.publicKeyHash();
    const operation = await createSetDelegateOperation({ ...params, ...estimate });
    const sourceOrDefault = params.source || publicKeyHash;
    const ops = await this.addRevealOperationIfNeeded(operation, publicKeyHash);
    const prepared = await this.prepareOperation({
      operation: ops,
      source: sourceOrDefault,
    });
    const opBytes = await this.forge(prepared);
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
    const ops = await this.addRevealOperationIfNeeded(operation, source);
    const prepared = await this.prepareOperation({ operation: ops });
    const opBytes = await this.forge(prepared);
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
    if (validateAddress(params.to) !== ValidationResult.VALID) {
      throw new InvalidAddressError(`Invalid address passed in 'to' parameter: ${params.to}`);
    }
    if (params.source && validateAddress(params.source) !== ValidationResult.VALID) {
      throw new InvalidAddressError(
        `Invalid address passed in 'source' parameter: ${params.source}`
      );
    }

    const publickKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(params, this.estimator.transfer.bind(this.estimator));
    const operation = await createTransferOperation({
      ...params,
      ...estimate,
    });
    const source = params.source || publickKeyHash;
    const ops = await this.addRevealOperationIfNeeded(operation, publickKeyHash);
    const prepared = await this.prepareOperation({ operation: ops, source: params.source });
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new TransactionOperation(hash, operation, source, forgedBytes, opResponse, context);
  }

  /**
   *
   * @description Reveal the current address. Will throw an error if the address is already revealed.
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param RevealParams operation parameter
   */
  async reveal(params: RevealParams) {
    const publicKeyHash = await this.signer.publicKeyHash();
    const estimateReveal = await this.estimator.reveal(params);
    if (estimateReveal) {
      const estimated = await this.estimate(params, async () => estimateReveal);
      const operation = await createRevealOperation(
        {
          ...estimated,
        },
        publicKeyHash,
        await this.signer.publicKey()
      );
      const prepared = await this.prepareOperation({ operation, source: publicKeyHash });
      const opBytes = await this.forge(prepared);
      const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
      return new RevealOperation(hash, operation, publicKeyHash, forgedBytes, opResponse, context);
    } else {
      throw new Error('The current address is already revealed.');
    }
  }

  /**
   *
   * @description Register a Micheline expression in a global table of constants. Will sign and inject an operation using the current context
   *
   * @returns An operation handle with the result from the rpc node
   *
   * @param params registerGlobalConstant operation parameter
   */
  async registerGlobalConstant(params: RegisterGlobalConstantParams) {
    const publickKeyHash = await this.signer.publicKeyHash();
    const estimate = await this.estimate(
      params,
      this.estimator.registerGlobalConstant.bind(this.estimator)
    );
    const operation = await createRegisterGlobalConstantOperation({
      ...params,
      ...estimate,
    });
    const ops = await this.addRevealOperationIfNeeded(operation, publickKeyHash);
    const prepared = await this.prepareOperation({ operation: ops, source: publickKeyHash });
    const opBytes = await this.forge(prepared);
    const { hash, context, forgedBytes, opResponse } = await this.signAndInject(opBytes);
    return new RegisterGlobalConstantOperation(
      hash,
      operation,
      publickKeyHash,
      forgedBytes,
      opResponse,
      context
    );
  }

  async at<T extends ContractAbstraction<ContractProvider>>(
    address: string,
    contractAbstractionComposer: ContractAbstractionComposer<T> = (x) => x as any
  ): Promise<T> {
    if (validateContractAddress(address) !== ValidationResult.VALID) {
      throw new InvalidContractAddressError(`Invalid contract address: ${address}`);
    }
    const rpc = this.context.withExtensions().rpc;
    const script = await rpc.getNormalizedScript(address);
    const entrypoints = await rpc.getEntrypoints(address);
    const blockHeader = await this.rpc.getBlockHeader();
    const chainId = blockHeader.chain_id;
    const abs = new ContractAbstraction(address, script, this, this, entrypoints, chainId, rpc);
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

type ContractAbstractionComposer<T> = (
  abs: ContractAbstraction<ContractProvider>,
  context: Context
) => T;
